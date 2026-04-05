import React, { useState } from 'react';
import { useTimetableSchema } from './hooks/useTimetableSchema';
import { Wizard } from './components/Setup/Wizard';
import { Grid } from './components/Timetable/Grid';

function App() {
  const hook = useTimetableSchema();
  const [view, setView] = useState(hook.schema.timetable ? 'grid' : 'setup');

  return (
    <div className="App" style={{ minHeight: '100vh', padding: '2rem 0' }}>
      {view === 'setup' && (
        <Wizard 
          hook={hook} 
          onGenerate={() => setView('grid')} 
        />
      )}
      {view === 'grid' && (
        <Grid 
          hook={hook} 
          onBack={() => setView('setup')} 
        />
      )}
    </div>
  );
}

export default App;
