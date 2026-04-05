import React, { useState } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';

export function Grid({ hook, onBack }) {
  const { schema, setTimetable } = hook;
  const { classes, subjects, classrooms, faculty, dayCycle, timetable } = schema;
  const days = dayCycle.labels;

  // We find the max periods to render the table columns properly
  let globalMaxPeriods = 8;
  if (classes.length > 0) {
    globalMaxPeriods = Math.max(...classes.map(c => c.dailyPeriods || 8));
  }

  const [viewMode, setViewMode] = useState('class'); // class or faculty
  const [selectedEntityId, setSelectedEntityId] = useState(classes[0]?.id || '');
  const [swapSource, setSwapSource] = useState(null);

  const currentGridData = () => {
    if (!timetable) return null;
    
    // We will build a matrix: matrix[dayIndex][periodIndex] = item
    const matrix = days.map(() => Array(globalMaxPeriods).fill(null));

    if (viewMode === 'class') {
      const classData = timetable[selectedEntityId];
      if (classData) {
        days.forEach((day, d) => {
          const maxP = classes.find(c => c.id === selectedEntityId)?.dailyPeriods || 8;
          for(let p=0; p < maxP; p++) {
            matrix[d][p] = classData[day][p];
          }
        });
      }
    } else {
      classes.forEach(c => {
        const classData = timetable[c.id];
        if (classData) {
          days.forEach((day, d) => {
            const maxP = c.dailyPeriods || 8;
            for(let p=0; p < maxP; p++) {
              const slot = classData[day][p];
              if (slot && slot.facultyId === selectedEntityId) {
                // Determine if there is already a slot, normally a faculty should not be double booked
                matrix[d][p] = { ...slot, _classContext: c.id };
              }
            }
          });
        }
      });
    }
    return matrix;
  };

  const handleSlotClick = (dayIndex, periodIndex, slotData) => {
    if (viewMode !== 'class') {
      alert('Swapping is only supported in Class view currently.');
      return;
    }

    const day = days[dayIndex];
    if (swapSource) {
      if (swapSource.day === day && swapSource.period === periodIndex) {
        setSwapSource(null);
        return;
      }
      
      const newTimetable = JSON.parse(JSON.stringify(timetable));
      const temp = newTimetable[selectedEntityId][day][periodIndex];
      newTimetable[selectedEntityId][day][periodIndex] = newTimetable[selectedEntityId][swapSource.day][swapSource.period];
      newTimetable[selectedEntityId][swapSource.day][swapSource.period] = temp;
      
      setTimetable(newTimetable);
      setSwapSource(null);
    } else {
      setSwapSource({ day, period: periodIndex });
    }
  };

  const matrix = currentGridData();

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1400px' }}>
      <header className="app-header flex justify-between items-center pb-4 mb-6">
        <div className="flex gap-4 items-center">
          <button className="btn btn-secondary shadow-glass" onClick={onBack}>
            <ArrowLeft size={18} /> Back to Setup
          </button>
          <h2>Timetable View</h2>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            className="glass-panel" 
            value={viewMode} onChange={e => { setViewMode(e.target.value); setSelectedEntityId(e.target.value === 'class' ? classes[0]?.id : faculty[0]?.id); setSwapSource(null); }}
            style={{ padding: '0.5rem 1rem' }}
          >
            <option value="class">Class View</option>
            <option value="faculty">Faculty View</option>
          </select>
          <select 
            className="glass-panel" 
            value={selectedEntityId} onChange={e => { setSelectedEntityId(e.target.value); setSwapSource(null); }}
            style={{ padding: '0.5rem 1rem' }}
          >
            {(viewMode === 'class' ? classes : faculty).map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </header>

      {viewMode === 'class' && (
        <div style={{ marginBottom: '1rem', color: 'var(--color-warning)' }} className="flex items-center gap-2">
           <Edit2 size={16} /> Click a slot to select, then click another to swap them.
        </div>
      )}

      <div className="glass-panel table-wrapper">
        <table className="timetable-grid">
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Day / Period</th>
              {Array.from({length: globalMaxPeriods}).map((_, i) => {
                // Is this a global break period?
                const isBreak = schema.constraints.breakPeriods.includes(i + 1);
                return (
                  <th key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: isBreak ? 'var(--color-warning)' : 'inherit' }}>
                    #{i+1} {isBreak && '(Break)'}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {days.map((day, d) => (
              <tr key={day}>
                <td style={{ fontWeight: 'bold', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                  {day}
                </td>
                {matrix && matrix[d].map((slot, p) => {
                  const isBreak = schema.constraints.breakPeriods.includes(p + 1);
                  let cellContent = isBreak ? <span style={{ color: 'var(--color-text-muted)' }}>Break</span> : <span style={{ color: 'var(--color-text-muted)' }}>Free</span>;
                  
                  if (slot) {
                    const sub = subjects.find(s => s.id === slot.subjectId);
                    const fac = faculty.find(f => f.id === slot.facultyId);
                    const room = classrooms.find(r => r.id === slot.roomId);
                    const clsContext = classes.find(c => c.id === slot._classContext);

                    cellContent = (
                      <div className="flex flex-col gap-1 items-center justify-center">
                        <strong className="text-brand-primary">{sub?.name || '---'}</strong>
                        {viewMode === 'class' && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{fac?.name}</span>}
                        {viewMode === 'faculty' && <span style={{ fontSize: '0.8rem', color: 'var(--color-brand-secondary)' }}>{clsContext?.name}</span>}
                        {room && <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.03)', padding: '2px 4px', borderRadius: '4px', marginTop: '2px', color: 'var(--color-text-muted)' }}>{room.name}</span>}
                      </div>
                    );
                  }

                  const isSwapping = swapSource?.day === day && swapSource?.period === p;
                  return (
                    <td 
                      key={p} 
                      onClick={() => !isBreak && handleSlotClick(d, p, slot)}
                      style={{ 
                        borderRight: p < globalMaxPeriods - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                        cursor: (viewMode === 'class' && !isBreak) ? 'pointer' : 'default',
                        backgroundColor: isSwapping ? 'rgba(79, 70, 229, 0.1)' : isBreak ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => { if(viewMode==='class' && !isBreak) e.currentTarget.style.backgroundColor = isSwapping ? 'rgba(79, 70, 229, 0.15)' : 'rgba(0,0,0,0.02)' }}
                      onMouseLeave={e => { if(viewMode==='class' && !isBreak) e.currentTarget.style.backgroundColor = isSwapping ? 'rgba(79, 70, 229, 0.1)' : (isBreak ? 'rgba(0, 0, 0, 0.02)' : 'transparent') }}
                    >
                      {cellContent}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
