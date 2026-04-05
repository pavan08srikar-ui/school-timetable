import { useState, useEffect } from 'react';

const INITIAL_SCHEMA = {
  dayCycle: { type: 'monday_to_friday', labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  constraints: { breakPeriods: [], labContinuityRules: {} },
  classes: [],     // { id, name, section, dailyPeriods, strength }
  classrooms: [],  // { id, name, type (room/lab), capacity }
  subjects: [],    // { id, name, type, preferredTime, minWeekly, maxWeekly, maxPerDay, continuousLab }
  faculty: [],     // { id, name, maxDailyLoad, subjectIds: [], unavailableSlots: [] }
  mappings: [],    // { id, classId, subjectId, facultyId, roomId, periodsPerWeek }
  timetable: null,
};

export function useTimetableSchema() {
  const [schema, setSchema] = useState(() => {
    const saved = localStorage.getItem('timetable_schema');
    return saved ? JSON.parse(saved) : INITIAL_SCHEMA;
  });

  useEffect(() => {
    localStorage.setItem('timetable_schema', JSON.stringify(schema));
  }, [schema]);

  const updateSchemaField = (field, value) => {
    setSchema(s => ({ ...s, [field]: value }));
  };

  const addItemItem = (field, item) => {
    setSchema(s => ({ ...s, [field]: [...s[field], { id: Date.now().toString(), ...item }] }));
  };
  
  const removeItemItem = (field, id) => {
    setSchema(s => ({ ...s, [field]: s[field].filter(c => c.id !== id) }));
  };

  const updateItemItem = (field, id, updatedItem) => {
    setSchema(s => ({ 
      ...s, 
      [field]: s[field].map(item => item.id === id ? { ...item, ...updatedItem } : item) 
    }));
  };

  const setTimetable = (timetable) => setSchema(s => ({ ...s, timetable }));

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schema, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "timetable_schema.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported.classes && imported.subjects && imported.faculty) {
            setSchema(imported);
            resolve(true);
          } else {
            reject(new Error("Invalid schema format"));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset everything? This cannot be undone.")) {
      setSchema(INITIAL_SCHEMA);
    }
  };

  return {
    schema,
    updateSchemaField,
    addItemItem,
    removeItemItem,
    updateItemItem,
    setTimetable,
    exportJSON,
    importJSON,
    resetAll
  };
}
