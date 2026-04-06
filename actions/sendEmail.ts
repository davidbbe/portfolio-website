"use server";

import React from "react";
import { Resend } from "resend";
import {
  validateString,
  getErrorMessage,
  isValidEmailShape,
} from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

const DEFAULT_TO = "david123beauchamp@gmail.com";
const DEFAULT_FROM = "Email service <onboarding@resend.dev>";

export async function sendContactFormEmail(formData: FormData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { error: "Email service is not configured." };
  }

  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  if (!validateString(senderEmail, 500) || !isValidEmailShape(senderEmail)) {
    return { error: "Invalid sender email" };
  }
  if (!validateString(message, 5000)) {
    return { error: "Invalid message" };
  }

  const replyTo = senderEmail.trim();

  const to = process.env.CONTACT_INBOX_EMAIL ?? DEFAULT_TO;
  const from = process.env.RESEND_FROM ?? DEFAULT_FROM;

  try {
    const resend = new Resend(apiKey);
    const data = await resend.emails.send({
      from,
      to,
      replyTo,
      subject: "Message from portfolio contact form",
      react: React.createElement(ContactFormEmail, {
        message,
        senderEmail,
      }),
    });
    return { data };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}
