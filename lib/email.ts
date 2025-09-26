import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, url: string) {
  if (!process.env.RESEND_FROM) throw new Error("Missing RESEND_FROM");
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: ["eci4ever@gmail.com"],
    subject: "Verify your email",
    html: `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.6">
        <h2>Verify your email</h2>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${url}" target="_blank" rel="noopener noreferrer">Verify Email</a></p>
        <p>This link will expire shortly. If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  if (!process.env.RESEND_FROM) throw new Error("Missing RESEND_FROM");
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: ["eci4ever@gmail.com"],
    subject: "Reset your password",
    html: `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.6">
        <h2>Reset your password</h2>
        <p>Click the link below to set a new password:</p>
        <p><a href="${url}" target="_blank" rel="noopener noreferrer">Reset Password</a></p>
        <p>This link will expire shortly. If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}
