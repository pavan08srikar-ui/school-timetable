import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function StepClasses({ hook }) {
  const { schema, addItemItem, removeItemItem } = hook;
  const [newClass, setNewClass] = useState({ name: '', section: '', dailyPeriods: 6, strength: 40 });

  const handleAdd = () => {
    if (newClass.name) {
      addItemItem('classes', newClass);
      setNewClass({ name: '', section: '', dailyPeriods: 6, strength: 40 });
    }
  };

  return (
    <div className="animate-fade-in">
      <h3>Step 1: Classes</h3>
      <p className="mb-6 text-text-secondary">Create each class-section first. These become the timetable targets the engine will schedule.</p>

      <div className="glass-card mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label>Class Name</label>
            <input 
              type="text" placeholder="Example: Grade 7, BSc CS, Inter 1st Year" 
              value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} 
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label>Section</label>
            <input 
              type="text" placeholder="Example: A, B, Morning" 
              value={newClass.section} onChange={e => setNewClass({...newClass, section: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Periods Per Day</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>How many teaching slots exist each day</span>
            <input 
              type="number" 
              value={newClass.dailyPeriods} onChange={e => setNewClass({...newClass, dailyPeriods: Number(e.target.value)})} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Student Strength</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Used to match classroom capacity</span>
            <input 
              type="number" 
              value={newClass.strength} onChange={e => setNewClass({...newClass, strength: Number(e.target.value)})} 
            />
          </div>
        </div>

        <button className="btn btn-primary w-full" onClick={handleAdd}>
          <Plus size={18} /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {schema.classes.map(cls => (
          <div key={cls.id} className="glass-panel flex items-center justify-between" style={{ padding: '1rem' }}>
            <div>
              <strong className="text-brand-primary" style={{ fontSize: '1.1rem' }}>{cls.name} {cls.section ? `- Sec ${cls.section}` : ''}</strong>
              <div className="text-text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                {cls.dailyPeriods} periods/day | {cls.strength} students
              </div>
            </div>
            <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeItemItem('classes', cls.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
