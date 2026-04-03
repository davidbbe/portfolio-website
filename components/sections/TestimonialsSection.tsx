"use client";

import { testimonials } from "@/lib/content/sections";

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      data-scene-section="testimonials"
      data-reveal-variant="softReveal"
      className="creative-section"
    >
      <p data-reveal className="eyebrow eyebrow--overline">
        Trusted by
      </p>
      <h2 data-reveal className="section-title">
        Partners. Results. Momentum.
      </h2>
      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <blockquote
            key={item.author}
            className="testimonial-card"
            data-reveal
          >
            <p>{item.quote}</p>
            <footer>{item.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
