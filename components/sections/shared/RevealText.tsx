"use client";

import React from "react";

type RevealTextProps = {
  as?: "h1" | "h2" | "p";
  className?: string;
  children: string;
};

export default function RevealText({
  as = "p",
  className,
  children,
}: RevealTextProps) {
  const Tag = as;
  const words = children.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span data-reveal className="reveal-word">
            {word}
          </span>
          {index < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}
