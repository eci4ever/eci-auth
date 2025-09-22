"use server";

import { redirect } from "next/navigation";

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

  // Basic validation
  if (!email || !password) {
    return {
      error: "Email and password are required",
      formData: { email, password },
    };
  }

  if (!email.includes("@")) {
    return {
      error: "Please enter a valid email address",
      formData: { email, password },
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters",
      formData: { email, password },
    };
  }

  try {
    // TODO: Implement actual authentication logic here
    // For now, simulate authentication
    console.log("Sign in attempt:", { email, password });

    // Simulate success - replace with actual auth logic
    if (email === "test@example.com" && password === "password") {
      redirect("/dashboard");
    } else {
      return {
        error: "Invalid email or password",
        formData: { email, password },
      };
    }
  } catch (error) {
    console.error("Sign in error:", error);
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

  // Basic validation
  if (!name || !email || !password) {
    return {
      error: "All fields are required",
      formData: { name, email, password },
    };
  }

  if (!email.includes("@")) {
    return {
      error: "Please enter a valid email address",
      formData: { name, email, password },
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters",
      formData: { name, email, password },
    };
  }

  if (name.length < 2) {
    return {
      error: "Name must be at least 2 characters",
      formData: { name, email, password },
    };
  }

  try {
    // TODO: Implement actual user registration logic here
    // For now, simulate registration
    console.log("Sign up attempt:", { name, email, password });

    // Simulate success - replace with actual auth logic
    return { success: "Account created successfully! Please sign in." };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      error: "An error occurred during registration",
      formData: { name, email, password },
    };
  }
}
