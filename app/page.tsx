import { Hero } from "@/components/hero"
import { ProfessionalSummary } from "@/components/professional-summary"
import { OperationalImpact } from "@/components/operational-impact"
import { CoreSkills } from "@/components/core-skills"
import { TechnicalSkills } from "@/components/technical-skills"
import { MonitoringWorkflow } from "@/components/monitoring-workflow"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Certifications } from "@/components/certifications"
import { Education } from "@/components/education"
import { Languages } from "@/components/languages"
import { Contact } from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProfessionalSummary />
      <OperationalImpact />
      <CoreSkills />
      <TechnicalSkills />
      <MonitoringWorkflow />
      <Experience />
      <Projects />
      <Certifications />
      <Education />
      <Languages />
      <Contact />
    </main>
  )
}
