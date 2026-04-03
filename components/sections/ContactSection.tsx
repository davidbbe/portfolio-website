"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { footerContact } from "@/lib/content/sections";
import { sendContactFormEmail } from "@/actions/sendEmail";

export default function ContactSection() {
  const [pending, setPending] = useState(false);

  return (
    <section
      id="contact"
      data-scene-section="contact"
      data-reveal-variant="softReveal"
      className="creative-section creative-section--contact"
    >
      <p data-reveal className="eyebrow">
        Contact
      </p>
      <h2 data-reveal className="section-title">
        {footerContact.title}
      </h2>
      <p data-reveal className="section-copy">
        {footerContact.body}
      </p>

      <form
        data-reveal
        className="creative-contact-form"
        action={async (formData) => {
          setPending(true);
          const { error } = await sendContactFormEmail(formData);
          setPending(false);
          if (error) {
            toast.error(error);
            return;
          }
          toast.success("Email sent successfully!");
        }}
      >
        <input
          className="creative-contact-form__input"
          name="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
          autoComplete="email"
        />
        <textarea
          className="creative-contact-form__textarea"
          name="message"
          placeholder="Your message"
          required
          maxLength={5000}
          rows={6}
        />
        <button
          type="submit"
          className="creative-btn creative-btn--solid creative-contact-form__submit"
          disabled={pending}
        >
          {pending ? (
            <span className="creative-contact-form__spinner" aria-hidden />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </section>
  );
}
