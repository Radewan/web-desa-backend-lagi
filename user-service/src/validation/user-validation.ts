import { Role } from "@prisma/client";
import { z, ZodType } from "zod";

export class UserValidation {
  static register: ZodType = z
    .object({
      name: z.string(),
      phone_number: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6),
      confirm_password: z.string().min(6),
      remember_me: z.boolean(),
      recaptcha_token: z.string(),
    })
    .refine(
      (data) => {
        const emailFilled = !!data.email;
        const phoneFilled = !!data.phone_number;
        return emailFilled !== phoneFilled;
      },
      {
        message: "Fill in either email or phone number, not both",
        path: ["email", "phone_number"],
      }
    )
    .refine((data) => data.password === data.confirm_password, {
      message: "Password and confirmation do not match",
      path: ["confirm_password"],
    });

  static login: ZodType = z
    .object({
      phone_number: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6),
      remember_me: z.boolean(),
      recaptcha_token: z.string(),
    })
    .refine(
      (data) => {
        const emailFilled = !!data.email;
        const phoneFilled = !!data.phone_number;
        return emailFilled !== phoneFilled;
      },
      {
        message: "Fill in either email or phone number, not both",
        path: ["email", "phone_number"],
      }
    );

  static forgotPassword: ZodType = z.object({
    email: z.string().email(),
  });

  static resetPassword: ZodType = z.object({
    password: z.string().min(6),
    confirm_password: z.string().min(6),
  });

  static update: ZodType = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone_number: z.string().optional(),
    password: z.string().min(6).optional(),
  });

  static createUser: ZodType = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    role: z.nativeEnum(Role),
  });

  static updateRole: ZodType = z.nativeEnum(Role);
}
