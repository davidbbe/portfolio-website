"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Service = {
  title: string;
  body: string;
};

type ProcessStep = {
  title: string;
  body: string;
};

type Testimonial = {
  quote: string;
  author: string;
  accent: "yellow" | "purple" | "orange";
};

type TeamMember = {
  name: string;
  role: string;
};

const services: Service[] = [
  {
    title: "Brand Partnerships",
    body: "We craft strategic partnerships that boost both earnings and engagement, leveraging thousands of datapoints and a vast network to maximize both impact and earnings.",
  },
  {
    title: "New Revenue",
    body: "We help you to review your entire business structure, identifying the most meaningful opportunities to increase your revenue, decrease your workload, and maximize your profitability.",
  },
  {
    title: "Influint Ventures",
    body: "Creators are driving the future of commerce. We partner with select clients, offering both capital and expertise to launch and scale their creator-led ventures.",
  },
];

const serviceSubtext =
  "We’re here to simplify the complexity, guiding you with strategic insights and hands-on support to help your business thrive.";

const processSteps: ProcessStep[] = [
  {
    title: "Introductory Call",
    body: "We start with a conversation to understand your goals, challenges, and vision for growth. Based on your specific needs, we outline how our team can help drive the business growth you're looking for.",
  },
  {
    title: "Onboarding",
    body: "You'll meet your dedicated team and learn about the resources available to you. It's all about alignment-clarifying sponsorship objectives, exploring opportunities, and building a roadmap for success.",
  },
  {
    title: "Project Sessions",
    body: "Whether you're optimizing existing revenue streams, identifying new monetization mechanisms, or refining your audience growth strategy, support is available on request to start new projects with our team.",
  },
  {
    title: "Ongoing Support",
    body: "As these new projects take shape, we stay connected through regular check-ins to ensure measurable and meaningful progress is made toward your short and long-term objectives.",
  },
  {
    title: "Performance Iteration",
    body: "You'll have direct access to our leadership team with regular touch points, giving you a say in how we evolve our approach. Your input drives our improvement, making sure our support delivers real impact.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "I've been very happy with the service I've received and I've actually suggested Influint to a few of my creator friends. They have been able to get me great contract values and the deal flow; it has been more than I've been able to keep up with.",
    author: "Zac Builds",
    accent: "yellow",
  },
  {
    quote:
      "Influint has made it possible for me to do this for a living. I wouldn't have been able to do it without them.",
    author: "Man Made",
    accent: "purple",
  },
  {
    quote:
      "I love how the Influint team is so easily available. As someone that works practically 24/7 it's nice to always have someone available for questions or concerns. Influint has always been good at making sure things happen on time and that with my busy schedule that I remember upcoming campaigns.",
    author: "Living with Cambriea",
    accent: "orange",
  },
];

const faqs = [
  {
    question: "How does Influint work?",
    answer:
      "Our goal is to become an extension of your team. We work closely with our clients, offering a range of services including brand partnership management, contract advisory, growth strategy, and brand development, amongst others. Our goal is to help creators monetize their passions effectively. Our services are tailored to meet the unique needs of each client.",
  },
  {
    question: "What kinds of creators do you typically represent?",
    answer:
      "We work with creators across various niches, including lifestyle, tech, DIY, family, and more. We specialize in working with creators who are ready to professionalize their business, secure high-value partnerships, and expand their opportunities beyond AdSense. Our ideal client knows that big things are built together, and understands the value an experienced team can bring.",
  },
  {
    question: "What makes Influint different?",
    answer:
      "We take a business-first approach to our creators and their success. While many similar companies focus solely on sponsorship management, our aim is to help creators build sustainable businesses-whether that's through brand deals, audience growth strategy, building their support team, or diversifying their revenue streams.",
  },
  {
    question: "What is Influint Ventures?",
    answer:
      "Influint Ventures focuses on equity partnerships with select creators. We collaborate to launch innovative commerce initiatives that align with your brand. Our expertise ensures that your ideas are brought to life successfully.",
  },
  {
    question: "How can I get started?",
    answer:
      "If you're ready to take your career as a creator to the next level, click 'Apply Now'. Answer the short survey that follows, and you'll receive an invitation to join us if we think you're a good fit for our services. Due to the volume of requests, we are unable to respond to all applicants.",
  },
];

const team: TeamMember[] = [
  { name: "Natalie Robinson", role: "Sr. Talent Manager" },
  { name: "Ben Mercado", role: "Manager Assistant Lead" },
  { name: "Brianna Squire", role: "Sr. Talent Manager - Head of Activations" },
  { name: "David Ciampittiello", role: "General Manager" },
  { name: "Savannah McVay", role: "Director of Creator Relations" },
  { name: "Regina Martiarena", role: "Sr. Talent Manager - Head of Creator Success" },
  {
    name: "Niamh Higgins",
    role: "Sr. Talent Manager - Head of Professional Development",
  },
];

const creators = ["creators", "creators", "creators", "creators"];
const marqueeItems = ["increase your revenue", "Grow your audience", "Reduce your workload"];

export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeService, setActiveService] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const creatorTicker = useMemo(() => [...creators, ...creators, ...creators], []);
  const marqueeTicker = useMemo(
    () => [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems],
    [],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal",
        { y: 36, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top top",
          },
        },
      );

      gsap.to(".bg-blob-a", {
        x: 40,
        y: -60,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".bg-blob-b", {
        x: -32,
        y: 48,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".spline-ring", {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".process-dot", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 16,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".service-card", {
        y: -20,
        stagger: {
          each: 0.3,
          repeat: -1,
          yoyo: true,
        },
        duration: 2.1,
        ease: "sine.inOut",
      });
      gsap.to(".cta-person", {
        y: -10,
        stagger: {
          each: 0.09,
          repeat: -1,
          yoyo: true,
        },
        duration: 2.4,
        ease: "sine.inOut",
      });
      gsap.to(".hero-trust", {
        opacity: 0.65,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".marquee-row", {
        xPercent: -50,
        duration: 22,
        repeat: -1,
        ease: "none",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main ref={pageRef} className="site">
      <header className="top-nav reveal">
        <div className="logo">logo</div>
        <nav>
          <a href="#section-about">About</a>
          <a href="#section-process">Our Process</a>
          <a href="#section-clients">Our Clients</a>
          <a href="#section-faq">FAQ</a>
          <a href="#section-cta">Get Started</a>
        </nav>
        <a className="mini-logo-link" href="#section-clients">
          words
        </a>
      </header>

      <section id="hero" className="section-hero">
        <div className="spline-wrap reveal">
          <motion.div
            className="spline-ring"
            animate={{ rotateY: [0, 180, 360], rotateX: [8, -8, 8] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="content-wrap">
          <h1 className="h1 reveal">Your Vision.</h1>
          <div className="hero-row reveal">
            <p className="hero-sub">
              Full-service management and business growth solutions for creators.
              Your future starts here.
            </p>
            <h1 className="h1 secondary">Our Mission.</h1>
          </div>
          <div className="hero-creators reveal">
            <div className="avatar-list">
              <span className="avatar one" />
              <span className="avatar two" />
              <span className="avatar three" />
              <span className="avatar four" />
            </div>
            <div className="hero-trust">150+ creators trust influint</div>
            <a className="apply-btn" href="#">
              Apply Now
            </a>
          </div>

          <div className="creator-run reveal">
            {creatorTicker.map((word, index) => (
              <span key={`${word}-${index}`}>{word}</span>
            ))}
          </div>
        </div>

        <div className="hero-background">
          <div className="bg-blob-a" />
          <div className="bg-blob-b" />
          <div className="dot-grid" />
        </div>
      </section>

      <section id="section-about" className="section clearpath">
        <div className="container reveal">
          <div className="clear-heading">
            <h2 className="small">A</h2>
            <h2>Clear</h2>
            <h2>Path</h2>
          </div>
          <p className="large-text">
            Influint empowers talent to navigate, innovate, and lead in the creator
            economy.
          </p>

          <div className="service-carousel">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                className={`service-card ${activeService === index ? "active" : ""}`}
                animate={{
                  scale: activeService === index ? 1 : 0.94,
                  opacity: activeService === index ? 1 : 0.72,
                }}
              >
                <div className="service-tag">{service.title}</div>
                <p>{service.body}</p>
                <p className="sub">{serviceSubtext}</p>
              </motion.article>
            ))}
          </div>

          <div className="partners">
            <h3 className="partners-title">Transform your passion into profit</h3>
            <p>
              Like so many of our creator partners, unlock the potential of your
              creativity with our tailored support and strategic approach.
            </p>
            <a className="apply-btn" href="#">
              Apply Now
            </a>
            <div className="partner-images">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section id="section-process" className="section process">
        <div className="container reveal">
          <h3 className="section-title">
            <span>our</span> PROCESS
          </h3>
          <div className="process-layout">
            <div className="process-list">
              {processSteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  className="process-item"
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 16 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </motion.article>
              ))}
            </div>
            <div className="process-graphic">
              <div className="process-circle" />
              <div className="process-dot">
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section marquee">
        <div className="marquee-row">
          {marqueeTicker.map((item, index) => (
            <span key={`${item}-${index}`}>
              {item} <b>▲</b>
            </span>
          ))}
        </div>
        <div className="marquee-row">
          {marqueeTicker.map((item, index) => (
            <span key={`row2-${item}-${index}`}>
              {item} <b>▲</b>
            </span>
          ))}
        </div>
      </section>

      <section id="section-clients" className="section clients">
        <div className="container reveal">
          <div className="clients-head">
            <h3 className="section-title">
              <span>Partners</span> words
            </h3>
            <div className="clients-copy">
              <p>Hear it from our clients</p>
              <div>
                <small>Ready to Learn More?</small>
                <a className="apply-btn" href="#">
                  Apply Now
                </a>
              </div>
            </div>
          </div>

          <div className="trusted">
            <span>Trusted by</span>
            <div className="avatar-list">
              <span className="avatar one" />
              <span className="avatar two" />
              <span className="avatar three" />
            </div>
          </div>

          <div className="testimonial-stack">
            {testimonials.map((item, index) => (
              <motion.article
                key={item.author}
                className={`testimonial ${item.accent}`}
                animate={{
                  opacity: activeTestimonial === index ? 1 : 0.35,
                  scale: activeTestimonial === index ? 1 : 0.95,
                  y: activeTestimonial === index ? 0 : 18,
                }}
              >
                <p>{item.quote}</p>
                <h4>{item.author}</h4>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="section-faq" className="section faq">
        <div className="container reveal">
          <h3 className="section-title">Questions</h3>
          <div className="faq-layout">
            <div className="faq-intro">
              <h4>Frequently Asked Questions</h4>
              <p>
                Still can&apos;t find the answer to your question? Submit your
                application to learn more.
              </p>
              <a className="apply-btn" href="#">
                Apply Now
              </a>
            </div>
            <div className="faq-list">
              {faqs.map((item, index) => {
                const open = activeFaq === index;
                return (
                  <article key={item.question} className={`faq-item ${open ? "open" : ""}`}>
                    <button
                      className="faq-trigger"
                      onClick={() => setActiveFaq(open ? null : index)}
                      aria-expanded={open}
                    >
                      {item.question}
                    </button>
                    <div className="faq-body">
                      <p>{item.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="section-cta" className="section cta">
        <div className="container reveal">
          <h3>Get the roadmap + support you need to grow</h3>
          <div className="cta-small">
            <div className="avatar-list">
              <span className="avatar one" />
              <span className="avatar two" />
              <span className="avatar three" />
              <span className="avatar four" />
            </div>
            <div>150+ creators trust influint</div>
            <a className="apply-btn" href="#">
              Apply Now
            </a>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name} className="cta-person">
                <div className="person-photo" />
                <div className="person-name">{member.name}</div>
                <div className="person-role">{member.role}</div>
              </article>
            ))}
          </div>
        </div>
        <div className="cta-bg">
          <div className="bg-blob-a" />
          <div className="bg-blob-b" />
          <div className="dot-grid" />
        </div>
      </section>

      <footer className="footer reveal">
        <div className="footer-main">
          <div className="logo">Logo</div>
          <div className="footer-links">
            <a href="#section-about">About</a>
            <a href="#section-process">Our Process</a>
            <a href="#section-clients">Our Clients</a>
            <a href="#section-faq">FAQ</a>
            <a href="#section-cta">Get Started</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="footer-socials">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">YouTube</a>
            <a href="#">info@influint.co</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Influint. All rights reserved.</span>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
