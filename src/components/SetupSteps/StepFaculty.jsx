import React, { useState } from 'react';
import { Plus, Trash2, CalendarDays } from 'lucide-react';

export function StepFaculty({ hook }) {
  const { schema, addItemItem, removeItemItem, updateItemItem } = hook;
  
  const [fac, setFac] = useState({ name: '', maxDailyLoad: 6, subjectIds: [], unavailableSlots: [] });
  const [expandedFacId, setExpandedFacId] = useState(null);

  // Mouse drag selection state
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'add' or 'remove'

  const toggleSubject = (subId) => {
    if (fac.subjectIds.includes(subId)) {
       setFac({ ...fac, subjectIds: fac.subjectIds.filter(id => id !== subId) });
    } else {
       setFac({ ...fac, subjectIds: [...fac.subjectIds, subId] });
    }
  };

  const handleAdd = () => {
    if (fac.name) {
      addItemItem('faculty', { ...fac, subjectIds: [...fac.subjectIds], unavailableSlots: [] });
      setFac({ name: '', maxDailyLoad: 6, subjectIds: [], unavailableSlots: [] });
    }
  };

  const isSlotUnavailable = (facultyObj, dayStr, periodIndex) => {
    return facultyObj.unavailableSlots?.some(s => s.day === dayStr && s.period === periodIndex);
  };

  const handleSlotPointerDown = (fId, dayStr, pIndex, currentlyUnavailable) => {
    setIsDragging(true);
    const newMode = currentlyUnavailable ? 'remove' : 'add';
    setDragMode(newMode);
    applySlotToggle(fId, dayStr, pIndex, newMode);
  };

  const handleSlotPointerEnter = (fId, dayStr, pIndex) => {
    if (isDragging && dragMode) {
      applySlotToggle(fId, dayStr, pIndex, dragMode);
    }
  };

  const applySlotToggle = (fId, dayStr, pIndex, mode) => {
    const facultyObj = schema.faculty.find(f => f.id === fId);
    if (!facultyObj) return;

    let newSlots = [...(facultyObj.unavailableSlots || [])];
    const slotExists = newSlots.some(s => s.day === dayStr && s.period === pIndex);

    if (mode === 'add' && !slotExists) {
      newSlots.push({ day: dayStr, period: pIndex });
    } else if (mode === 'remove' && slotExists) {
      newSlots = newSlots.filter(s => !(s.day === dayStr && s.period === pIndex));
    }

    updateItemItem('faculty', fId, { unavailableSlots: newSlots });
  };

  // Build grid dimensions based on global settings
  const days = schema.dayCycle.labels;
  const maxPeriods = schema.classes.length > 0 ? Math.max(...schema.classes.map(c => c.dailyPeriods || 8)) : 8;

  return (
    <div 
      className="animate-fade-in"
      onPointerUp={() => { setIsDragging(false); setDragMode(null); }}
      onMouseLeave={() => { setIsDragging(false); setDragMode(null); }}
    >
      <h3>Faculty</h3>
      <p className="mb-6 text-text-secondary">Instead of typing subject names manually, click multiple subject chips below to assign expertise to the faculty member. This reduces input mistakes.</p>

      <div className="glass-card mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label>Faculty Name</label>
            <input 
              type="text" placeholder="Example: Mr. Rao, Ms. Priya" 
              value={fac.name} onChange={e => setFac({...fac, name: e.target.value})} 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Max Periods Per Day</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Daily load limit for the faculty member</span>
            <input 
              type="number" value={fac.maxDailyLoad} onChange={e => setFac({...fac, maxDailyLoad: Number(e.target.value)})} 
            />
          </div>
        </div>

        <div className="mb-2"><label>Select Expert Subjects</label></div>
        <div className="flex flex-wrap gap-2 mb-6">
          {schema.subjects.map(s => (
            <div 
              key={s.id} 
              className="glass-panel cursor-pointer flex items-center transition-fast" 
              style={{ 
                padding: '0.5rem 1rem', borderRadius: '20px',
                background: fac.subjectIds.includes(s.id) ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                color: fac.subjectIds.includes(s.id) ? '#fff' : 'var(--color-text-primary)'
              }}
              onClick={() => toggleSubject(s.id)}
            >
              {s.name}
            </div>
          ))}
          {schema.subjects.length === 0 && <div className="text-warning text-sm">Add subjects first to enable faculty subject selection.</div>}
        </div>

        <button className="btn btn-primary w-full" onClick={handleAdd}>
          <Plus size={18} /> Add Faculty Member
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {schema.faculty.map(f => (
          <div key={f.id} className="glass-panel flex flex-col gap-2" style={{ padding: '1.25rem' }}>
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-brand-primary" style={{ fontSize: '1.2rem' }}>{f.name}</strong>
                <div className="text-text-muted mt-1" style={{ fontSize: '0.85rem' }}>Max Load: {f.maxDailyLoad} periods/day</div>
              </div>
              <div className="flex gap-2">
                <button 
                  className={`btn ${expandedFacId === f.id ? 'btn-primary shadow-glow' : 'btn-secondary'}`} 
                  style={{ padding: '0.5rem' }} 
                  onClick={() => setExpandedFacId(prev => prev === f.id ? null : f.id)}
                  title="Mark Unavailable Slots"
                >
                  <CalendarDays size={16} className="mr-2"/> Unavailability
                </button>
                <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeItemItem('faculty', f.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {f.subjectIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {f.subjectIds.map(sid => {
                  const subName = schema.subjects.find(s => s.id === sid)?.name;
                  return subName ? <span key={sid} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px' }}>{subName}</span> : null;
                })}
              </div>
            )}

            {/* Unavailable Slots Grid UI */}
            {expandedFacId === f.id && (
              <div className="mt-6 p-4 rounded bg-black bg-opacity-20 animate-fade-in user-select-none" style={{ userSelect: 'none' }}>
                <h5 className="mb-2">Mark Faculty Unavailable Slots</h5>
                <p className="text-text-muted mb-4" style={{ fontSize: '0.8rem' }}>Click individual slots or drag across them to block times.</p>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Day</th>
                      {Array.from({length: maxPeriods}).map((_, i) => (
                        <th key={i} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>#{i+1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr key={day}>
                        <td style={{ padding: '0.5rem', fontWeight: 'bold', borderRight: '1px solid rgba(255,255,255,0.05)' }}>{day}</td>
                        {Array.from({length: maxPeriods}).map((_, p) => {
                          const isUnav = isSlotUnavailable(f, day, p);
                          return (
                            <td 
                              key={p} 
                              onPointerDown={(e) => { e.preventDefault(); handleSlotPointerDown(f.id, day, p, isUnav); }}
                              onPointerEnter={() => handleSlotPointerEnter(f.id, day, p)}
                              style={{ 
                                cursor: 'pointer',
                                padding: '0.5rem', 
                                borderRight: p < maxPeriods - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                backgroundColor: isUnav ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                                transition: 'background-color 0.1s'
                              }}
                            >
                              <div style={{ width: '100%', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', background: isUnav ? 'var(--color-danger)' : 'rgba(255,255,255,0.05)' }}>
                                {isUnav ? 'Blocked' : ''}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
