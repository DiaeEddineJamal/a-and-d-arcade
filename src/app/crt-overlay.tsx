"use client";
import { useEffect, useRef } from "react";

// A port of the reference's CRT fragment shader. The reference renders its whole UI into a canvas
// texture and post-processes it; here the page stays real DOM, so the shader runs as a transparent
// layer on top (premultiplied alpha: result = src + page * (1 - a)) with the same maths:
// barrel-warped grain (this is what draws the soft round ripples near the corners), scanlines,
// aperture stripes, vignette, flicker with a periodic dip, mouse glow and the curved black bezel.
const vertex = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const fragment = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_barrel;
uniform vec2 u_mouse;
uniform float u_mouseActive;
uniform float u_crtStrength;
uniform float u_lineStrength;
uniform float u_flash;
uniform vec3 u_wall;
varying vec2 v_uv;
float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
vec2 barrel(vec2 uv, float k) { vec2 c = uv - 0.5; return uv + c * dot(c, c) * k; }
float roundedBox(vec2 p, vec2 hs, float r) { vec2 d = abs(p) - (hs - r); return min(max(d.x, d.y), 0.0) + length(max(d, vec2(0.0))) - r; }
void main() {
  vec2 uv = clamp(barrel(v_uv, u_barrel), 0.0, 1.0);
  vec2 cdir = uv - 0.5;
  float s = u_crtStrength, ls = u_lineStrength;
  float k = 1.0;
  vec3 add = vec3(0.0);

  float scan = 0.5 + 0.5 * cos(v_uv.y * u_res.y * 3.14159 * 0.66);
  k *= mix(mix(1.0, 0.78, ls), 1.0, scan);
  float stripeAmp = 0.06 * ls;
  k *= (1.0 - stripeAmp) + stripeAmp * cos(v_uv.x * u_res.x * 1.0);
  k *= clamp(1.0 - dot(cdir, cdir) * (0.45 * s), 0.0, 1.0);
  float baseFlicker = 1.0 - (0.03 * s) + (0.025 * s) * sin(u_time * 6.0 + sin(u_time * 1.7) * 2.0);
  float dip = step(0.988, fract(u_time * 0.15)) * (0.12 * s);
  k *= baseFlicker - dip;
  float n = (rand(uv * u_res + u_time * 60.0) - 0.5) * (0.05 * s);
  add += vec3(max(n, 0.0));
  k -= max(-n, 0.0) * 2.0;
  if (u_mouseActive > 0.01) {
    float aspect = u_res.x / u_res.y;
    float md = distance(v_uv * vec2(aspect, 1.0), u_mouse * vec2(aspect, 1.0));
    float spot = smoothstep(0.45, 0.0, md);
    add += vec3(0.018) * spot * spot * u_mouseActive;
  }
  add += vec3(u_flash);

  vec2 pixel = v_uv * u_res;
  vec2 hs2 = u_res * 0.5;
  float m = min(u_res.x, u_res.y);
  float cornerR = m * 0.07, inset = m * 0.004;
  float blurPx = max(2.0, m * 0.003), caPx = max(1.5, m * 0.004);
  vec2 nrm = (pixel - hs2) / hs2;
  vec2 warped = pixel + (pixel - hs2) * dot(nrm, nrm) * u_barrel * 0.31;
  vec2 radial = normalize(warped - hs2 + vec2(0.0001));
  float sR = roundedBox(warped - radial * caPx - hs2, hs2 - inset, cornerR);
  float sG = roundedBox(warped - hs2, hs2 - inset, cornerR);
  float sB = roundedBox(warped + radial * caPx - hs2, hs2 - inset, cornerR);
  float mR = smoothstep(-blurPx, blurPx, sR), mG = smoothstep(-blurPx, blurPx, sG), mB = smoothstep(-blurPx, blurPx, sB);
  float frame = 0.043 + (rand(pixel + u_time * 17.0) - 0.5) * 0.06;
  float shade = 1.0 - (1.0 - smoothstep(0.0, m * 0.08, -sG)) * (1.0 - mG) * 0.12;
  // the screen edge always shows the flat wallpaper, so paint it opaque per channel exactly like the reference
  if (max(mR, max(mG, mB)) > 0.002) {
    vec3 col = u_wall * k + add;
    col = vec3(mix(col.r, frame, mR), mix(col.g, frame, mG), mix(col.b, frame, mB));
    gl_FragColor = vec4(col * shade, 1.0);
    return;
  }
  k *= shade;
  gl_FragColor = vec4(add, clamp(1.0 - k, 0.0, 1.0));
}`;

// [crtStrength, lineStrength] per screen, straight from the reference's render loop
const modes: Record<string, [number, number]> = {
  post: [1, .7], tty: [1, .7], splash: [.55, .75],
  desktop: [.35, .06], "handheld-boot": [.55, .45], "handheld-home": [.4, .12],
};

export default function CrtOverlay({ enabled = true }: { enabled?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const on = useRef(enabled);
  useEffect(() => { on.current = enabled; }, [enabled]);

  useEffect(() => {
    const element = canvas.current;
    const gl = element?.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    const fail = (why: unknown) => { console.warn("crt-overlay:", why); document.documentElement.classList.add("no-webgl"); };
    if (!element || !gl) return fail("no WebGL");
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    } catch (error) { return fail(error); }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fail(gl.getProgramInfoLog(program));
    document.documentElement.classList.remove("no-webgl");
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(["res", "time", "barrel", "mouse", "mouseActive", "crtStrength", "lineStrength", "flash", "wall"].map(name => [name, gl.getUniformLocation(program, `u_${name}`)]));

    const coarse = matchMedia("(pointer: coarse)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: .5, y: .5, active: 0, target: 0 };
    const level = { crt: 0, line: 0 };
    let frame = 0, last = performance.now();
    const start = last;

    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.round(innerWidth * ratio);
      element.height = Math.round(innerHeight * ratio);
      gl.viewport(0, 0, element.width, element.height);
      draw(performance.now());
    };
    const draw = (now: number) => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      const mobile = innerWidth <= 700;
      let [crt, line] = modes[document.documentElement.dataset.crt ?? "desktop"] ?? modes.desktop;
      const longest = Math.max(innerWidth, innerHeight);
      if (longest > 2000) { const boost = Math.min(1.8, 1 + (longest - 2000) / 2800); crt *= boost; line *= Math.min(boost, 1.4); }
      if (!on.current) crt = line = 0;
      level.crt += (crt - level.crt) * Math.min(1, dt * 4);
      level.line += (line - level.line) * Math.min(1, dt * 4);
      mouse.active += (mouse.target - mouse.active) * Math.min(1, dt * 6);
      gl.uniform2f(u.res, element.width, element.height);
      gl.uniform1f(u.time, (now - start) / 1000);
      gl.uniform1f(u.barrel, mobile ? .028 : .08);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.mouseActive, mouse.active);
      gl.uniform1f(u.crtStrength, level.crt);
      gl.uniform1f(u.lineStrength, level.line);
      gl.uniform1f(u.flash, 0);
      const wall = (document.documentElement.dataset.wall ?? "#050505").match(/\w\w/g)!.map(hex => parseInt(hex, 16) / 255);
      gl.uniform3f(u.wall, wall[0], wall[1], wall[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    let lastDraw = 0;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (coarse && now - lastDraw < 32) return;
      lastDraw = now;
      draw(now);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mouse.x = event.clientX / innerWidth; mouse.y = event.clientY / innerHeight; mouse.target = 1;
    };
    const leave = () => { mouse.target = 0; };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (document.hidden) return;
      if (reduced) { level.crt = (modes[document.documentElement.dataset.crt ?? "desktop"] ?? modes.desktop)[0]; draw(performance.now()); }
      else frame = requestAnimationFrame(loop);
    };
    resize();
    visibility();
    addEventListener("resize", resize);
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <>
    <div className="crt-bulge" aria-hidden="true" />
    <div className="crt-glass" aria-hidden="true" />
    <canvas ref={canvas} className="crt-overlay" aria-hidden="true" />
  </>;
}
