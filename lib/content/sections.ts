export const heroSection = {
  subLines: [
    "I specialize in building high-performance web applications using React, Next.js, TypeScript, and motion animation libraries like GSAP, Framer Motion, and Three.js.",
  ],
  ctas: [
    { label: "View my work", href: "/#projects" },
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
      { name: "PostgreSQL", icon: "postgresql" }
    ],
  },
  {
    title: "Other Familiar Frameworks",
    brands: [
      { name: "Remix", icon: "remix" },
      { name: "Shopify", icon: "shopify" },
      { name: "Gatsby.js", icon: "gatsby" },
      { name: "WordPress", icon: "wordpress" },
      { name: "Stripe", icon: "stripe" },
      { name: "Contentful", icon: "contentful" },
      { name: "Strapi", icon: "strapi" },
    ],
  },
  {
    title: "Hosting & Development Tools",
    brands: [
      { name: "Vercel", icon: "vercel" },
      { name: "Netlify", icon: "netlify" },
      { name: "Neon Database", icon: "neon" },
      { name: "Supabase", icon: "supabase" },
      { name: "Vite", icon: "vite" },
      { name: "Cursor", icon: "cursor" },
      { name: "Capacitor", icon: "capacitor" },
      { name: "Figma", icon: "figma" }
    ],
  },
];

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

export type ProjectItem = {
  title: string;
  url: string;
  description: string;
  image: string;
  featuredTags: readonly string[];
  tags: readonly string[];
};

export const projectsData: readonly ProjectItem[] = [
  {
    title: "Underwater Hockey Map",
    url: "https://uwhmap.com",
    description: "I designed and developed this application. It uses the Google Maps API and Google Places API to view, create, or edit underwater hockey clubs around the world. It has features like login, user accounts, and CRUD functionality for users to dynamically manage the database and pages.",
    image: "/images/portfolio/Underwater-Hockey-Map.jpg",
    featuredTags: ["Next.js", "Google Maps API", "Google Places API"],
    tags: ["Next.js", "NextAuth", "Prisma", "PostgreSQL", "Vercel", "Google Maps API", "Google Places API", "Tailwind", "Shadcn", "React Query"],
  },
  {
    title: "Netflix Roulette",
    url: "https://tvroulette.app",
    description: "I designed and developed this application. It uses the IMDB, TMDB, OMDB, and JustWatch APIs to search for movies and TV shows. It features an interactive UI with multiple animations to retain user attention and engagement. This website has over 1.3k active monthy users and ranks very high on Google for the search term 'Netflix Roulette'.",
    image: "/images/portfolio/Netflix-Roulette.jpg",
    featuredTags: ["Gatsby.js", "GSAP", "OMDB API"],
    tags: ["Gatsby.js", "GSAP", "Styled Components", "React Query", "Contentful CMS", "Netlify", "IMDB API", "OMDB API"],
  },
  {
    title: "Skate Dog (game app)",
    url: "https://skatedog.daveb.co",
    description: "I designed and developed this game. It is a simple game that uses Three.js to create a 3D environment and physics simulation. Its available as a web app and as a direct download native app for either iOS or Android. The native app is built with Capacitor and Neon NoSQL for the high score database.",
    image: "/images/portfolio/Skate-Dog-the-game.jpg",
    featuredTags: ["Vite", "Three.js", "Capacitor"],
    tags: ["React", "Vite", "Tailwind", "Three.js", "Capacitor", "PostgreSQL", "Neon Database", "Vercel"],
  },
  {
    title: "Restaurant Roulette",
    url: "https://www.restaurantroulette.app",
    description: "I designed and developed this application. It uses the Google Places API and Google Maps API to search for restaurants around the user's location.",
    image: "/images/portfolio/Restaurant-Roulette.jpg",
    featuredTags: ["Next.js", "Google Maps API", "Google Places API"],
    tags: ["Next.js", "Google Maps API", "Google Places API", "Vercel", "Tailwind", "Shadcn", "React Query"],
  },
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

