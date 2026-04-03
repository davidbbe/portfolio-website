"use client";

import RevealText from "./shared/RevealText";
import { footerContact } from "@/lib/content/sections";

export default function ContactSection() {
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
      <RevealText as="h2" className="section-title">
        {footerContact.title}
      </RevealText>
      <RevealText as="p" className="section-copy">
        {footerContact.body}
      </RevealText>
      <a
        data-reveal
        className="creative-btn creative-btn--solid"
        href="/placeholder"
      >
        Submit
      </a>
    </section>
  );
}
