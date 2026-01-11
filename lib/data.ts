import React from "react";
import { FaReact, FaWordpressSimple, FaShopify } from "react-icons/fa";
import { SiNextdotjs } from "react-icons/si";
import netflixroulettepic from "@/public/netflix-roulette-website.jpg";
import uwhmappic from "@/public/UWH-map-website.jpg";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Front-end Developer @ Maker Media",
    location: "Sebastopol/San Francisco, CA",
    description: "WordPress theme development and Shopify theme development for the following websites: makezine.com, makerfaire.com, makershed.com, make.co, and makercamp.com.",
    icon: React.createElement(FaWordpressSimple),
    date: "2013 - 2018",
  },
  {
    title: "Front-end Engineer @ [Company Name Redacted]",
    location: "Remote",
    description: "Client confidentiality agreements prevent me from sharing the details of my work with this company.",
    icon: React.createElement(FaReact),
    date: "2018 - present",
  },
  {
    title: "Full-Stack Developer",
    location: "Remote",
    description: "I build a full-stack web app once per year as a way to learn new technologies and also for fun. My stack includes React, Next.js, TypeScript, Tailwind, Prisma, and PostgreSQL. These project have included tvroulette.app & uwhmap.com. I'm open to working on new full-stack opportunities.",
    icon: React.createElement(SiNextdotjs),
    date: "2023 - present",
  },
] as const;

export const projectsData = [
  {
    title: "Underwater Hockey Map",
    url: "https://uwhmap.com",
    description: "I designed and developed this application. It uses the Google Maps API and Google Places API to view, create, or edit underwater hockey clubs around the world. It has features like login, user accounts, and CRUD functionality for users to dynamically manage the database and pages.",
    tags: ["Next.js", "NextAuth", "Prisma", "PostgreSQL", "Vercel", "Google Maps API", "Google Places API", "Tailwind", "Shadcn", "React Query"],
    imageUrl: uwhmappic,
  },
  {
    title: "Netflix Roulette",
    url: "https://tvroulette.app",
    description: "I designed and developed this application. It uses the IMDB, TMDB, OMDB, and JustWatch APIs to search for movies and TV shows. It features an interactive UI with multiple animations to retain user attention and engagement. This website has over 1.3k active monthy users and ranks very high on Google for the search term 'Netflix Roulette'.",
    tags: ["Gatsby.js", "GSAP", "Styled Components", "React Query", "Contentful CMS", "Netlify", "IMDB API", "TMDB API", "OMDB API", "JustWatch API"],
    imageUrl: netflixroulettepic,
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
