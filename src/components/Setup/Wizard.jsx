import React, { useState } from 'react';
import { Trash2, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { generateTimetable } from '../../utils/timetableEngine';

import { StepClasses } from '../SetupSteps/StepClasses';
import { StepClassrooms } from '../SetupSteps/StepClassrooms';
import { StepDayCycle } from '../SetupSteps/StepDayCycle';
import { StepSubjects } from '../SetupSteps/StepSubjects';
import { StepConstraints } from '../SetupSteps/StepConstraints';
import { StepFaculty } from '../SetupSteps/StepFaculty';
import { StepMapping } from '../SetupSteps/StepMapping';

export function Wizard({ hook, onGenerate }) {
  const { schema, setTimetable, exportJSON, importJSON, resetAll } = hook;
  const [currentStep, setCurrentStep] = useState(1);

  const handleImport = (e) => {
    if (e.target.files.length > 0) {
      importJSON(e.target.files[0])
        .then(() => alert('Successfully imported schema!'))
        .catch((err) => alert('Error importing. Please ensure it is a valid JSON schema.'));
    }
  };

  const handleGenerate = () => {
    if (schema.classes.length === 0 || schema.faculty.length === 0 || schema.mappings.length === 0) {
      alert("Please add classes, faculty, and mappings before generating.");
      return;
    }
    const result = generateTimetable(schema);
    setTimetable(result.data);
    onGenerate();
    if (!result.success) {
      alert(`Generated, but could not schedule ${result.unassignedCount} required periods due to constraints.`);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { num: 1, label: 'Classes' },
    { num: 2, label: 'Classrooms' },
    { num: 3, label: 'Day Cycle' },
    { num: 4, label: 'Subjects' },
    { num: 5, label: 'Constraints' },
    { num: 6, label: 'Faculty' },
    { num: 7, label: 'Mapping' }
  ];

  return (
    <div className="container animate-fade-in">
      <header className="app-header flex justify-between items-center mb-8">
        <div className="app-logo">
           <Play size={28} className="text-brand-primary" />
           <span className="text-gradient">Timetable Setup</span>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-danger shadow-glass" onClick={resetAll}>
            <Trash2 size={18} /> Reset Data
          </button>
        </div>
      </header>

      {/* Progress Bar / Stepper */}
      <div className="flex justify-between items-center mb-8 glass-panel progress-container" style={{ padding: '1rem 2rem' }}>
        {steps.map((step, idx) => (
          <div key={step.num} className="flex items-center">
            <div 
              className="flex flex-col items-center cursor-pointer" 
              onClick={() => setCurrentStep(step.num)}
              style={{ opacity: currentStep === step.num ? 1 : 0.5, transition: '0.2s' }}
            >
              <div 
                className="flex items-center justify-center font-bold mb-1" 
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: currentStep === step.num ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)',
                  color: currentStep === step.num ? '#fff' : 'var(--color-text-muted)'
                }}
              >
                {step.num}
              </div>
              <span style={{ fontSize: '0.8rem', color: currentStep === step.num ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '0 1rem', transform: 'translateY(-10px)' }}></div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card mb-8" style={{ minHeight: '400px' }}>
        {currentStep === 1 && <StepClasses hook={hook} />}
        {currentStep === 2 && <StepClassrooms hook={hook} />}
        {currentStep === 3 && <StepDayCycle hook={hook} />}
        {currentStep === 4 && <StepSubjects hook={hook} />}
        {currentStep === 5 && <StepConstraints hook={hook} />}
        {currentStep === 6 && <StepFaculty hook={hook} />}
        {currentStep === 7 && <StepMapping hook={hook} onGenerate={handleGenerate} />}
      </div>

      <div className="flex justify-between mt-6">
        <button 
          className="btn btn-secondary px-6" 
          onClick={prevStep} 
          disabled={currentStep === 1}
          style={{ opacity: currentStep === 1 ? 0.3 : 1 }}
        >
          <ChevronLeft size={18} /> Previous Step
        </button>

        {currentStep < 7 ? (
          <button className="btn btn-primary px-6 shadow-glow" onClick={nextStep}>
            Next Step <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn btn-primary px-6 shadow-glow" onClick={handleGenerate}>
            FINISH & GENERATE <Play size={18} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
