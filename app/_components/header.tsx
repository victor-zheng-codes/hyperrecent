"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "./layout/container";
import { Logo } from "./logo";

export const Header = () => {
  const router = useRouter();
  return (
    <div className="flex h-header-height items-center border-b border-b-black/10">
      <Container as="header">
        <button onClick={() => {
          document.cookie = `topicPreference=; path=/; max-age=31536000;`;
          router.push("/articles");
        }}>
          <Logo />
        </button>
      </Container>
    </div>
  );
};
