import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const emailOnlySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
export type EmailOnlyInput = z.infer<typeof emailOnlySchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  token: z.string().min(10, "Invalid token"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
