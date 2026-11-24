import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { PlanOption } from './utils/pipelineLogic';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { PipelineWorkflowSection } from './components/PipelineWorkflowSection';
import { CodeTransformationSection } from './components/CodeTransformationSection';
import { PullRequestSimulatorSection } from './components/PullRequestSimulatorSection';
import { ComparisonSection } from './components/ComparisonSection';
import { CaseAeepetSection } from './components/CaseAeepetSection';
import { PricingSection } from './components/PricingSection';
import { DiagnosticFormSection } from './components/DiagnosticFormSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { GlossaryProvider } from './components/TechTerm';
import { useThemePreference } from './hooks/useThemePreference';

export default function App() {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanOption['id']>('poc');
  const [selectionEpoch, setSelectionEpoch] = useState(0);
  const { resolvedTheme, preference, toggleTheme } = useThemePreference();

  const navigateToDiagnostic = (planId?: PlanOption['id']) => {
    if (planId) {
      setSelectedPlanId(planId);
      setSelectionEpoch((prev) => prev + 1);
    }
    const target = document.getElementById('diagnostico');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <GlossaryProvider>
        <div className="min-h-screen bg-[#040507] text-slate-100 flex flex-col">
          <ScrollProgressBar />
          <Navbar
            onSelectPoc={() => navigateToDiagnostic('poc')}
            resolvedTheme={resolvedTheme}
            preference={preference}
            onToggleTheme={toggleTheme}
          />

          <main className="flex-1">
            <HeroSection onSelectPoc={() => navigateToDiagnostic('poc')} />
            <ProblemSection onSelectPoc={() => navigateToDiagnostic('poc')} />
            <PipelineWorkflowSection />
            <CodeTransformationSection />
            <PullRequestSimulatorSection onSelectPoc={() => navigateToDiagnostic('poc')} />
            <ComparisonSection />
            <CaseAeepetSection />
            <PricingSection
              selectedPlanId={selectedPlanId}
              onSelectPlan={(planId) => navigateToDiagnostic(planId)}
            />
            <DiagnosticFormSection
              selectedPlanId={selectedPlanId}
              onChangePlan={setSelectedPlanId}
              selectionEpoch={selectionEpoch}
            />
            <FaqSection />
          </main>

          <Footer />
        </div>
      </GlossaryProvider>
    </MotionConfig>
  );
}
