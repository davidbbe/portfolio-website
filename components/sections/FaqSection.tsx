"use client";

import Image from "next/image";
import RevealText from "./shared/RevealText";
import { faqItems } from "@/lib/content/sections";

function renderAnswer(text: string) {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
  if (parts.length === 1) return text;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) elements.push(parts[i]);
    if (parts[i + 1] && parts[i + 2]) {
      elements.push(
        <a key={i} href={parts[i + 2]} target="_blank" rel="noopener noreferrer" className="faq-link">
          {parts[i + 1]}
        </a>
      );
    }
  }
  return elements;
}

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
              <p className="text-base text-gray-600">
                {renderAnswer(faq.answer)}
              </p>
              {"image" in faq && faq.image && (
                <div className="faq-item__image">
                  <Image
                    src={faq.image}
                    alt={faq.question}
                    width={800}
                    height={400}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
