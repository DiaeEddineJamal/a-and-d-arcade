"use client";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type HomeApp = { id: string; label: string; icon: LucideIcon; href?: string; external?: boolean; onOpen?: () => void; cell: number };
type Drag = { id: string; dx: number; dy: number; over: number };
const COLS = 4, ROWS = 5, CELLS = COLS * ROWS, HOLD_MS = 420;

/** id -> cell, every app on its own cell: saved cells first, defaults for new apps, the next free cell on a clash */
export function placeApps(apps: { id: string; cell: number }[], saved: Record<string, number>) {
  const taken = new Set<number>(), out: Record<string, number> = {};
  const claim = (id: string, cell: number) => { out[id] = cell; taken.add(cell); };
  for (const app of apps) { const cell = saved[app.id]; if (Number.isInteger(cell) && cell >= 0 && cell < CELLS && !taken.has(cell)) claim(app.id, cell); }
  for (const app of apps) if (!(app.id in out)) { let cell = app.cell; while (taken.has(cell)) cell = (cell + 1) % CELLS; claim(app.id, cell); }
  return out;
}

/** The phone home screen: hold an icon until everything wiggles, drag it to any spot, tap Done. Like iOS and Android. */
export default function HomeGrid({ apps }: { apps: HomeApp[] }) {
  // only ever rendered in the browser (on phones), so the saved layout can be read right away
  const [cells, setCells] = useState<Record<string, number>>(() => { try { return placeApps(apps, JSON.parse(localStorage.getItem("ad-home") || "{}")); } catch { return placeApps(apps, {}); } });
  const [editing, setEditing] = useState(false);
  const [drag, setDragState] = useState<Drag | null>(null);
  // pointer events can arrive faster than renders: the handlers read the live drag from here
  const live = useRef<Drag | null>(null);
  const setDrag = (next: Drag | null) => { live.current = next; setDragState(next); };
  const grid = useRef<HTMLDivElement>(null);
  const press = useRef<{ id: string; x: number; y: number; timer?: ReturnType<typeof setTimeout>; moved?: boolean } | null>(null);
  const suppressClick = useRef(false);

  const save = (next: Record<string, number>) => { setCells(next); try { localStorage.setItem("ad-home", JSON.stringify(next)); } catch {} };

  const cellAt = (x: number, y: number) => {
    const box = grid.current!.getBoundingClientRect();
    const col = Math.min(COLS - 1, Math.max(0, Math.floor((x - box.left) / (box.width / COLS))));
    const row = Math.min(ROWS - 1, Math.max(0, Math.floor((y - box.top) / (box.height / ROWS))));
    return row * COLS + col;
  };
  const lift = (id: string, target: Element, pointerId: number) => {
    try { target.setPointerCapture(pointerId); } catch {}
    setEditing(true); suppressClick.current = true;
    setDrag({ id, dx: 0, dy: 0, over: cells[id] });
    navigator.vibrate?.(12);
  };
  function down(id: string, event: ReactPointerEvent) {
    if (event.button) return;
    const target = event.currentTarget, pointerId = event.pointerId;
    suppressClick.current = false;
    press.current = { id, x: event.clientX, y: event.clientY };
    if (!editing) press.current.timer = setTimeout(() => {
      if (press.current && !press.current.moved) lift(id, target, pointerId);
    }, HOLD_MS);
  }
  function moveTo(event: ReactPointerEvent) {
    const start = press.current;
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y, drag = live.current;
    if (!drag) {
      if (Math.hypot(dx, dy) < 6) return;
      if (editing) lift(start.id, event.currentTarget, event.pointerId); else { start.moved = true; clearTimeout(start.timer); }
      return;
    }
    setDrag({ ...drag, dx, dy, over: cellAt(event.clientX, event.clientY) });
  }
  function up() {
    clearTimeout(press.current?.timer);
    press.current = null;
    const drag = live.current;
    if (!drag) return;
    const other = Object.keys(cells).find(id => cells[id] === drag.over && id !== drag.id);
    save({ ...cells, [drag.id]: drag.over, ...(other ? { [other]: cells[drag.id] } : {}) });
    setDrag(null);
  }
  const open = (app: HomeApp) => (event: React.MouseEvent) => {
    if (editing || suppressClick.current) { event.preventDefault(); suppressClick.current = false; return; }
    app.onOpen?.();
  };

  return <div className={`home-grid${editing ? " is-editing" : ""}`} ref={grid} onPointerMove={moveTo} onPointerUp={up} onPointerCancel={up}
    onClick={event => { if (editing && event.target === event.currentTarget) setEditing(false); }} onContextMenu={event => event.preventDefault()}>
    {editing && <button className="home-done" onClick={() => setEditing(false)}>Done</button>}
    {drag && <i className="home-drop" style={{ gridRow: Math.floor(drag.over / COLS) + 1, gridColumn: drag.over % COLS + 1 }} aria-hidden="true" />}
    {apps.map((app, n) => {
      const cell = cells[app.id], lifted = drag?.id === app.id;
      const style = { gridRow: Math.floor(cell / COLS) + 1, gridColumn: cell % COLS + 1, "--n": n, ...(lifted && { transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.12)` }) } as React.CSSProperties;
      const inner = <><span><app.icon /></span>{app.label}</>;
      const props = { className: `app-tile${lifted ? " is-lifted" : ""}`, style, draggable: false, onPointerDown: (event: ReactPointerEvent) => down(app.id, event), onClick: open(app) };
      return app.href
        ? app.external ? <a key={app.id} href={app.href} {...props}>{inner}</a> : <Link key={app.id} href={app.href} {...props}>{inner}</Link>
        : <button key={app.id} {...props}>{inner}</button>;
    })}
  </div>;
}
