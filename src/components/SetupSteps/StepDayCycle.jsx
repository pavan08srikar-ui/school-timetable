import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Edit2, Check } from 'lucide-react';

export function StepDayCycle({ hook }) {
  const { schema, updateSchemaField } = hook;
  const cycle = schema.dayCycle;
  
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newDay, setNewDay] = useState("");

  const setPresetMondayToSunday = () => {
    updateSchemaField('dayCycle', { 
      type: 'monday_to_sunday', 
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
    });
  };

  const setPresetDay1To7 = () => {
    updateSchemaField('dayCycle', { 
      type: 'custom', 
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] 
    });
  };

  const updateLabels = (newLabels) => {
    updateSchemaField('dayCycle', { ...cycle, labels: newLabels });
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newLabels = [...cycle.labels];
    [newLabels[index - 1], newLabels[index]] = [newLabels[index], newLabels[index - 1]];
    updateLabels(newLabels);
  };

  const moveDown = (index) => {
    if (index === cycle.labels.length - 1) return;
    const newLabels = [...cycle.labels];
    [newLabels[index], newLabels[index + 1]] = [newLabels[index + 1], newLabels[index]];
    updateLabels(newLabels);
  };

  const removeDay = (index) => {
    const newLabels = cycle.labels.filter((_, i) => i !== index);
    updateLabels(newLabels);
  };

  const handleEditSave = (index) => {
    if (editValue.trim() !== '') {
      const newLabels = [...cycle.labels];
      newLabels[index] = editValue.trim();
      updateLabels(newLabels);
    }
    setEditingIndex(null);
  };

  const addCustomDay = () => {
    if (newDay.trim() !== '') {
      updateLabels([...cycle.labels, newDay.trim()]);
      setNewDay("");
    }
  };

  return (
    <div className="animate-fade-in">
      <h3>Day Cycle</h3>
      <p className="mb-6 text-text-secondary">
        Select the Day Cycle
      </p>

      <div className="flex gap-4 mb-8">
        <button 
          className={`btn ${cycle.type === 'monday_to_sunday' ? 'btn-primary shadow-glow' : 'btn-secondary shadow-glass'}`} 
          onClick={setPresetMondayToSunday}
        >
          Use Monday to Sunday
        </button>
        <button 
          className={`btn ${cycle.type === 'custom' ? 'btn-primary shadow-glow' : 'btn-secondary shadow-glass'}`} 
          onClick={setPresetDay1To7}
        >
          Use Day 1 to Day 7
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4">Active Days Sequence</h4>
        
        <div className="flex flex-col gap-2 mb-6">
          {cycle.labels.map((day, idx) => (
            <div key={idx} className="glass-panel flex items-center justify-between" style={{ padding: '0.75rem 1rem' }}>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 text-text-muted">
                  <ArrowUp size={14} className="cursor-pointer hover:text-white" onClick={() => moveUp(idx)} style={{ opacity: idx === 0 ? 0.2 : 1 }} />
                  <ArrowDown size={14} className="cursor-pointer hover:text-white" onClick={() => moveDown(idx)} style={{ opacity: idx === cycle.labels.length - 1 ? 0.2 : 1 }} />
                </div>
                
                {editingIndex === idx ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)} 
                      style={{ padding: '0.25rem 0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-brand-primary)' }}
                      autoFocus
                    />
                    <button className="btn btn-primary" style={{ padding: '0.3rem 0.5rem' }} onClick={() => handleEditSave(idx)}>
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <strong className="text-brand-primary text-lg" style={{ minWidth: '120px' }}>{day}</strong>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingIndex !== idx && (
                  <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => { setEditingIndex(idx); setEditValue(day); }} title="Rename">
                    <Edit2 size={16} />
                  </button>
                )}
                <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => removeDay(idx)} title="Disable Day">
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
          {cycle.labels.length === 0 && <div className="text-danger">You must have at least one active day!</div>}
        </div>

        <div className="flex gap-4">
          <input 
            type="text" placeholder="Add custom day name..." 
            value={newDay} onChange={e => setNewDay(e.target.value)} 
          />
          <button className="btn btn-primary" onClick={addCustomDay}>
            <Plus size={18} /> Add Day
          </button>
        </div>
      </div>
    </div>
  );
}
