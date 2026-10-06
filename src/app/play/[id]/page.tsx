import { notFound } from "next/navigation";
import { portedGames } from "../../ported-games";
import GamePlayer from "./game-player";
import type { Metadata } from "next";

export function generateStaticParams() {
  return portedGames.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const game = portedGames.find(game => game.id === id);
  return { title: game ? game.name.join(" ").trim() : "Game not found" };
}

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = portedGames.find((game) => game.id === id);
  if (!game) notFound();
  return <GamePlayer game={game} />;
}
