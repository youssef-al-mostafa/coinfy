import { TradeIdeaCard } from "@/components/app/TradeIdeaCard";
import { getTradeIdea } from "@/lib/services/tradeIdeasService";
import Image from "next/image";

export default async function Home() {
  const tradeIdea = await getTradeIdea();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg.jpeg"
          alt="Background"
          fill
          className="object-cover opacity-60"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
          unoptimized
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 z-1"></div>

      <main className="relative z-10 flex w-full items-center justify-center p-6">
        <TradeIdeaCard tradeIdea={tradeIdea} />
      </main>
    </div>
  );
}
