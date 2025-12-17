import type { Env } from "../env";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(env: Env, options: EmailOptions): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.log("Email skipped (no RESEND_API_KEY):", options.subject);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Test Project 2 <noreply@test-project-2.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const error = await response.json() as { message?: string };
    console.error("Email failed:", error);
  }
}

export function welcomeEmailTemplate(name: string): { subject: string; html: string } {
  return {
    subject: "Welcome to Test Project 2!",
    html: `
      <h1>Welcome, ${name || "there"}!</h1>
      <p>Thank you for signing up for Test Project 2.</p>
      <p>Get started by exploring your dashboard.</p>
      <a href="https://test-project-2.spinitup.dev/dashboard">Go to Dashboard</a>
    `,
  };
}
