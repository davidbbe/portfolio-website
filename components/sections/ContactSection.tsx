"use client";

import { useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { footerContact } from "@/lib/content/sections";
import { sendContactFormEmail } from "@/actions/sendEmail";

type FormStatus = "idle" | "sending" | "success" | "error";

function SendIcon() {
  return (
    <svg
      className="contact-btn-icon contact-btn-icon--send"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2 11 13" className="contact-send-path" />
      <path d="M22 2 15 22 11 13 2 9z" className="contact-send-plane" />
    </svg>
  );
}

function SendingIndicator() {
  return (
    <div className="contact-sending">
      <svg
        className="contact-sending__orbit"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <circle
          cx="11"
          cy="11"
          r="9"
          stroke="rgba(128, 169, 255, 0.2)"
          strokeWidth="2"
        />
        <circle
          cx="11"
          cy="11"
          r="9"
          stroke="url(#sendingGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="14 42"
          className="contact-sending__arc"
        />
        <defs>
          <linearGradient id="sendingGrad" x1="0" y1="0" x2="22" y2="22">
            <stop stopColor="#7bdbd4" />
            <stop offset="1" stopColor="#6c90ff" />
          </linearGradient>
        </defs>
      </svg>
      <span className="contact-sending__text">Sending</span>
      <span className="contact-sending__dots">
        <span className="contact-sending__dot" />
        <span className="contact-sending__dot" />
        <span className="contact-sending__dot" />
      </span>
    </div>
  );
}

function SuccessIndicator() {
  return (
    <div className="contact-success">
      <svg
        className="contact-success__check"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#successGrad)"
          strokeWidth="2"
          className="contact-success__circle"
        />
        <path
          d="M8 12.5l2.5 3L16 9"
          stroke="#7bdbd4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="contact-success__tick"
        />
        <defs>
          <linearGradient id="successGrad" x1="2" y1="2" x2="22" y2="22">
            <stop stopColor="#7bdbd4" />
            <stop offset="1" stopColor="#45c5bc" />
          </linearGradient>
        </defs>
      </svg>
      <span className="contact-success__text">Message sent</span>
    </div>
  );
}

function ErrorIndicator() {
  return (
    <div className="contact-error-state">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff6b6b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <span className="contact-error-state__text">Failed to send</span>
    </div>
  );
}

export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setStatus("sending");
    const { error } = await sendContactFormEmail(formData);
    if (error) {
      setStatus("error");
      toast.error(error);
      setTimeout(() => setStatus("idle"), 2400);
      return;
    }
    setStatus("success");
    formRef.current?.reset();
    setTimeout(() => setStatus("idle"), 3000);
  }, []);

  const isDisabled = status === "sending" || status === "success";

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
        ref={formRef}
        data-reveal
        className="creative-contact-form"
        action={handleSubmit}
      >
        <input
          className="creative-contact-form__input"
          name="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
          autoComplete="email"
          disabled={isDisabled}
        />
        <textarea
          className="creative-contact-form__textarea"
          name="message"
          placeholder="Your message"
          required
          maxLength={5000}
          rows={6}
          disabled={isDisabled}
        />
        <button
          type="submit"
          className={`creative-btn creative-btn--solid creative-contact-form__submit contact-btn--${status}`}
          disabled={isDisabled}
        >
          <span className="contact-btn__content">
            {status === "idle" && (
              <>
                <SendIcon />
                <span>Send Message</span>
              </>
            )}
            {status === "sending" && <SendingIndicator />}
            {status === "success" && <SuccessIndicator />}
            {status === "error" && <ErrorIndicator />}
          </span>
        </button>
      </form>
    </section>
  );
}
