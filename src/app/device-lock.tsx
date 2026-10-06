"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { checks } from "./answers.mjs";
import { petNames, type Device } from "./devices";

/**
 * The reference's "Authentication required" dialog, but the password is a few questions only A can answer.
 * A correct answer written differently still counts (see answers.mjs).
 */
export default function DeviceLock({ device, onUnlock, onClose }: { device: Device; onUnlock: () => void; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [misses, setMisses] = useState(0);
  const [status, setStatus] = useState<"ask" | "denied" | "accepted" | "granted">("ask");
  const [name] = useState(() => petNames[Math.floor(Math.random() * petNames.length)]);
  const input = useRef<HTMLInputElement>(null);
  const question = device.questions[step];
  const last = step === device.questions.length - 1;

  useEffect(() => { input.current?.focus({ preventScroll: true }); }, [step]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.stopPropagation(); onClose(); } };
    addEventListener("keydown", escape, true);
    return () => removeEventListener("keydown", escape, true);
  }, [onClose]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!answer.trim() || status === "accepted" || status === "granted") return;
    if (!checks[question.id](answer)) { setAnswer(""); setMisses(value => value + 1); setStatus("denied"); return; }
    if (!last) { setStatus("accepted"); setTimeout(() => { setStep(step + 1); setAnswer(""); setMisses(0); setStatus("ask"); }, 500); return; }
    setStatus("granted");
    setTimeout(onUnlock, 1400);
  }

  return <div className="auth-backdrop" onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <form className="auth-dialog" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="auth-title" aria-describedby="auth-for">
      <h2 id="auth-title">{status === "granted" ? "Access granted" : "Authentication required"}</h2>
      <p id="auth-for">{status === "granted" ? `Mounting ${device.path}… welcome back, ${name}.` : `Answer the security question for ${device.path} (${step + 1}/${device.questions.length})`}</p>
      {status !== "granted" && <>
        <label htmlFor="auth-answer" className="auth-question">{question.ask}</label>
        <input id="auth-answer" ref={input} value={answer} onChange={event => { setAnswer(event.target.value); if (status === "denied") setStatus("ask"); }} autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="go" aria-invalid={status === "denied"} />
        <p className={`auth-status is-${status}`} role="status">
          {status === "denied" ? (misses >= 2 ? `Access denied. Hint: ${question.hint}` : "Access denied. Credentials rejected.") : status === "accepted" ? "Accepted." : " "}
        </p>
        <div className="auth-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">{last ? "Unlock" : "Next"}</button>
        </div>
      </>}
      {status === "granted" && <div className="auth-progress" aria-hidden="true"><span /></div>}
    </form>
  </div>;
}
