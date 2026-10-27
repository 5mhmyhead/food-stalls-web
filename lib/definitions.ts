import { z } from "zod";

const username = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, {
    error: "Username: 3-20 letters, numbers or underscores.",
  });

export const SignInSchema = z.object({
  username,
  password: z.string().min(1),
});

export const SignUpSchema = z
  .object({
    username,
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({ error: "Enter a valid email address." })),
    password: z
      .string()
      .min(8, { error: "Password needs at least 8 characters." })
      .regex(/[a-z]/, { error: "Password needs a lowercase letter." })
      .regex(/[A-Z]/, { error: "Password needs an uppercase letter." })
      .regex(/\d/, { error: "Password needs a number." }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Enter a valid email address." })),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Password needs at least 8 characters." })
      .regex(/[a-z]/, { error: "Password needs a lowercase letter." })
      .regex(/[A-Z]/, { error: "Password needs an uppercase letter." })
      .regex(/\d/, { error: "Password needs a number." }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });
