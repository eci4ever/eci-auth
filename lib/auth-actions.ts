"use server";

import { signUpSchema, signInSchema, emailOnlySchema, resetPasswordSchema } from "./validations";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";
import { auth, signIn } from "@/auth";
import { randomBytes } from "crypto";

export interface AuthState {
  error?: string;
  success?: string;
  formData?: {
    email?: string;
    password?: string;
    name?: string;
  };
}

export async function signInAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsedData = signInSchema.safeParse({ email, password });

  if (!parsedData.success) {
    const firstError = parsedData.error.issues[0];
    return {
      error: firstError.message,
      formData: { email, password },
    };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail, // case insensitive
    },
    select: {
      id: true, // hanya select id untuk efficiency
      email: true,
      password: true,
      failedLoginAttempts: true,
      lockUntil: true,
    },
  });

  const genericError = "Invalid email or password";

  if (!user || !user.email) {
    return {
      error: genericError,
      formData: { email, password },
    };
  }

  // Check lockout window (if field exists)
  const lockUntil = user.lockUntil;
  if (lockUntil && new Date(lockUntil) > new Date()) {
    return { error: genericError, formData: { email, password } };
  }

  const isPasswordValid = await bcrypt.compare(
    password as string,
    user.password as string
  );

  if (!isPasswordValid) {
    const failedLoginAttempts = user.failedLoginAttempts ?? 0;
    const newAttempts = failedLoginAttempts + 1;
    const shouldLock = newAttempts >= 5;
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: shouldLock ? 0 : newAttempts,
          lockUntil: shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      });
    } catch {}
    return { error: genericError, formData: { email, password } };
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
    // reset counters on success (paranoia)
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockUntil: null },
      });
    } catch {}
    return { success: "Signed in successfully!" };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      error: genericError,
      formData: { email, password },
    };
  }
}

export async function signUpAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = (formData.get("name") as string)?.trim();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsedData = signUpSchema.safeParse({ name, email, password });

  if (!parsedData.success) {
    const firstError = parsedData.error.issues[0];
    return {
      error: firstError.message,
      formData: { name, email, password },
    };
  }
  // Check if user already exists
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail, // case insensitive
    },
    select: {
      id: true, // hanya select id untuk efficiency
    },
  });
  if (user) {
    return {
      error: "Email is already registered",
      formData: { name, email, password },
    };
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        roles: {
          create: {
            role: { connect: { name: "Viewer" } },
          },
        },
      },
    });

    return { success: "Account created successfully! Please sign in." };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      error: "An error occurred during registration",
      formData: { name, email, password },
    };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const userWithRelations = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithRelations) return null;

    const roles = userWithRelations.roles.map((r) => r.role.name);
    const permissions = userWithRelations.roles.flatMap((r) =>
      r.role.permissions.map((p) => p.permission.name)
    );

    const { id, name, email, image } = userWithRelations;
    return { id, name, email, image, roles, permissions };
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function getUserRolesAndPermissions(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return { roles: [], permissions: [] };

  const roles = user.roles.map((r) => r.role.name);
  const permissions = user.roles.flatMap((r) =>
    r.role.permissions.map((p) => p.permission.name)
  );

  return { roles, permissions };
}

// ===== Email Verification & Password Reset =====
function createRandomToken(length = 48): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    // Node.js fallback
    return randomBytes(length).toString("hex");
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function requestEmailVerification(prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string) ?? "";
  const parsed = emailOnlySchema.safeParse({ email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, formData: { email } };
  }
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    // Jangan dedahkan kewujudan akaun
    return { success: "If the email exists, a verification link has been sent." };
  }
  const token = createRandomToken(24);
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 jam
  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: normalizedEmail, token } },
    update: { token, expires },
    create: { identifier: normalizedEmail, token, expires },
  });

  // TODO: Hantar emel sebenar. Buat masa ini, log link ke server.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizedEmail)}`;
  if (process.env.NODE_ENV !== "production") {
    console.log("[DEV] Verify URL:", verifyUrl);
  }
  try { await sendVerificationEmail(normalizedEmail, verifyUrl); } catch (e) { console.error("sendVerificationEmail failed", e); }
  return { success: "Verification link sent to your email." };
}

export async function verifyEmail(token: string, email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: normalizedEmail, token } },
  });
  if (!record || record.expires < new Date()) {
    return false;
  }
  await prisma.$transaction([
    prisma.user.update({ where: { email: normalizedEmail }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.delete({ where: { identifier_token: { identifier: normalizedEmail, token } } }),
  ]);
  return true;
}

export async function requestPasswordReset(prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string) ?? "";
  const parsed = emailOnlySchema.safeParse({ email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, formData: { email } };
  }
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return { success: "If the email exists, a reset link has been sent." };
  }
  const token = createRandomToken(24);
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: normalizedEmail, token } },
    update: { token, expires },
    create: { identifier: normalizedEmail, token, expires },
  });
  const baseUrl2 = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl2}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizedEmail)}`;
  if (process.env.NODE_ENV !== "production") {
    console.log("[DEV] Reset URL:", resetUrl);
  }
  try { await sendPasswordResetEmail(normalizedEmail, resetUrl); } catch (e) { console.error("sendPasswordResetEmail failed", e); }
  return { success: "Password reset link sent if the email exists." };
}

export async function resetPassword(prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string) ?? "";
  const token = (formData.get("token") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";
  const parsed = resetPasswordSchema.safeParse({ email, token, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const normalizedEmail = email.toLowerCase().trim();
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: normalizedEmail, token } },
  });
  if (!record || record.expires < new Date()) {
    return { error: "Invalid or expired token" };
  }
  await prisma.$transaction([
    prisma.user.update({ where: { email: normalizedEmail }, data: { password: await bcrypt.hash(password, 10) } }),
    prisma.verificationToken.delete({ where: { identifier_token: { identifier: normalizedEmail, token } } }),
  ]);
  return { success: "Password has been reset. You can now sign in." };
}
