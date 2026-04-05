import React from 'react';

export function StepConstraints({ hook }) {
  const { schema, updateSchemaField } = hook;
  const constraints = schema.constraints;
  
  const toggleBreak = (periodIndex) => {
    let newBreaks = [...constraints.breakPeriods];
    if (newBreaks.includes(periodIndex)) {
      newBreaks = newBreaks.filter(p => p !== periodIndex);
    } else {
      newBreaks.push(periodIndex);
    }
    updateSchemaField('constraints', {
      ...constraints,
      breakPeriods: newBreaks.sort((a,b) => a-b)
    });
  };

  // We offer periods 1 through 15 just to cover mostly any school day.
  const periodsAvailable = Array.from({length: 12}, (_, i) => i + 1);

  return (
    <div className="animate-fade-in">
      <h3>Constraints</h3>
      <p className="mb-6 text-text-secondary">Set shared scheduling constraints before faculty allocation. Break periods block teaching slots, and labs can reserve continuous blocks automatically.</p>

      <div className="glass-card mb-8">
        <h4 className="mb-2">Break Periods</h4>
        <p className="text-text-muted mb-4" style={{ fontSize: '0.85rem' }}>
          Click one or more periods. Example: choose Period 4 when break comes after 3rd period.
        </p>
        
        <div className="flex flex-wrap gap-3">
          {periodsAvailable.map(p => {
             const isSelected = constraints.breakPeriods.includes(p);
             return (
               <button 
                 key={p} 
                 className={`btn ${isSelected ? 'btn-danger shadow-glow' : 'btn-secondary'}`}
                 style={{ width: '100px', padding: '0.5rem' }}
                 onClick={() => toggleBreak(p)}
               >
                 Period {p}
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
}
