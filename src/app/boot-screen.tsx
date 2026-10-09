"use client";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import RetroBadge from "./retro-badge";
import DotHands from "./dot-hands";

type Stage = "bios" | "kernel" | "init" | "shell" | "loading";
const bios: [number, string][] = [
  [0, "A&D Modular BIOS v4.51PG, An Arcade Star Ally"], [0, "  Copyright (C) 1996-2026, A&D Arcade, Inc."], [250, ""],
  [250, "AOpen AP5T R2.30 Apr.13.1997    A&D Systems"], [250, "Intel 430TX PCI BIOS for AP5T V.2.30"], [250, "Check System Health OK, VCore = 2.80V"], [600, ""],
  [600, "Main Processor  : INTEL PENTIUM MMX 166MHz"], [700, "Memory Testing  :  {mem}"], [1500, ""],
  [1500, "A&D Plug and Play BIOS Extension v1.0A"], [1650, "  Initialize Plug and Play Cards..."], [1850, "  Card-01: Creative SB16 PnP"], [2000, "  Card-02: 3Com EtherLink XL PCI"], [2150, "  PNP Init Completed"], [2400, ""],
  [2400, "  Detecting HDD Primary Master   ... A&D GAME ARCHIVE"], [2650, "  Detecting HDD Secondary Master ... LG CD-ROM CRD-8160B"], [2900, ""],
  [2900, "A&D Initiative: Station 2 (Two Players)"], [2900, "Asset tag: 4-8-15-16-23-42        Press START every 108 min"],
];
const kernel = ["Linux version 2.2.14 (root@ad-arcade) (gcc version 2.7.2.3) #1 Tue Oct 6 09:15:00 1996", "Detected 166.413 MHz processor.", "Console: colour VGA+ 80x25", "Calibrating delay loop... 332.59 BogoMIPS", "Memory: 31292k/32768k available (940k kernel code, 412k reserved)", "CPU: Intel Pentium MMX stepping 03", "Checking 'hlt' instruction... OK.", "PCI: PCI BIOS revision 2.10 entry at 0xfd994", "PCI: Probing PCI hardware", "Linux NET4.0 for Linux 2.2", "NET4: Linux TCP/IP 1.0 for NET4.0", "Starting kswapd v 1.5", "Serial driver version 4.27 with no serial options enabled", "sb: Creative SB16 PnP detected at 0x220 irq 5 dma 1,5", "joydev: two gamepads attached, player one and player two"];
const services = ["Mounting /proc filesystem", "Activating swap partitions", "Setting hostname a&d-arcade", "Checking root filesystem (ext2)", "Remounting root filesystem RW", "Loading sound module (sb)", "Bringing up interface lo", "Bringing up interface eth0", "Setting clock from CMOS", "Mounting /collection", "Starting input daemon (2 players)", "Starting high-score keeper", "Starting Internet superserver inetd"];
const resources = ["/ad-hands-dots.png", "/ad-about-cutout.png", "/_next/image?url=%2Fpong-cover-box-art.png%3Fv%3Dad1996&w=256&q=75", "/_next/image?url=%2Fkart-cover-box-art.png%3Fv%3Dad1996&w=256&q=75", "/_next/image?url=%2Fpuck-cover-box-art.png%3Fv%3Dad1996&w=256&q=75", "/_next/image?url=%2Fchefs-cover-box-art.png%3Fv%3Dad1996&w=256&q=75"];
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const H = ({ children }: { children: ReactNode }) => <b className="t-cyan">{children}</b>;

export default function BootScreen({ mobile, onFinish, onSetup, onBeep }: { mobile: boolean; onFinish: () => void; onSetup: () => void; onBeep: () => void }) {
  const [stage, setStage] = useState<Stage>(mobile ? "loading" : "bios");
  const [clock, setClock] = useState(0);
  const [kernelCount, setKernelCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [shell, setShell] = useState<ReactNode[]>([]);
  const [command, setCommand] = useState("");
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const typed = useRef(false);
  const reduced = useRef(false);
  const fast = (ms: number) => reduced.current ? 0 : ms;

  useEffect(() => {
    document.documentElement.dataset.crt = mobile ? "handheld-boot" : { bios: "post", kernel: "tty", init: "tty", shell: "tty", loading: "splash" }[stage];
  }, [stage, mobile]);

  // BIOS clock drives the staggered POST lines and the memory counter
  useEffect(() => {
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (stage !== "bios") return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) { setClock(reduced.current ? 9999 : now - start); if (now - start < 3400) frame = requestAnimationFrame(tick); });
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  useEffect(() => {
    let cancelled = false;
    if (stage === "kernel") void (async () => {
      await wait(fast(750));
      for (let i = 1; i <= kernel.length && !cancelled; i++) { setKernelCount(i); await wait(fast(55 + Math.random() * 70)); }
      await wait(fast(350));
      if (!cancelled) setStage("init");
    })();
    if (stage === "init") void (async () => {
      for (let i = 1; i <= services.length && !cancelled; i++) { await wait(fast(90 + Math.random() * 90)); setServiceCount(i); }
      await wait(fast(500));
      if (!cancelled) setStage("shell");
    })();
    if (stage === "shell") {
      input.current?.focus({ preventScroll: true });
      // nobody typing? the machine types startx for them
      const auto = setTimeout(async () => {
        if (typed.current || cancelled) return;
        for (const letter of "startx") { if (typed.current || cancelled) return; setCommand(value => value + letter); await wait(fast(110)); }
        await wait(fast(260));
        if (!typed.current && !cancelled) run("startx");
      }, fast(2600));
      return () => { cancelled = true; clearTimeout(auto); };
    }
    if (stage === "loading") void (async () => {
      let done = 0;
      const minimum = wait(fast(mobile ? 2200 : 1800));
      await Promise.all(resources.map(url => fetch(url, { cache: "force-cache" }).then(response => response.arrayBuffer()).catch(() => {}).finally(() => { if (!cancelled) setProgress(++done / resources.length); })));
      await minimum;
      if (cancelled) return;
      setLeaving(true);
      await wait(fast(450));
      if (!cancelled) onFinish();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onFinish();
      if (event.key === "F12") { event.preventDefault(); location.reload(); return; }
      if (event.key === "F11" && stage === "shell") { event.preventDefault(); run("startx"); return; }
      if (stage === "bios") {
        if (event.key === "Delete") return onSetup();
        if (clock > 3000 && !event.repeat) { onBeep(); setStage("kernel"); }
      }
    };
    addEventListener("keydown", keyboard);
    return () => removeEventListener("keydown", keyboard);
  });

  function run(raw: string) {
    typed.current = true;
    const value = raw.trim();
    const prompt = <><span className="t-cyan">/home/a&amp;d-arcade</span><span className="t-yellow">(main)</span> <span className="t-magenta">»</span> {value}</>;
    const reply: Record<string, ReactNode> = {
      help: <>Commands: <H>startx</H> launch the desktop · <H>whoami</H> · <H>ls</H> · <H>clear</H> · <H>reboot</H></>,
      whoami: "a&d — A is for her, D is for me. Type startx to come in.",
      ls: <><span className="t-blue">collection/</span>  <span className="t-blue">saves/</span>  <span className="t-green">pong</span>  <span className="t-green">kart</span>  <span className="t-green">puck</span>  <span className="t-green">chefs</span>  readme.txt</>,
    };
    setCommand("");
    if (value === "startx") { setShell(lines => [...lines, prompt, "Starting X server on display :0 ..."]); setTimeout(() => setStage("loading"), fast(450)); return; }
    if (value === "clear") return setShell([]);
    if (value === "reboot") return location.reload();
    setShell(lines => [...lines, prompt, ...(value ? [reply[value] ?? `bash: ${value}: command not found`] : [])]);
  }
  function submit(event: FormEvent) { event.preventDefault(); run(command); }

  const now = new Date();
  const lastLogin = `${now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} ${now.toTimeString().slice(0, 8)} 1996 on tty1`;
  const memory = Math.min(32768, Math.floor(Math.max(0, clock - 700) / 750 * 32768));

  if (mobile) return <section className={`boot lcd-boot${leaving ? " is-leaving" : ""}`} aria-label="A&D Arcade is starting" role="dialog" aria-modal="true">
    <DotHands color="#1d2a16" step={3} />
    <div className="lcd-progress" role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ transform: `scaleX(${progress})` }} /></div>
  </section>;

  return <section className={`boot boot-${stage}${leaving ? " is-leaving" : ""}`} aria-label="A&D Arcade startup" role="dialog" aria-modal="true" onPointerDown={() => { if (stage === "bios" && clock > 3000) { onBeep(); setStage("kernel"); } if (stage === "shell") input.current?.focus(); }}>
    <div className="boot-text">
      {stage === "bios" && <>
        <span className="bios-cursor" aria-hidden="true" />
        <div className="bios-badge"><RetroBadge /></div>
        <pre className="bios-lines">{bios.filter(([at]) => clock >= at).map(([, line], index) => <span key={index} className={index < 2 ? "hot" : undefined}>{line.replace("{mem}", memory < 32768 ? `${memory}K` : "32768K OK")}{"\n"}</span>)}{clock > 3200 && <span className="bios-press">{"\n"}&gt; Press any key to boot ...</span>}</pre>
        <footer className="bios-footer"><span>Press <b>DEL</b> to enter SETUP</span><span>10/06/1996-i430TX-A&amp;D-2A59IG29C-00 <u>@a&amp;darcade</u></span></footer>
      </>}
      {stage === "kernel" && <pre className="kernel-lines">{"LILO loading linux ....\n"}{kernel.slice(0, kernelCount).join("\n")}</pre>}
      {stage === "init" && <pre className="init-lines"><span className="hot">A&amp;D OS 1.0  (Arcade Station)</span>{"\n\n"}{services.slice(0, serviceCount).map(line => <span key={line}>{`${line}:`.padEnd(46)}[  <span className="t-green">OK</span>  ]{"\n"}</span>)}</pre>}
      {stage === "shell" && <div className="shell">
        <div className="login-box"><DotHands step={2} /><p>A&amp;D OS release 1.0<br /><span>(Arcade-derived)</span><br />Kernel 2.2.14 on an i586</p></div>
        <p>Last login: <b>{lastLogin}</b></p>
        <p>Type <H>help</H> for commands · <H>startx</H> or <H>F11</H> launches the UI · <H>F12</H> reboots</p>
        <div className="shell-log" role="log">{shell.map((line, index) => <p key={index}>{line}</p>)}</div>
        <form onSubmit={submit} className="shell-prompt">
          <label htmlFor="boot-shell"><span className="t-cyan">/home/a&amp;d-arcade</span><span className="t-yellow">(main)</span> <span className="t-magenta">»</span></label>
          <span className="shell-typed" aria-hidden="true">{command}<i className="block-cursor" /></span>
          <input id="boot-shell" ref={input} value={command} onChange={event => { typed.current = true; setCommand(event.target.value); }} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Shell command" />
        </form>
      </div>}
      {stage === "loading" && <div className="boot-loader">
        <DotHands step={2} />
        <p>LOADING<span className="dots" /></p>
        <div className="boot-progress" role="progressbar" aria-label="Loading arcade" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ transform: `scaleX(${progress})` }} /></div>
      </div>}
    </div>
    {stage === "shell" && <footer className="shell-hint">`help` for commands · `startx` or F11 launches UI · F12 reboots</footer>}
    <button className="boot-skip" onClick={onFinish}>Skip intro <kbd>Esc</kbd></button>
  </section>;
}
