import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function StepClassrooms({ hook }) {
  const { schema, addItemItem, removeItemItem } = hook;
  const [room, setRoom] = useState({ name: '', type: 'classroom', capacity: 40 });

  const handleAdd = () => {
    if (room.name) {
      addItemItem('classrooms', room);
      setRoom({ name: '', type: 'classroom', capacity: 40 });
    }
  };

  return (
    <div className="animate-fade-in">
      <h3>Step 2: Classrooms</h3>
      <p className="mb-6 text-text-secondary">Add rooms, labs, and hall spaces. The generator uses these to avoid room conflicts and capacity problems.</p>

      <div className="glass-card mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label>Classroom / Lab Name</label>
            <input 
              type="text" placeholder="Example: Room 204, Physics Lab, Seminar Hall" 
              value={room.name} onChange={e => setRoom({...room, name: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Room Type</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Choose where theory or lab sessions can happen</span>
            <select 
              value={room.type} onChange={e => setRoom({...room, type: e.target.value})}
            >
              <option value="classroom">Classroom</option>
              <option value="lab">Lab</option>
              <option value="hall">Seminar Hall</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label>Capacity</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Maximum students the room can hold</span>
            <input 
              type="number"
              value={room.capacity} onChange={e => setRoom({...room, capacity: Number(e.target.value)})} 
            />
          </div>
        </div>

        <button className="btn btn-primary w-full" onClick={handleAdd}>
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {schema.classrooms.map(c => (
          <div key={c.id} className="glass-panel flex items-center justify-between" style={{ padding: '1rem' }}>
            <div>
              <strong className="text-brand-primary" style={{ fontSize: '1.1rem' }}>{c.name}</strong> 
              <span className={`ml-2 px-2 rounded ${c.type === 'lab' ? 'bg-brand-secondary' : 'bg-brand-primary'}`} style={{ background: c.type === 'lab' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: '#fff', fontSize: '0.75rem' }}>
                {c.type.toUpperCase()}
              </span>
              <div className="text-text-muted mt-2" style={{ fontSize: '0.85rem' }}>
                Capacity: {c.capacity} students
              </div>
            </div>
            <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeItemItem('classrooms', c.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
