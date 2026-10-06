import { notFound } from "next/navigation";
import type { Metadata } from "next";

const screens = ["collection", "files", "about", "terminal", "settings"];
export function generateStaticParams() { return screens.map(screen => ({ screen })); }
export async function generateMetadata({ params }: { params: Promise<{ screen: string }> }): Promise<Metadata> {
  const { screen } = await params;
  return { title: screen.charAt(0).toUpperCase() + screen.slice(1) };
}
export default async function DesktopPage({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  if (!screens.includes(screen)) notFound();
  return null;
}
