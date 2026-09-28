// Web Audio API Procedural Synthesizer for Chess Sound Effects
class ChessAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  // Crisp wooden piece tap on board
  public playMove() {
    if (this.isMuted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, t);
      filter.frequency.exponentialRampToValueAtTime(140, t + 0.05);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    } catch {}
  }

  // Solid, satisfying piece capture snap
  public playCapture() {
    if (this.isMuted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;

      // Primary click
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(320, t);
      osc1.frequency.exponentialRampToValueAtTime(90, t + 0.08);

      gain1.gain.setValueAtTime(0.35, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.1);

      // Wood impact noise burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
    } catch {}
  }

  // Castling move: double wooden piece slide
  public playCastle() {
    if (this.isMuted) return;
    this.playMove();
    setTimeout(() => {
      this.playMove();
    }, 110);
  }

  // Check alert: tension chime
  public playCheck() {
    if (this.isMuted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const notes = [440, 554.37]; // A4, C#5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.07);

        gain.gain.setValueAtTime(0, t + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.07);
        osc.stop(t + idx * 0.07 + 0.32);
      });
    } catch {}
  }

  // Checkmate / Victory Fanfare
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const chords = [
        { f: 523.25, time: 0 },    // C5
        { f: 659.25, time: 0.12 }, // E5
        { f: 783.99, time: 0.24 }, // G5
        { f: 1046.5, time: 0.38 }  // C6
      ];

      chords.forEach(({ f, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + time);

        gain.gain.setValueAtTime(0, t + time);
        gain.gain.linearRampToValueAtTime(0.22, t + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + time + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + time);
        osc.stop(t + time + 0.7);
      });
    } catch {}
  }

  // Soft UI click
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, t);
      osc.frequency.exponentialRampToValueAtTime(250, t + 0.03);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    } catch {}
  }

  // Clock low time warning beep
  public playClockLow() {
    if (this.isMuted) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch {}
  }
}

export const chessAudio = new ChessAudio();
