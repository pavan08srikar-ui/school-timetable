import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function StepSubjects({ hook }) {
  const { schema, addItemItem, removeItemItem } = hook;
  const [sub, setSub] = useState({ 
    name: '', type: 'theory', preferredTime: 'flex', 
    minWeekly: 3, maxWeekly: 6, maxPerDay: 2, continuousLab: 3 
  });

  const handleAdd = () => {
    if (sub.name) {
      addItemItem('subjects', sub);
      setSub({ 
        name: '', type: 'theory', preferredTime: 'flex', 
        minWeekly: 3, maxWeekly: 6, maxPerDay: 2, continuousLab: 3 
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <h3>Subjects</h3>
      <p className="mb-6 text-text-secondary">Set the teaching limits for each subject.</p>

      <div className="glass-card mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label>Subject Name</label>
            <input 
              type="text" placeholder="Example: Mathematics, English, Physics" 
              value={sub.name} onChange={e => setSub({...sub, name: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Subject Type</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Keep theory and lab subjects separate here</span>
            <select 
              value={sub.type} onChange={e => setSub({...sub, type: e.target.value})}
            >
              <option value="theory">Theory</option>
              <option value="lab">Lab</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Preferred Time of Day</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Core vs Soft subjects preference</span>
            <select 
              value={sub.preferredTime} onChange={e => setSub({...sub, preferredTime: e.target.value})}
            >
              <option value="flex">Flexible - Any Time</option>
              <option value="morning">Morning (Early Slots)</option>
              <option value="afternoon">Afternoon (Late Slots)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Minimum Weekly Hours</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Class must get at least this many periods</span>
            <input 
              type="number" value={sub.minWeekly} 
              onChange={e => setSub({...sub, minWeekly: Number(e.target.value)})} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Maximum Weekly Hours</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Engine will never schedule beyond this</span>
            <input 
              type="number" value={sub.maxWeekly} 
              onChange={e => setSub({...sub, maxWeekly: Number(e.target.value)})} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Maximum Per Day</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Avoids too many repetitions in one day</span>
            <input 
              type="number" value={sub.maxPerDay} 
              onChange={e => setSub({...sub, maxPerDay: Number(e.target.value)})} 
            />
          </div>

          {sub.type === 'lab' && (
            <div className="flex flex-col gap-1 col-span-2">
              <label>Continuous Lab Periods</label>
              <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Used for labs, default 3 continuous periods</span>
              <input 
                type="number" value={sub.continuousLab} 
                onChange={e => setSub({...sub, continuousLab: Number(e.target.value)})} 
              />
            </div>
          )}
        </div>

        <button className="btn btn-primary w-full" onClick={handleAdd}>
          <Plus size={18} /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {schema.subjects.map(s => (
          <div key={s.id} className="glass-panel flex flex-col justify-between" style={{ padding: '1rem' }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <strong className="text-brand-primary" style={{ fontSize: '1.1rem' }}>{s.name}</strong> 
                <span className={`ml-2 px-2 rounded ${s.type === 'lab' ? 'bg-brand-secondary' : 'bg-brand-primary'}`} style={{ background: s.type === 'lab' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: '#fff', fontSize: '0.75rem' }}>
                  {s.type.toUpperCase()}
                </span>
              </div>
              <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeItemItem('subjects', s.id)}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 text-text-muted" style={{ fontSize: '0.8rem', gap: '4px' }}>
              <div>Prefers: <span className="text-white">{s.preferredTime}</span></div>
              <div>Max/Day: <span className="text-white">{s.maxPerDay}</span></div>
              <div>Weekly: <span className="text-white">{s.minWeekly} - {s.maxWeekly} hrs</span></div>
              {s.type === 'lab' && <div>Continuous: <span className="text-white">{s.continuousLab}</span></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
