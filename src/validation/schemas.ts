import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional()
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});

export const passwordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});

export const roleSchema = z.object({
  name: z.string().min(2).regex(/^[A-Z_]+$/),
  description: z.string().optional()
});

export const permissionSchema = z.object({
  name: z.string().min(2).regex(/^[A-Z_]+$/),
  description: z.string().optional()
});