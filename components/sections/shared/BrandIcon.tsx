"use client";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPrisma,
  SiPostgresql,
  SiRemix,
  SiShopify,
  SiGatsby,
  SiWordpress,
  SiVercel,
  SiNetlify,
  SiSupabase,
  SiVite,
  SiGreensock,
  SiThreedotjs,
  SiCapacitor,
  SiGooglemaps,
  SiStripe,
  SiStrapi,
  SiContentful,
  SiFramer,
  SiFigma,
  SiXcode,
  SiAndroidstudio,
} from "react-icons/si";
import { HiCommandLine } from "react-icons/hi2";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  nodejs: SiNodedotjs,
  prisma: SiPrisma,
  postgresql: SiPostgresql,
  remix: SiRemix,
  shopify: SiShopify,
  gatsby: SiGatsby,
  wordpress: SiWordpress,
  vercel: SiVercel,
  netlify: SiNetlify,
  supabase: SiSupabase,
  vite: SiVite,
  cursor: HiCommandLine,
  gsap: SiGreensock,
  threejs: SiThreedotjs,
  capacitor: SiCapacitor,
  googlemaps: SiGooglemaps,
  stripe: SiStripe,
  strapi: SiStrapi,
  contentful: SiContentful,
  motion: SiFramer,
  figma: SiFigma,
  xcode: SiXcode,
  androidstudio: SiAndroidstudio,
};

/** Monochrome Neon logomark (react-icons has no SiNeon in this bundle). */
function NeonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 57.5 57"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="m0 9.8c0-5.4 4.4-9.8 9.9-9.8h37.7c5.4 0 9.9 4.4 9.9 9.8v31.8c0 5.6-7.2 8-10.7 3.6l-10.8-13.9v16.9c0 4.8-4 8.8-9 8.8h-17.1c-5.5 0-9.9-4.4-9.9-9.8zm9.9-2c-1.1 0-2 0.9-2 2v37.3c0 1.1 0.9 2 2 2h17.4c0.6 0 0.7-0.5 0.7-1v-22.5c0-5.7 7.2-8.1 10.7-3.7l10.8 13.9v-26c0-1.1 0.1-2-1-2z"
      />
      <path d="m47.6 0c5.4 0 9.9 4.4 9.9 9.8v31.8c0 5.6-7.2 8-10.7 3.6l-10.8-13.9v16.9c0 4.8-4 8.8-9 8.8 0.6 0 1-0.4 1-1v-30.4c0-5.6 7.2-8 10.7-3.6l10.8 13.9v-33.9c0-1.1-0.9-2-1.9-2z" />
    </svg>
  );
}

const customIconMap: Record<string, () => JSX.Element> = {
  neon: NeonIcon,
};

const tagNameToIconKey: Record<string, string> = {
  "React": "react",
  "Next.js": "nextjs",
  "TypeScript": "typescript",
  "Tailwind": "tailwind",
  "Node.js": "nodejs",
  "Prisma": "prisma",
  "PostgreSQL": "postgresql",
  "Remix": "remix",
  "Shopify": "shopify",
  "Gatsby.js": "gatsby",
  "WordPress": "wordpress",
  "Vercel": "vercel",
  "Netlify": "netlify",
  "Supabase": "supabase",
  "Vite": "vite",
  "GSAP": "gsap",
  "Three.js": "threejs",
  "Capacitor": "capacitor",
  "Google Maps API": "googlemaps",
  "Google Places API": "googlemaps",
  "Neon Database": "neon",
  "Contentful CMS": "contentful",
  "Strapi": "strapi",
  "Stripe": "stripe",
  "Figma": "figma",
  "Framer Motion": "motion",
  "Xcode": "xcode",
  "Android Studio": "androidstudio",
};

export function resolveTagIconKey(tagName: string): string | undefined {
  return tagNameToIconKey[tagName];
}

type BrandIconProps = {
  iconKey: string;
  name: string;
  className?: string;
};

export default function BrandIcon({ iconKey, name, className }: BrandIconProps) {
  const CustomIcon = customIconMap[iconKey];
  const Icon = iconMap[iconKey];

  return (
    <span className={`brand-icon ${className ?? ""}`}>
      {CustomIcon ? (
        <CustomIcon />
      ) : Icon ? (
        <Icon aria-hidden />
      ) : null}
      <span>{name}</span>
    </span>
  );
}
