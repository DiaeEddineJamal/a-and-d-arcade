"use client";
import { useEffect, useRef } from "react";

/** The two reaching hands as a halftone dot matrix; dots fade in at random, then shimmer. */
export default function DotHands({ color = "#ece6cf", className = "", step = 2 }: { color?: string; className?: string; step?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    let frame = 0;
    const image = new Image();
    image.src = "/ad-hands-dots.png";
    image.onload = () => {
      const sample = document.createElement("canvas");
      sample.width = image.width; sample.height = image.height;
      const sampler = sample.getContext("2d", { willReadFrequently: true })!;
      sampler.drawImage(image, 0, 0);
      const data = sampler.getImageData(0, 0, image.width, image.height).data;
      const dots: { x: number; y: number; v: number; t: number }[] = [];
      for (let y = 0; y < image.height; y += step) for (let x = 0; x < image.width; x += step) {
        const v = data[(y * image.width + x) * 4] / 255;
        if (v > .16) dots.push({ x: x / step, y: y / step, v, t: Math.random() });
      }
      const columns = Math.ceil(image.width / step), rows = Math.ceil(image.height / step);
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const start = performance.now();
      const render = (now: number) => {
        const width = element.clientWidth * ratio;
        if (element.width !== Math.round(width)) { element.width = Math.round(width); element.height = Math.round(width * rows / columns); }
        const cell = element.width / columns;
        const progress = reduced ? 2 : (now - start) / 1100;
        context.clearRect(0, 0, element.width, element.height);
        context.fillStyle = color;
        for (const dot of dots) {
          const appear = Math.min(1, Math.max(0, (progress - dot.t * .8) * 5));
          if (!appear) continue;
          const shimmer = reduced ? 1 : .86 + .14 * Math.sin(now / 340 + dot.t * 40);
          const size = cell * (.3 + dot.v * .62) * appear;
          context.globalAlpha = Math.min(1, dot.v * 1.25) * shimmer;
          context.fillRect(dot.x * cell + (cell - size) / 2, dot.y * cell + (cell - size) / 2, size, size);
        }
        if (!reduced) frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
    };
    return () => { cancelAnimationFrame(frame); image.onload = null; };
  }, [color, step]);
  return <canvas ref={canvas} className={`dot-hands ${className}`} role="img" aria-label="Two pixel hands reaching toward one another" />;
}
