"use client"

import { ExternalLink, Gamepad2, Workflow } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"
import { TiltCard } from "@/components/tilt-card"
import { cn } from "@/lib/utils"

/** A tiny topology whose links pulse in turn, for the Packet Tracer project. */
function TopologyArt() {
  const nodes: [number, number][] = [
    [30, 70],
    [90, 30],
    [150, 70],
    [210, 30],
    [270, 70],
  ]
  return (
    <svg viewBox="0 0 300 100" className="h-full w-full" aria-hidden="true">
      {nodes.slice(1).map(([x, y], i) => (
        <line
          key={i}
          x1={nodes[i][0]}
          y1={nodes[i][1]}
          x2={x}
          y2={y}
          className="art-link"
          style={{ animationDelay: `${i * 0.45}s` }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} className="art-node" style={{ animationDelay: `${i * 0.45}s` }} />
      ))}
    </svg>
  )
}

/** A pad with three dots circling it, for the Unity thesis. */
function GameArt() {
  return (
    <div className="art-orbit">
      <Gamepad2 className="h-14 w-14 text-accent" strokeWidth={1.4} />
      <span className="art-orbiter" style={{ "--a": "0deg" } as React.CSSProperties} />
      <span className="art-orbiter" style={{ "--a": "120deg" } as React.CSSProperties} />
      <span className="art-orbiter" style={{ "--a": "240deg" } as React.CSSProperties} />
    </div>
  )
}

/** Gears for the automation lab: the icon breathes, small dots drift up like process steps. */
function LabArt() {
  return (
    <div className="art-lab">
      <Workflow className="h-14 w-14 text-accent" strokeWidth={1.4} />
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="art-drift" style={{ left: `${22 + i * 18}%`, animationDelay: `${i * 0.7}s` }} />
      ))}
    </div>
  )
}

const ART = [TopologyArt, GameArt, LabArt]

export function Projects() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="projects" title={t.projects.title}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
        {t.projects.items.map((project, index) => {
          const Art = ART[index % ART.length]
          return (
            <Reveal key={index} variant="up" delay={index * 110} className={cn(index === 1 && "lg:mt-14")}>
              <TiltCard max={5} className="project-card">
                <div className="project-art">
                  <Art />
                </div>
                <div className="space-y-4 p-6 md:p-7">
                  <h3 className="text-balance font-serif text-xl font-bold leading-tight text-foreground md:text-2xl">{project.name}</h3>
                  <p className="text-base leading-relaxed text-foreground/80">{project.description}</p>
                  <ul className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <li key={techIndex} className="tech-chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link inline-flex items-center gap-2 text-sm font-semibold text-accent"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t.projects.viewRepo}
                    </a>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
