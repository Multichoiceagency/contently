import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

// ContentRich pricing plans — cheaper than ContentStudio
export const PLANS = {
  starter: {
    name: "Starter",
    monthlyPrice: 1400, // $14/mo
    yearlyPrice: 11100, // $111/yr ($9.25/mo)
    features: {
      workspaces: 1,
      socialAccounts: 5,
      users: 1,
      aiCredits: 25000,
    },
  },
  professional: {
    name: "Professional",
    monthlyPrice: 3500, // $35/mo
    yearlyPrice: 27700, // $277/yr ($23.08/mo)
    features: {
      workspaces: 2,
      socialAccounts: 10,
      users: 3,
      aiCredits: 50000,
    },
  },
  agency: {
    name: "Agency",
    monthlyPrice: 6900, // $69/mo
    yearlyPrice: 54700, // $547/yr ($45.58/mo)
    features: {
      workspaces: -1, // unlimited
      socialAccounts: 25,
      users: -1, // unlimited
      aiCredits: 150000,
    },
  },
} as const;

type PlanKey = keyof typeof PLANS;

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" as any });
}

const checkoutSchema = z.object({
  plan: z.enum(["starter", "professional", "agency"]),
  period: z.enum(["monthly", "yearly"]),
  workspaceId: z.string().min(1),
});

const portalSchema = z.object({
  workspaceId: z.string().min(1),
});

export default async function stripeRoutes(fastify: FastifyInstance) {
  // POST /stripe/checkout — create a Stripe Checkout session
  fastify.post(
    "/stripe/checkout",
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = checkoutSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { plan, period, workspaceId } = parseResult.data;

      // Verify user is owner of workspace
      const membership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: request.userId,
            workspaceId,
          },
        },
      });

      if (!membership || membership.role !== "owner") {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Only workspace owners can manage subscriptions",
        });
      }

      const stripe = getStripe();
      const planConfig = PLANS[plan as PlanKey];
      const priceAmount =
        period === "yearly" ? planConfig.yearlyPrice : planConfig.monthlyPrice;
      const interval = period === "yearly" ? "year" : "month";

      // Get or create Stripe customer
      let subscription = await prisma.subscription.findUnique({
        where: { workspaceId },
      });

      let customerId = subscription?.stripeCustomerId;

      if (!customerId) {
        const user = await prisma.user.findUnique({
          where: { id: request.userId },
        });

        const customer = await stripe.customers.create({
          email: user!.email,
          name: user!.name,
          metadata: { workspaceId, userId: request.userId },
        });

        customerId = customer.id;

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { stripeCustomerId: customerId },
          });
        } else {
          subscription = await prisma.subscription.create({
            data: {
              workspaceId,
              stripeCustomerId: customerId,
              plan: "free",
              status: "active",
            },
          });
        }
      }

      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `ContentRich ${planConfig.name}`,
                description: `${planConfig.name} plan — ${period} billing`,
              },
              unit_amount: priceAmount,
              recurring: { interval },
            },
            quantity: 1,
          },
        ],
        metadata: {
          workspaceId,
          plan,
          period,
        },
        success_url: `${frontendUrl}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${frontendUrl}/pricing?canceled=true`,
        allow_promotion_codes: true,
      });

      return reply.send({ url: session.url });
    }
  );

  // POST /stripe/portal — create a billing portal session
  fastify.post(
    "/stripe/portal",
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = portalSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { workspaceId } = parseResult.data;

      const subscription = await prisma.subscription.findUnique({
        where: { workspaceId },
      });

      if (!subscription?.stripeCustomerId) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "No active subscription found",
        });
      }

      const stripe = getStripe();
      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:3000";

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${frontendUrl}/dashboard/settings`,
      });

      return reply.send({ url: session.url });
    }
  );

  // GET /stripe/subscription/:workspaceId — get current subscription info
  fastify.get(
    "/stripe/subscription/:workspaceId",
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { workspaceId } = request.params as { workspaceId: string };

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: request.userId,
            workspaceId,
          },
        },
      });

      if (!membership) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You are not a member of this workspace",
        });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { workspaceId },
      });

      if (!subscription) {
        return reply.send({
          plan: "free",
          status: "active",
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        });
      }

      return reply.send({
        plan: subscription.plan,
        status: subscription.status,
        stripePriceId: subscription.stripePriceId,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      });
    }
  );

  // POST /stripe/webhook — handle Stripe webhook events
  fastify.post(
    "/stripe/webhook",
    {
      config: {
        rawBody: true,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const stripe = getStripe();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        fastify.log.error("STRIPE_WEBHOOK_SECRET not configured");
        return reply.status(500).send({ error: "Webhook not configured" });
      }

      const signature = request.headers["stripe-signature"] as string;
      let event: Stripe.Event;

      try {
        const rawBody = (request as any).rawBody as string;
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret
        );
      } catch (err: any) {
        fastify.log.error(`Webhook signature verification failed: ${err.message}`);
        return reply.status(400).send({ error: "Invalid signature" });
      }

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const workspaceId = session.metadata?.workspaceId;
          const plan = session.metadata?.plan;
          const subscriptionId = session.subscription as string;

          if (workspaceId && plan && subscriptionId) {
            // Get subscription details from Stripe
            const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

            await prisma.subscription.upsert({
              where: { workspaceId },
              update: {
                plan,
                status: "active",
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: session.customer as string,
                stripePriceId: stripeSub.items.data[0]?.price?.id || null,
                currentPeriodEnd: new Date(
                  stripeSub.current_period_end * 1000
                ),
                cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
              },
              create: {
                workspaceId,
                plan,
                status: "active",
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: session.customer as string,
                stripePriceId: stripeSub.items.data[0]?.price?.id || null,
                currentPeriodEnd: new Date(
                  stripeSub.current_period_end * 1000
                ),
              },
            });

            // Also update workspace plan field
            await prisma.workspace.update({
              where: { id: workspaceId },
              data: { plan },
            });
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          const subRecord = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (subRecord) {
            const status =
              subscription.status === "active" ||
              subscription.status === "trialing"
                ? "active"
                : subscription.status === "past_due"
                ? "past_due"
                : "canceled";

            await prisma.subscription.update({
              where: { id: subRecord.id },
              data: {
                status,
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                stripePriceId:
                  subscription.items.data[0]?.price?.id || subRecord.stripePriceId,
              },
            });
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const subRecord = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (subRecord) {
            await prisma.subscription.update({
              where: { id: subRecord.id },
              data: {
                status: "canceled",
                plan: "free",
                cancelAtPeriodEnd: false,
              },
            });

            await prisma.workspace.update({
              where: { id: subRecord.workspaceId },
              data: { plan: "free" },
            });
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = invoice.subscription as string;

          if (subscriptionId) {
            const subRecord = await prisma.subscription.findUnique({
              where: { stripeSubscriptionId: subscriptionId },
            });

            if (subRecord) {
              await prisma.subscription.update({
                where: { id: subRecord.id },
                data: { status: "past_due" },
              });
            }
          }
          break;
        }
      }

      return reply.send({ received: true });
    }
  );
}
