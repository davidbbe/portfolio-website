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
};

type BrandIconProps = {
  iconKey: string;
  name: string;
  className?: string;
};

export default function BrandIcon({ iconKey, name, className }: BrandIconProps) {
  const Icon = iconMap[iconKey];

  return (
    <span className={`brand-icon ${className ?? ""}`}>
      {Icon ? <Icon aria-hidden /> : null}
      <span>{name}</span>
    </span>
  );
}
