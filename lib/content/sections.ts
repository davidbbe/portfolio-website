export const heroSection = {
  subLines: [
    "I specialize in building high-performance web applications using React, Next.js, TypeScript, and motion animation libraries like GSAP, Framer Motion, and Three.js.",
  ],
  ctas: [
    { label: "View my work", href: "/portfolio" },
    { label: "Contact me", href: "/contact" },
  ],
};

export type AboutMeBrand = {
  name: string;
  icon: string;
};

export type AboutMeCategory = {
  title: string;
  brands: AboutMeBrand[];
};

export const aboutMe: AboutMeCategory[] = [
  {
    title: "Preferred Stack",
    brands: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind", icon: "tailwind" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Prisma", icon: "prisma" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
  },
  {
    title: "Other Familiar Frameworks",
    brands: [
      { name: "Remix", icon: "remix" },
      { name: "Shopify", icon: "shopify" },
      { name: "Gatsby.js", icon: "gatsby" },
      { name: "WordPress", icon: "wordpress" },
    ],
  },
  {
    title: "Hosting & Development Tools",
    brands: [
      { name: "Vercel", icon: "vercel" },
      { name: "Netlify", icon: "netlify" },
      { name: "Supabase", icon: "supabase" },
      { name: "Vite", icon: "vite" },
      { name: "Cursor", icon: "cursor" },
    ],
  },
];

export const projects = [
  {
    step: "01",
    title: "Discovery",
    body: "We start with a focused conversation to understand your goals, constraints, and growth vision. From there, we outline a practical roadmap.",
  },
  {
    step: "04",
    title: "Ongoing Support",
    body: "As programs evolve, we check in regularly with measurable updates, ensuring campaign flow, performance, and partnerships stay on trajectory.",
  },
  {
    step: "05",
    title: "Performance Iteration",
    body: "You get direct access to leadership input and review cadence to refine strategy, strengthen positioning, and raise outcomes over time.",
  },
] as const;

export const faqItems = [
  {
    question: "Are you available for work?",
    answer:
      "Yes, I am available for work. I am currently looking for a new opportunity. Please contact me if you have any questions.",
  },
  {
    question: "What is your process for building a project?",
    answer:
      "I start with a focused conversation to understand your goals, constraints, and growth vision. From there, I outline a practical roadmap that fits your needs, timeline, and budget.",
  }
] as const;

export const footerContact = {
  title: "Send me a message",
  body: "I am always looking for new opportunities. Please contact me if you have any questions or would like to discuss a potential project. I will get back to you as soon as possible.",
};

export const projectsData = [
  {
    title: "Underwater Hockey Map",
    url: "https://uwhmap.com",
    description: "I designed and developed this application. It uses the Google Maps API and Google Places API to view, create, or edit underwater hockey clubs around the world. It has features like login, user accounts, and CRUD functionality for users to dynamically manage the database and pages.",
    tags: ["Next.js", "NextAuth", "Prisma", "PostgreSQL", "Vercel", "Google Maps API", "Google Places API", "Tailwind", "Shadcn", "React Query"]
  },
  {
    title: "Netflix Roulette",
    url: "https://tvroulette.app",
    description: "I designed and developed this application. It uses the IMDB, TMDB, OMDB, and JustWatch APIs to search for movies and TV shows. It features an interactive UI with multiple animations to retain user attention and engagement. This website has over 1.3k active monthy users and ranks very high on Google for the search term 'Netflix Roulette'.",
    tags: ["Gatsby.js", "GSAP", "Styled Components", "React Query", "Contentful CMS", "Netlify", "IMDB API", "TMDB API", "OMDB API", "JustWatch API"]
  }
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Gatsby.js",
  "Node.js",
  "Tailwind",
  "Styled Components",
  "Shadcn/ui",
  "Framer Motion",
  "Prisma",
  "React Query",
  "GraphQL",
  "PostgreSQL",
  "Google Analytics",
  "Google Tag Manager",
  "Google Search Console"
] as const;

