import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "mail.contentrich.nl";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER ?? "info@contentrich.nl";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const SMTP_FROM = process.env.SMTP_FROM ?? "Contentrich <info@contentrich.nl>";

let transporter: Transporter;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false, // STARTTLS on port 587
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return transporter;
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  code: string
): Promise<void> {
  const mail = getTransporter();

  await mail.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Verifieer je e-mailadres — Contentrich",
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111; margin-bottom: 8px;">Welkom, ${name}!</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Gebruik de onderstaande code om je e-mailadres te verifiëren:
        </p>
        <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111;">${code}</span>
        </div>
        <p style="color: #888; font-size: 13px;">
          Deze code is 15 minuten geldig. Als je dit niet hebt aangevraagd, kun je deze e-mail negeren.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Contentrich — AI Social Media Manager
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  code: string
): Promise<void> {
  const mail = getTransporter();

  await mail.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Wachtwoord resetten — Contentrich",
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111; margin-bottom: 8px;">Wachtwoord resetten</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Hallo ${name}, gebruik de onderstaande code om je wachtwoord te resetten:
        </p>
        <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111;">${code}</span>
        </div>
        <p style="color: #888; font-size: 13px;">
          Deze code is 15 minuten geldig.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Contentrich — AI Social Media Manager
        </p>
      </div>
    `,
  });
}
