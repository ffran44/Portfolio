// Original, fully synthesized tropical ambience — no external audio file, no sampled/transcribed
// melody. Built with the Web Audio API: a soft steel-drum-style arpeggio over a gentle wave bed,
// loosely inspired by chill tropical-house lobby music but composed from scratch.

const BPM = 112
const STEP = 60 / BPM / 2 // eighth notes
const SCHEDULE_AHEAD = 0.15
const SCHEDULE_INTERVAL_MS = 30

// I - V - vi - IV in C major, one octave apart from a mellow low register
const PROGRESSION: number[][] = [
  [261.63, 329.63, 392.0], // C major
  [196.0, 246.94, 293.66], // G major
  [220.0, 261.63, 329.63], // A minor
  [174.61, 220.0, 261.63], // F major
]

// 8 steps per chord: up, octave lift, back down — gives the arpeggio some sparkle
const ARP_PATTERN = [0, 1, 2, 1, 0, 1, 2, 1]
const ARP_OCTAVE = [0, 0, 0, 1, 1, 0, 0, 0]

function createWaveBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let lastOut = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    lastOut = (lastOut + 0.02 * white) / 1.02
    data[i] = lastOut * 3.2
  }
  return buffer
}

function createShakerBuffer(ctx: AudioContext) {
  const duration = 0.06
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const decay = 1 - i / data.length
    data[i] = (Math.random() * 2 - 1) * decay
  }
  return buffer
}

export class AmbientAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private waveBuffer: AudioBuffer | null = null
  private shakerBuffer: AudioBuffer | null = null
  private waveNodes: AudioScheduledSourceNode[] = []
  private timerId: number | null = null
  private nextStepTime = 0
  private stepIndex = 0
  private playing = false

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0
      this.master.connect(this.ctx.destination)
      this.waveBuffer = createWaveBuffer(this.ctx, 6)
      this.shakerBuffer = createShakerBuffer(this.ctx)
    }
    return this.ctx
  }

  async start() {
    const ctx = this.ensureContext()
    if (ctx.state === "suspended") await ctx.resume()
    if (this.playing || !this.master) return
    this.playing = true

    this.startWaveBed(ctx, this.master)

    this.stepIndex = 0
    this.nextStepTime = ctx.currentTime + 0.1
    this.scheduler()

    this.master.gain.cancelScheduledValues(ctx.currentTime)
    this.master.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5)
  }

  async stop() {
    if (!this.playing || !this.ctx || !this.master) return
    this.playing = false

    if (this.timerId !== null) {
      window.clearTimeout(this.timerId)
      this.timerId = null
    }

    const ctx = this.ctx
    const master = this.master
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)

    const waveNodes = this.waveNodes
    this.waveNodes = []
    setTimeout(() => {
      waveNodes.forEach((node) => {
        try {
          node.stop()
        } catch {
          // already stopped
        }
      })
    }, 1100)
  }

  isPlaying() {
    return this.playing
  }

  private startWaveBed(ctx: AudioContext, master: GainNode) {
    if (!this.waveBuffer) return

    const noise = ctx.createBufferSource()
    noise.buffer = this.waveBuffer
    noise.loop = true

    const waveFilter = ctx.createBiquadFilter()
    waveFilter.type = "lowpass"
    waveFilter.frequency.value = 420

    const filterLfo = ctx.createOscillator()
    filterLfo.frequency.value = 0.06
    const filterLfoDepth = ctx.createGain()
    filterLfoDepth.gain.value = 220
    filterLfo.connect(filterLfoDepth).connect(waveFilter.frequency)

    const waveGain = ctx.createGain()
    waveGain.gain.value = 0.05
    const waveLfo = ctx.createOscillator()
    waveLfo.frequency.value = 0.08
    const waveLfoDepth = ctx.createGain()
    waveLfoDepth.gain.value = 0.02
    waveLfo.connect(waveLfoDepth).connect(waveGain.gain)

    noise.connect(waveFilter).connect(waveGain).connect(master)

    noise.start()
    filterLfo.start()
    waveLfo.start()
    this.waveNodes.push(noise, filterLfo, waveLfo)
  }

  private scheduler = () => {
    if (!this.ctx || !this.master || !this.playing) return

    while (this.nextStepTime < this.ctx.currentTime + SCHEDULE_AHEAD) {
      this.scheduleStep(this.stepIndex, this.nextStepTime)
      this.nextStepTime += STEP
      this.stepIndex++
    }

    this.timerId = window.setTimeout(this.scheduler, SCHEDULE_INTERVAL_MS)
  }

  private scheduleStep(stepIndex: number, time: number) {
    if (!this.ctx || !this.master) return

    const barLength = ARP_PATTERN.length
    const chordIndex = Math.floor(stepIndex / barLength) % PROGRESSION.length
    const chord = PROGRESSION[chordIndex]
    const step = stepIndex % barLength

    const toneIndex = ARP_PATTERN[step]
    const octaveLift = ARP_OCTAVE[step]
    const freq = chord[toneIndex] * (octaveLift ? 2 : 1)

    this.playPluck(this.ctx, this.master, freq, time)

    // Soft shaker on the off-beats only, kept quiet under the arpeggio
    if (step % 2 === 1) {
      this.playShaker(this.ctx, this.master, time)
    }
  }

  private playPluck(ctx: AudioContext, master: GainNode, freq: number, time: number) {
    const duration = 0.45

    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, time)

    // Slightly inharmonic overtone gives the pluck a steel-drum-ish character
    const overtone = ctx.createOscillator()
    overtone.type = "sine"
    overtone.frequency.setValueAtTime(freq * 3.98, time)
    const overtoneGain = ctx.createGain()
    overtoneGain.gain.value = 0.12

    const env = ctx.createGain()
    env.gain.setValueAtTime(0, time)
    env.gain.linearRampToValueAtTime(0.16, time + 0.008)
    env.gain.exponentialRampToValueAtTime(0.001, time + duration)

    osc.connect(env)
    overtone.connect(overtoneGain).connect(env)
    env.connect(master)

    osc.start(time)
    overtone.start(time)
    osc.stop(time + duration + 0.05)
    overtone.stop(time + duration + 0.05)
  }

  private playShaker(ctx: AudioContext, master: GainNode, time: number) {
    if (!this.shakerBuffer) return

    const source = ctx.createBufferSource()
    source.buffer = this.shakerBuffer

    const filter = ctx.createBiquadFilter()
    filter.type = "highpass"
    filter.frequency.value = 4000

    const gain = ctx.createGain()
    gain.gain.value = 0.03

    source.connect(filter).connect(gain).connect(master)
    source.start(time)
  }
}
