"use server";

import { signUpSchema, signInSchema } from "./validations";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";
import { signIn } from "@/auth";

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

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim(), // case insensitive
    },
    select: {
      id: true, // hanya select id untuk efficiency
      email: true,
      password: true,
    },
  });

  if (!user || !user.email) {
    return {
      error: "No account found with this email",
      formData: { email, password },
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password as string,
    user.password as string
  );

  if (!isPasswordValid) {
    return {
      error: "Invalid password",
      formData: { email, password },
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: "Signed in successfully!" };
  } catch (error) {
    console.log("Sign in error:", error);
    return {
      error: "An error occurred during sign in",
      formData: { email, password },
    };
  }
}

export async function signUpAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = formData.get("name") as string;
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
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim(), // case insensitive
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
        email,
        password: await bcrypt.hash(password, 10),
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
