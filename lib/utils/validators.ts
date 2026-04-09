import * as z from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const waitlistSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  contactNumber: z.string().min(1, "Contact number is required"),
  teamSize: z.string().min(1, "Please select team size"),
  useCase: z.enum(["Backend", "Frontend", "CloudInfrastructure", "Other"], {
    message: "Please select a use case",
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;

export const onboardingSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  orgSlug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  teamSize: z.string().optional(),
  role: z.string().min(1, "Please select your role"),
  notes: z.string().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
