"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"
import { prefersReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

type NodeId = "pcA" | "pcB" | "sw1" | "r1" | "r2" | "srv" | "net"
type Kind = "pc" | "switch" | "router" | "server" | "cloud"
type Point = [number, number]
type PacketKind = "request" | "reply" | "drop"

interface Device {
  id: NodeId
  label: string
  ip: string
  kind: Kind
  x: number
  y: number
  /** Initial TTL the device answers with. */
  ttl: number
}

const DEVICES: Record<NodeId, Device> = {
  pcA: { id: "pcA", label: "PC-A", ip: "192.168.10.10", kind: "pc", x: 90, y: 105, ttl: 128 },
  pcB: { id: "pcB", label: "PC-B", ip: "192.168.20.10", kind: "pc", x: 90, y: 355, ttl: 128 },
  sw1: { id: "sw1", label: "SW1", ip: "192.168.99.2", kind: "switch", x: 290, y: 230, ttl: 255 },
  r1: { id: "r1", label: "R1", ip: "10.0.0.1", kind: "router", x: 480, y: 230, ttl: 255 },
  r2: { id: "r2", label: "R2", ip: "10.0.0.2", kind: "router", x: 665, y: 230, ttl: 255 },
  srv: { id: "srv", label: "WEB-SRV", ip: "10.0.1.80", kind: "server", x: 815, y: 115, ttl: 64 },
  net: { id: "net", label: "Internet", ip: "8.8.8.8", kind: "cloud", x: 815, y: 350, ttl: 118 },
}

const NODE_ORDER: NodeId[] = ["pcA", "pcB", "sw1", "r1", "r2", "srv", "net"]

/** Cable, and the one-way latency it adds in milliseconds. */
const LINKS: [NodeId, NodeId, number][] = [
  ["pcA", "sw1", 1],
  ["pcB", "sw1", 1],
  ["sw1", "r1", 1],
  ["r1", "r2", 4],
  ["r2", "srv", 2],
  ["r2", "net", 9],
]

const isPc = (id: NodeId) => id === "pcA" || id === "pcB"

function neighbors(id: NodeId) {
  return LINKS.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []))
}

function shortestPath(from: NodeId, to: NodeId): NodeId[] {
  const queue: NodeId[][] = [[from]]
  const seen = new Set<NodeId>([from])
  while (queue.length) {
    const path = queue.shift() as NodeId[]
    const last = path[path.length - 1]
    if (last === to) return path
    for (const next of neighbors(last)) {
      if (!seen.has(next)) {
        seen.add(next)
        queue.push([...path, next])
      }
    }
  }
  return [from]
}

/** Hosts in other VLANs, and the switch's management address, are reached through R1 (router on a stick). */
function route(from: NodeId, to: NodeId): NodeId[] {
  if (isPc(from) && (isPc(to) || to === "sw1")) {
    return ["" + from, "sw1", "r1", "sw1", ...(to === "sw1" ? [] : [to])] as NodeId[]
  }
  return shortestPath(from, to)
}

function linkMs(a: NodeId, b: NodeId) {
  const link = LINKS.find(([x, y]) => (x === a && y === b) || (x === b && y === a))
  return link ? link[2] : 1
}

const pointsOf = (path: NodeId[]): Point[] => path.map((id) => [DEVICES[id].x, DEVICES[id].y])

interface Line {
  id: number
  kind: "cmd" | "out" | "ok" | "warn" | "note"
  text: string
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

function DeviceIcon({ kind }: { kind: Kind }): ReactNode {
  switch (kind) {
    case "pc":
      return (
        <>
          <rect x={-24} y={-24} width={48} height={32} rx={5} />
          <path d="M-9 20 H9 M0 8 V20" />
          <path d="M-14 -14 H4" className="lab-glint" />
        </>
      )
    case "switch":
      return (
        <>
          <rect x={-32} y={-13} width={64} height={26} rx={5} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={-23 + i * 9} y={-5} width={5} height={10} rx={1} className="lab-solid" />
          ))}
        </>
      )
    case "router":
      return (
        <>
          <circle r={26} />
          <path d="M-15 0 H15 M-10 -5 L-15 0 L-10 5 M10 -5 L15 0 L10 5 M0 -15 V15 M-5 -10 L0 -15 L5 -10 M-5 10 L0 15 L5 10" />
        </>
      )
    case "server":
      return (
        <>
          <rect x={-22} y={-28} width={44} height={15} rx={4} />
          <rect x={-22} y={-8} width={44} height={15} rx={4} />
          <rect x={-22} y={12} width={44} height={15} rx={4} />
          <circle cx={-13} cy={-20.5} r={2.5} className="lab-solid" />
          <circle cx={-13} cy={-0.5} r={2.5} className="lab-solid" />
          <circle cx={-13} cy={19.5} r={2.5} className="lab-solid" />
        </>
      )
    case "cloud":
      return <path d="M-28 12 C-42 12 -42 -8 -26 -9 C-24 -26 6 -28 10 -13 C26 -17 38 0 26 12 Z" />
  }
}

export function NetworkLab() {
  const { t } = useLanguage()
  const [source, setSource] = useState<"pcA" | "pcB">("pcA")
  const [running, setRunning] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [blocked, setBlocked] = useState(false)

  const packetRef = useRef<SVGGElement>(null)
  const consoleRef = useRef<HTMLPreElement>(null)
  const nodeRefs = useRef<Partial<Record<NodeId, SVGGElement | null>>>({})
  const lineId = useRef(0)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  useEffect(() => {
    const el = consoleRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const push = (kind: Line["kind"], text: string) => {
    lineId.current += 1
    const id = lineId.current
    setLines((prev) => [...prev.slice(-60), { id, kind, text }])
  }

  const hit = (id: NodeId) => {
    const el = nodeRefs.current[id]
    if (!el) return
    el.setAttribute("data-hit", "true")
    window.setTimeout(() => el.removeAttribute("data-hit"), 520)
  }

  /** Moves the packet along a polyline at a constant speed (SVG units per second). */
  const travel = (path: NodeId[], speed: number, kind: PacketKind) =>
    new Promise<void>((resolve) => {
      const packet = packetRef.current
      const points = pointsOf(path)
      if (!packet || points.length < 2) return resolve()

      const lengths: number[] = []
      let total = 0
      for (let i = 1; i < points.length; i++) {
        const length = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
        lengths.push(length)
        total += length
      }

      packet.setAttribute("data-kind", kind)
      packet.style.opacity = "1"
      hit(path[0])

      const start = performance.now()
      let nextHop = 1

      const step = (now: number) => {
        if (!alive.current) return resolve()
        const travelled = Math.min(total, ((now - start) / 1000) * speed)

        let remaining = travelled
        let segment = 0
        while (segment < lengths.length - 1 && remaining > lengths[segment]) {
          remaining -= lengths[segment]
          segment++
        }
        const ratio = lengths[segment] === 0 ? 1 : Math.min(1, remaining / lengths[segment])
        const x = points[segment][0] + (points[segment + 1][0] - points[segment][0]) * ratio
        const y = points[segment][1] + (points[segment + 1][1] - points[segment][1]) * ratio
        packet.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`)

        let covered = 0
        for (let i = 0; i < nextHop; i++) covered += lengths[i]
        while (nextHop < points.length && travelled >= covered - 0.5) {
          hit(path[nextHop])
          covered += lengths[nextHop] ?? 0
          nextHop++
        }

        if (travelled >= total) {
          packet.style.opacity = "0"
          resolve()
        } else {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    })

  const ping = async (target: NodeId) => {
    if (running) return
    const from = DEVICES[source]
    const to = DEVICES[target]

    if (target === source) {
      push("note", t.networkLab.sourceDisabled)
      return
    }

    setRunning(true)
    const quick = prefersReducedMotion()
    const denied = source === "pcB" && target === "srv"
    const path = denied ? route(source, "r1") : route(source, target)
    const back = [...path].reverse()

    push("cmd", `${from.label}> ping ${to.ip}`)
    push("out", `Pinging ${to.ip} with 32 bytes of data:`)

    const oneWay = path.slice(1).reduce((sum, id, i) => sum + linkMs(path[i], id), 0)
    const routers = path.slice(1, -1).filter((id) => id === "r1" || id === "r2").length
    let received = 0

    for (let i = 0; i < 4; i++) {
      if (!alive.current) return
      const speed = i === 0 ? 720 : 1900

      if (quick) await wait(220)
      else await travel(path, speed, "request")

      if (denied) {
        setBlocked(true)
        if (!quick) await travel(back, speed * 1.2, "drop")
        push("warn", `Reply from 192.168.20.1: Destination host unreachable.`)
      } else {
        if (!quick) await travel(back, speed * 1.2, "reply")
        const time = Math.max(1, oneWay * 2 + Math.floor(Math.random() * 3) - 1)
        push("ok", `Reply from ${to.ip}: bytes=32 time=${time}ms TTL=${to.ttl - routers}`)
        received++
      }
    }

    if (!alive.current) return
    push("out", `Ping statistics for ${to.ip}:`)
    push("out", `    Packets: Sent = 4, Received = ${received}, Lost = ${4 - received} (${((4 - received) * 25).toFixed(0)}% loss)`)
    if (denied) {
      push("note", t.networkLab.aclNote)
      push("note", "R1(config)# access-list 101 deny ip 192.168.20.0 0.0.0.255 host 10.0.1.80")
      window.setTimeout(() => alive.current && setBlocked(false), 1400)
    }
    setRunning(false)
  }

  const handleKey = (e: KeyboardEvent<SVGGElement>, id: NodeId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      void ping(id)
    }
  }

  return (
    <SectionWrapper id="network-lab" title={t.networkLab.title}>
      <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-10">
        <Reveal variant="scale" className="lab-board">
          <svg viewBox="0 0 900 460" className="block h-auto w-full" role="group" aria-label={t.networkLab.hint}>
            <g className="lab-vlan-tags" aria-hidden="true">
              <text x={90} y={44} textAnchor="middle" className="lab-tag lab-tag-a">
                VLAN 10
              </text>
              <text x={90} y={294} textAnchor="middle" className="lab-tag lab-tag-b">
                VLAN 20
              </text>
            </g>

            {LINKS.map(([a, b]) => (
              <g key={`${a}-${b}`} aria-hidden="true">
                <line x1={DEVICES[a].x} y1={DEVICES[a].y} x2={DEVICES[b].x} y2={DEVICES[b].y} className="lab-link" />
                <line x1={DEVICES[a].x} y1={DEVICES[a].y} x2={DEVICES[b].x} y2={DEVICES[b].y} className="lab-link-flow" />
              </g>
            ))}

            {NODE_ORDER.map((id) => {
              const device = DEVICES[id]
              const isSource = id === source
              return (
                <g
                  key={id}
                  ref={(el) => {
                    nodeRefs.current[id] = el
                  }}
                  className="lab-node"
                  data-source={isSource ? "true" : undefined}
                  data-busy={running ? "true" : undefined}
                  transform={`translate(${device.x} ${device.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={isSource ? `${device.label}, ${t.networkLab.sourceDisabled}` : `${t.networkLab.hint}: ${device.label} ${device.ip}`}
                  onClick={() => void ping(id)}
                  onKeyDown={(e) => handleKey(e, id)}
                >
                  <circle r={46} className="lab-halo" />
                  <g className="lab-icon">
                    <DeviceIcon kind={device.kind} />
                  </g>
                  <text y={58} textAnchor="middle" className="lab-name">
                    {device.label}
                  </text>
                  <text y={76} textAnchor="middle" className="lab-ip">
                    {device.ip}
                  </text>
                </g>
              )
            })}

            <g transform={`translate(${DEVICES.r1.x} ${DEVICES.r1.y - 56})`} aria-hidden="true">
              <g className="lab-block" data-show={blocked ? "true" : "false"}>
                <circle r={15} />
                <path d="M-6 -6 L6 6 M6 -6 L-6 6" />
                <text y={-24} textAnchor="middle">
                  ACL
                </text>
              </g>
            </g>

            <g ref={packetRef} className="lab-packet" data-kind="request" aria-hidden="true">
              <circle r={17} className="lab-packet-halo" />
              <circle r={6} className="lab-packet-core" />
            </g>
          </svg>
        </Reveal>

        <Reveal variant="right" delay={120} className="flex flex-col gap-5">
          <p className="max-w-[46ch] text-base leading-relaxed text-foreground/85">{t.networkLab.intro}</p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-foreground">{t.networkLab.from}</span>
            <div role="radiogroup" aria-label={t.networkLab.from} className="flex gap-2">
              {(["pcA", "pcB"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={source === id}
                  disabled={running}
                  onClick={() => setSource(id)}
                  className={cn("lab-chip", source === id && "is-on")}
                >
                  {DEVICES[id].label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t.networkLab.legend}</p>

          <div className="lab-console-wrap">
            <pre ref={consoleRef} className="lab-console" role="log" aria-live="polite" tabIndex={0}>
              <code>
                {lines.length === 0 ? (
                  <span className="lab-line lab-line-idle">
                    {DEVICES[source].label}&gt; {t.networkLab.hint.toLowerCase()}
                    <span className="lab-caret" aria-hidden="true" />
                  </span>
                ) : (
                  lines.map((line) => (
                    <span key={line.id} className={`lab-line lab-line-${line.kind}`}>
                      {line.text}
                    </span>
                  ))
                )}
              </code>
            </pre>
            <div className="lab-console-bar">
              <span className="lab-status" data-running={running ? "true" : "false"}>
                {running ? t.networkLab.running : t.networkLab.hint}
              </span>
              <button type="button" className="lab-clear" onClick={() => setLines([])} disabled={running || lines.length === 0}>
                {t.networkLab.clear}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
