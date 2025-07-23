import { Role } from "@prisma/client";
import { z, ZodType } from "zod";

export class UserValidation {
  static register: ZodType = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    remember_me: z.boolean(),
    re_captcha_token: z.string(),
  });
  static login: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean(),
    re_captcha_token: z.string(),
  });

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
