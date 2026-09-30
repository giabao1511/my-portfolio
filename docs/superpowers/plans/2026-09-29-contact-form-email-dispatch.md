# Contact Form with Real Email Dispatch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional contact form that sends real emails via Resend with Zod validation, React Hook Form, and Sonner toast notifications.

**Architecture:** Serverless API route in Next.js App Router handles email dispatch via Resend. Frontend uses React Hook Form with Zod schema, controlled component state, and Sonner toasts for feedback.

**Tech Stack:** Next.js App Router, Resend, Zod, React Hook Form, Sonner

**Spec:** This plan implements the bounded design approved in the brainstorming session.

---

## Global Constraints

- Use existing patterns in the codebase
- Keep dependencies minimal
- Use `pnpm` as package manager (from package.json)

---

## Review Focus

- Empty form submission → handled by Zod validation (required fields)
- Invalid email format → handled by Zod email regex
- Network failure → caught by try/catch, shown via toast
- Rate limiting → returned from API, shown via toast
- Missing/invalid API key → API returns 500, toast shows generic error

---

## Task Structure

### Task 1: Install Dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

Run: `pnpm add zod react-hook-form sonner && pnpm add -D @types/node`

---

### Task 2: Create API Route with Resend

**Files:**

- Create: `app/api/contact/route.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Create the API route**

Create `app/api/contact/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = result.data;
    const { RESEND_API_KEY, CONTACT_EMAIL } = process.env;

    if (!RESEND_API_KEY || !CONTACT_EMAIL) {
      console.error(
        "Missing RESEND_API_KEY or CONTACT_EMAIL environment variables",
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [CONTACT_EMAIL],
        subject: subject || `New Contact from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "No subject"}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
        reply_to: email,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Create environment variables example file**

Create `.env.local.example`:

```
# Resend API Key (get from https://resend.com)
RESEND_API_KEY=re_your_api_key_here

# Email address to receive contact form submissions
CONTACT_EMAIL=your@email.com
```

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts .env.local.example
git commit -m "feat: add contact form API route with Resend"
```

---

### Task 3: Add Sonner Provider to Layout

**Files:**

- Modify: `app/layout.tsx`

- [ ] **Step 1: Read current layout.tsx**

```bash
cat app/layout.tsx
```

- [ ] **Step 2: Add Sonner toaster component**

Add `import { Toaster } from "sonner";` and `<Toaster position="bottom-right" richColors closeButton />` inside the body (before closing tag).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add Sonner toaster provider to layout"
```

---

### Task 4: Refactor ContactForm with Zod + React Hook Form + Sonner

**Files:**

- Modify: `app/components/contact/ContactForm.tsx`

- [ ] **Step 1: Write the new ContactForm implementation**

Replace the entire content of `app/components/contact/ContactForm.tsx` with:

```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message received!", {
        description: "I will get back to you within 24 hours.",
        duration: 5000,
      });

      setIsSuccess(true);
      reset();
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
        duration: 5000,
      });
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-emerald/20 flex items-center justify-center"
        >
          <CheckCircle className="w-8 h-8 text-accent-emerald" />
        </motion.div>
        <h3 className="text-2xl font-bold text-zinc-50 mb-2">Message Sent!</h3>
        <p className="text-zinc-400">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Name <span className="text-accent-cyan">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-zinc-900/50 border text-zinc-50",
            "focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all",
            errors.name
              ? "border-red-500"
              : "border-zinc-800 focus:border-accent-cyan",
          )}
          placeholder="Your name"
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.name.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Email <span className="text-accent-cyan">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-zinc-900/50 border text-zinc-50",
            "focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all",
            errors.email
              ? "border-red-500"
              : "border-zinc-800 focus:border-accent-cyan",
          )}
          placeholder="your.email@example.com"
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          {...register("subject")}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan transition-all"
          placeholder="What's this about?"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Message <span className="text-accent-cyan">*</span>
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={5}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-zinc-900/50 border text-zinc-50 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all",
            errors.message
              ? "border-red-500"
              : "border-zinc-800 focus:border-accent-cyan",
          )}
          placeholder="Tell me about your project..."
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.message.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
          "bg-accent-cyan text-zinc-950 hover:shadow-glow-cyan",
          isSubmitting && "opacity-70 cursor-not-allowed",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Install @hookform/resolvers**

Run: `pnpm add @hookform/resolvers`

- [ ] **Step 3: Commit**

```bash
git add app/components/contact/ContactForm.tsx
git commit -m "feat: refactor ContactForm with Zod, React Hook Form, and Sonner"
```

---

### Task 5: Verify Build

**Files:**

- None (verification only)

- [ ] **Step 1: Run typecheck**

Run: `pnpm typecheck`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: Successful build

- [ ] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: complete contact form with real email dispatch

- Add Zod validation schema
- Integrate React Hook Form with @hookform/resolvers
- Add Sonner toast notifications
- Create Resend API route for email dispatch
- Add Sonner provider to layout"
```

---

## Summary

| Task | Description                                                              |
| ---- | ------------------------------------------------------------------------ |
| 1    | Install dependencies (zod, react-hook-form, sonner, @hookform/resolvers) |
| 2    | Create API route at app/api/contact/route.ts with Resend                 |
| 3    | Add Sonner toaster to layout.tsx                                         |
| 4    | Refactor ContactForm.tsx with Zod + React Hook Form + Sonner             |
| 5    | Verify build passes                                                      |

---

## Setup Instructions for User

After merging, the user needs to:

1. Copy `.env.local.example` to `.env.local`
2. Get a Resend API key from https://resend.com
3. Add `RESEND_API_KEY` and `CONTACT_EMAIL` to `.env.local`
