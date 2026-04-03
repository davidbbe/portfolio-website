"use client";

import RevealText from "./shared/RevealText";
import { faqItems } from "@/lib/content/sections";

export default function FaqSection() {
  return (
    <section
      id="faq"
      data-scene-section="faq"
      data-reveal-variant="softReveal"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">
        Questions
      </p>
      <RevealText as="h2" className="section-title">
        Frequently Asked Questions
      </RevealText>
      <div className="faq-list">
        {faqItems.map((faq) => (
          <article key={faq.question} className="faq-item" data-reveal>
            <div>
              <h3 className="text-xl font-medium mb-2">{faq.question}</h3>
              <p className="text-base text-gray-600">{faq.answer}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
