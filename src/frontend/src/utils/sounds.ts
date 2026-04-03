let audioCtx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (muted) return null;
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

export function playDiceRoll(): void {
  const ctx = getCtx();
  if (!ctx) return;

  // 4 quick white noise bursts
  for (let i = 0; i < 4; i++) {
    const startTime = ctx.currentTime + i * 0.09;
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) {
      data[j] = (Math.random() * 2 - 1) * 0.4;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(startTime);
    source.stop(startTime + 0.15);
  }
}

export function playSnake(): void {
  const ctx = getCtx();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(440, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.6);

  // Slight vibrato via LFO
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 6;
  lfoGain.gain.value = 8;
  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  lfo.start(ctx.currentTime);
  lfo.stop(ctx.currentTime + 0.6);

  gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.25, ctx.currentTime + 0.4);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.6);
}

export function playLadder(): void {
  const ctx = getCtx();
  if (!ctx) return;

  // C4 = 261.63, E4 = 329.63, G4 = 392, C5 = 523.25
  const notes = [261.63, 329.63, 392.0, 523.25];
  const noteDuration = 0.12;

  notes.forEach((freq, i) => {
    const startTime = ctx.currentTime + i * noteDuration;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = freq;

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + noteDuration);
  });
}

export function playWin(): void {
  const ctx = getCtx();
  if (!ctx) return;

  // Ascending arpeggio: C4 → E4 → G4 → C5, each 0.15s
  const arpeggioNotes = [261.63, 329.63, 392.0, 523.25];
  const arpeggioStep = 0.15;

  arpeggioNotes.forEach((freq, i) => {
    const startTime = ctx.currentTime + i * arpeggioStep;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + arpeggioStep);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + arpeggioStep);
  });

  // Hold C5 with a swell after the arpeggio
  const swellStart =
    ctx.currentTime + arpeggioNotes.length * arpeggioStep + 0.05;
  const swellOsc = ctx.createOscillator();
  const swellGain = ctx.createGain();

  swellOsc.type = "sine";
  swellOsc.frequency.value = 523.25; // C5

  swellGain.gain.setValueAtTime(0.001, swellStart);
  swellGain.gain.linearRampToValueAtTime(0.35, swellStart + 0.3);
  swellGain.gain.setValueAtTime(0.35, swellStart + 0.6);
  swellGain.gain.exponentialRampToValueAtTime(0.001, swellStart + 0.9);

  swellOsc.connect(swellGain);
  swellGain.connect(ctx.destination);
  swellOsc.start(swellStart);
  swellOsc.stop(swellStart + 0.9);
}
