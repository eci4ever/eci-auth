import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.EMAIL_FROM) throw new Error("Missing EMAIL_FROM");

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(to: string, url: string) {
  await sendEmail(
    to,
    "Verify your email",
    `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.6">
        <h2>Verify your email</h2>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${url}" target="_blank" rel="noopener noreferrer">Verify Email</a></p>
        <p>This link will expire shortly. If you did not request this, please ignore this email.</p>
      </div>
    `
  );
}

export async function sendPasswordResetEmail(to: string, url: string) {
  await sendEmail(
    to,
    "Reset your password",
    `
      <div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.6">
        <h2>Reset your password</h2>
        <p>Click the link below to set a new password:</p>
        <p><a href="${url}" target="_blank" rel="noopener noreferrer">Reset Password</a></p>
        <p>This link will expire shortly. If you did not request this, please ignore this email.</p>
      </div>
    `
  );
}
