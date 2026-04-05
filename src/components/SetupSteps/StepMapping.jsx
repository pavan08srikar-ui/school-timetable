import React, { useState } from 'react';
import { Plus, Trash2, Play } from 'lucide-react';

export function StepMapping({ hook, onGenerate }) {
  const { schema, addItemItem, removeItemItem } = hook;
  
  const [map, setMap] = useState({ classId: '', subjectId: '', facultyId: '', roomId: '', periodsPerWeek: 3 });

  const handleAdd = () => {
    if (map.classId && map.subjectId && map.facultyId) {
      addItemItem('mappings', map);
      setMap({ ...map, subjectId: '', facultyId: '' });
    }
  };

  // Filter faculty to just those who have the selected subject as an expertise
  const matchingFaculty = map.subjectId 
    ? schema.faculty.filter(f => f.subjectIds.includes(map.subjectId))
    : [];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div style={{ maxWidth: '600px' }}>
          <h3>Mapping and Generate</h3>
          <p className="text-text-secondary mt-2">Map each class-subject to a faculty member and optionally a preferred room. Then generate automatically for one or many classes while keeping faculty clashes blocked across all selected classes.</p>
        </div>
        
        {/* DASHBOARD TOTALS && GENERATE BUTTON */}
        <div className="glass-panel items-center justify-center flex flex-col gap-4" style={{ padding: '1.5rem', minWidth: '300px' }}>
           <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-text-muted w-full mb-2">
             <div className="flex justify-between"><span>Classes</span><strong className="text-white">{schema.classes.length}</strong></div>
             <div className="flex justify-between"><span>Classrooms</span><strong className="text-white">{schema.classrooms.length}</strong></div>
             <div className="flex justify-between"><span>Subjects</span><strong className="text-white">{schema.subjects.length}</strong></div>
             <div className="flex justify-between"><span>Faculty</span><strong className="text-white">{schema.faculty.length}</strong></div>
             <div className="flex justify-between col-span-2 pt-2 border-t border-white border-opacity-10">
               <span className="text-brand-primary">Mappings</span><strong className="text-brand-primary">{schema.mappings.length}</strong>
             </div>
           </div>
           
           <button className="btn btn-primary shadow-glow w-full" onClick={onGenerate} style={{ padding: '0.75rem 2rem' }}>
             <Play size={20} /> GENERATE
           </button>
        </div>
      </div>

      <div className="glass-card mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label>Class and Section</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Pick the class this mapping belongs to</span>
            <select value={map.classId} onChange={e => setMap({...map, classId: e.target.value})}>
              <option value="">Select class for mapping</option>
              {schema.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label>Subject</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Pick the subject for that class</span>
            <select value={map.subjectId} onChange={e => {
              // When subject changes, reset faculty mapping since it might be invalid now
              setMap({...map, subjectId: e.target.value, facultyId: ''});
            }}>
              <option value="">Select subject</option>
              {schema.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Preferred Faculty (Primary)</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Only matching faculty are shown</span>
            <select value={map.facultyId} onChange={e => setMap({...map, facultyId: e.target.value})} disabled={!map.subjectId}>
              <option value="">Select faculty</option>
              {matchingFaculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            {map.subjectId && matchingFaculty.length === 0 && (
              <span className="text-danger mt-1 text-xs">No faculty assigned to this subject!</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label>Preferred Classroom</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Optional fixed room, useful for labs</span>
            <select value={map.roomId} onChange={e => setMap({...map, roomId: e.target.value})}>
              <option value="">Auto-pick suitable classroom</option>
              {schema.classrooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Periods/Wk</label>
            <span className="text-text-muted" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Overrides Subject Min limits</span>
            <input 
              type="number" value={map.periodsPerWeek} min={1} max={20}
              onChange={e => setMap({...map, periodsPerWeek: Number(e.target.value)})}
            />
          </div>
        </div>

        <button className="btn btn-primary w-full" onClick={handleAdd}>
          <Plus size={18} /> Add Mapping
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {schema.mappings.map(m => {
          const cls = schema.classes.find(x => x.id === m.classId)?.name || 'Unknown Class';
          const subObj = schema.subjects.find(x => x.id === m.subjectId);
          const sub = subObj?.name || 'Unknown Subject';
          const fac = schema.faculty.find(x => x.id === m.facultyId)?.name || 'Unknown Faculty';
          const rm = schema.classrooms.find(x => x.id === m.roomId)?.name || 'Auto-assigned Room';
          
          return (
            <div key={m.id} className="glass-panel flex justify-between items-center" style={{ padding: '1rem' }}>
              <div>
                <strong className="text-brand-primary" style={{ fontSize: '1.1rem' }}>{cls}</strong> 
                <span className="mx-2">&mdash;</span> 
                <span className="font-bold">{sub}</span> {subObj && subObj.type === 'lab' && <span className="text-brand-secondary text-xs ml-1">(Lab)</span>}
                <br/>
                <span className="text-text-muted text-sm mt-1 inline-block">
                  Teacher: <strong className="text-brand-secondary">{fac}</strong> | Room: <span className="text-warning">{rm}</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                 <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                   {m.periodsPerWeek} / wk
                 </span>
                 <button className="btn btn-danger" style={{ padding: '0.6rem' }} onClick={() => removeItemItem('mappings', m.id)}>
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          )
        })}
        {schema.mappings.length === 0 && (
          <div className="text-center p-8 text-text-muted glass-panel border border-dashed border-white border-opacity-20 animate-fade-in">
             No mappings defined yet. Map a class to a subject and teacher above!
          </div>
        )}
      </div>
    </div>
  );
}
