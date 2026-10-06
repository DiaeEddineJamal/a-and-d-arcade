import Image from "next/image";

const games = [
  {
    name: "Mangolian Pong",
    eyebrow: "01 / 1–2 PLAYERS",
    description:
      "Pixel energy. Thunder serves. Local play and private online rooms.",
    href: process.env.NEXT_PUBLIC_PONG_URL ?? "http://localhost:3001",
    status: "PLAY PONG",
    color: "turquoise",
    art: "pong",
    cover: "/pong-cover-box-art.png",
  },
  {
    name: "Lmongolyan Kart",
    eyebrow: "02 / 1–8 RACERS",
    description:
      "The full-throttle original. Choose a racer, create a room, and drift.",
    href: process.env.NEXT_PUBLIC_RACING_URL ?? "http://localhost:5178",
    status: "START RACE",
    color: "orange",
    art: "race",
    cover: "/kart-cover-box-art.png",
  },
];

export default function Home() {
  return (
    <main className="portal-shell">
      <header className="portal-nav">
        <span className="portal-wordmark">
          <i aria-hidden="true">L</i>
          <span>LMONGOLYAN</span>
          <b>ARCADE SYSTEMS</b>
        </span>
        <span>SELECT A CABINET <i>↘</i></span>
        <span>EST. 2026 / ONLINE + LOCAL</span>
      </header>

      <section className="portal-hero">
        <div className="hero-copy">
          <p className="eyebrow">INSERT FRIENDS · PICK A GAME · MAKE SOME NOISE</p>
          <div className="portal-title-wrap">
            <span className="title-stamp">PLAY<br />TOGETHER</span>
            <h1 className="portal-title">
              LMONGOLYAN<br />
              <em>ARCADE</em>
            </h1>
          </div>
          <p className="portal-intro">
            A future-facing arcade for big buttons, friendly rivalries, and games
            that travel with your people.
          </p>
          <a className="hero-cta" href="#game-library">
            EXPLORE THE CABINETS <span>↓</span>
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <span className="hero-art-label"><b>02</b> GAMES LOADED</span>
          <Image
            src="/arcade-console-hero.png"
            alt=""
            fill
            priority
            sizes="(max-width: 760px) 80vw, 48vw"
          />
          <span className="hero-art-orbit">LOCAL + ONLINE</span>
        </div>

        <div className="portal-marquee" aria-hidden="true">
          <span>✦ PIXEL POWER ✦ LOCAL LEGENDS ✦ ONLINE NIGHTS ✦ </span>
          <span>PIXEL POWER ✦ LOCAL LEGENDS ✦ ONLINE NIGHTS ✦ </span>
        </div>
      </section>

      <section className="library-heading" id="game-library">
        <p className="eyebrow">GAME LIBRARY / SELECT ONE</p>
        <span>02 LIVE CABINETS</span>
      </section>

      <section className="cabinet-grid" aria-label="Game library">
        {games.map((game) => (
          <a className={`cabinet cabinet-${game.color}`} href={game.href} key={game.name}>
            <span className="cabinet-index">{game.eyebrow}</span>
            <div className={`cabinet-art cabinet-art-${game.art}`}>
              <Image src={game.cover} alt="" fill sizes="(max-width: 650px) 54vw, 27vw" />
              <span className="cover-corner">LIVE</span>
            </div>
            <h2>{game.name}</h2>
            <p>{game.description}</p>
            <span className="cabinet-action">{game.status} <b>↗</b></span>
          </a>
        ))}
      </section>

      <footer className="portal-footer">
        <span>MORE GAMES. SAME TABLE.</span>
        <span>© 2026 LMONGOLYAN ARCADE</span>
      </footer>
    </main>
  );
}
