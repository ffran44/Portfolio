import { Hero } from "@/components/hero"
import { ProfessionalSummary } from "@/components/professional-summary"
import { NetworkLab } from "@/components/network-lab"
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
import { SiteFooter } from "@/components/site-footer"
import { WaveDivider } from "@/components/wave-divider"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProfessionalSummary />
      <NetworkLab />
      <OperationalImpact />
      <CoreSkills />
      <TechnicalSkills />
      <MonitoringWorkflow />
      <WaveDivider />
      <Experience />
      <Projects />
      <Certifications />
      <Education />
      <Languages />
      <WaveDivider flip />
      <Contact />
      <SiteFooter />
    </main>
  )
}
