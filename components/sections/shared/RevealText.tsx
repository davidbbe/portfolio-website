"use client";

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
        <span key={`${word}-${index}`} data-reveal className="reveal-word">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
