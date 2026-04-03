"use client";

import RevealText from "./shared/RevealText";
import { faqItems, footerContact } from "@/lib/content/influint-sections";

export default function FaqSection() {
  return (
    <section
      id="faq"
      data-scene-section="faq"
      data-reveal-variant="hero"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">Questions</p>
      <RevealText as="h2" className="section-title">
        Frequently Asked Questions
      </RevealText>
      <div className="faq-list">
        {faqItems.map((faq) => (
          <details key={faq.question} className="faq-item">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
      <div className="contact-cta">
        <p data-reveal>{footerContact.body}</p>
        <a data-reveal href="#contact" className="creative-btn creative-btn--solid">
          {footerContact.title}
        </a>
      </div>
    </section>
  );
}
