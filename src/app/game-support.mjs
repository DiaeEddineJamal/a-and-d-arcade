/** @param {{ specs: {label: string, value: string}[] }} game */
export function gameSupport(game) {
  const controls = game.specs.find(spec => spec.label === 'Controls')?.value || '';
  const touch = /touch|finger/i.test(controls);
  return { devices: touch ? 'both' : 'desktop', label: touch ? 'Desktop + mobile' : 'Desktop only', note: touch ? 'Touch controls available. You can also play on a desktop.' : /mouse/i.test(controls) ? 'A mouse or keyboard is needed for this edition.' : 'A keyboard or gamepad is needed for this edition.' };
}
