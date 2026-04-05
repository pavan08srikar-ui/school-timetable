// A simple heuristic-based timetable generator.

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export function generateTimetable(schema) {
  const { dayCycle, classes, faculty, mappings, constraints, classrooms } = schema;
  const days = dayCycle.labels;

  // Since daily periods can now vary by class, we find the maximum periods across all classes 
  // to ensure our matrix encompasses everything, or we just use each class's specific dailyPeriods.
  // We'll use each class's specific dailyPeriods for validation, but for the global matrix we can 
  // assume a reasonable max to build the slots.
  let globalMaxPeriods = 8; 
  if (classes.length > 0) {
    globalMaxPeriods = Math.max(...classes.map(c => c.dailyPeriods || 8));
  }

  const classTimetable = {};
  classes.forEach(cls => {
    classTimetable[cls.id] = {};
    days.forEach(day => {
      // Use specific dailyPeriods for the class matrix
      classTimetable[cls.id][day] = Array(cls.dailyPeriods || 8).fill(null);
    });
  });

  const facultyAvailable = {};
  faculty.forEach(fac => {
    facultyAvailable[fac.id] = {};
    days.forEach(day => {
      // Faculty is bound by the maximum periods
      facultyAvailable[fac.id][day] = Array(globalMaxPeriods).fill(true);
    });
  });

  // Track room availability
  const roomAvailable = {};
  classrooms.forEach(rm => {
    roomAvailable[rm.id] = {};
    days.forEach(day => {
      roomAvailable[rm.id][day] = Array(globalMaxPeriods).fill(true);
    });
  });

  let requiredPeriods = [];
  mappings.forEach(m => {
    for (let i = 0; i < m.periodsPerWeek; i++) {
        requiredPeriods.push({ ...m }); 
    }
  });

  requiredPeriods = shuffle(requiredPeriods);
  const unassigned = [];
  
  // A map to track how many periods a faculty has taught on a specific day
  const facultyDailyLoadCount = {};
  faculty.forEach(f => {
    facultyDailyLoadCount[f.id] = {};
    days.forEach(d => facultyDailyLoadCount[f.id][d] = 0);
  });

  for (const req of requiredPeriods) {
    const { classId, facultyId, roomId } = req;
    const cls = classes.find(c => c.id === classId);
    if (!cls) continue;

    let possibleSlots = [];
    days.forEach(day => {
      for (let p = 0; p < (cls.dailyPeriods || 8); p++) {
        // Universal Break Block rule:
        if (constraints.breakPeriods.includes(p + 1)) { // period index + 1
          continue; 
        }

        // Faculty Daily Load limit rule:
        const facSettings = faculty.find(f => f.id === facultyId);
        if (facSettings && facultyDailyLoadCount[facultyId][day] >= facSettings.maxDailyLoad) {
          continue;
        }

        if (
          classTimetable[classId][day][p] === null && 
          facultyAvailable[facultyId][day][p] && 
          (roomId ? roomAvailable[roomId][day][p] : true)
        ) {
          let countOnDay = classTimetable[classId][day].filter(slot => slot && slot.id === req.id).length;
          possibleSlots.push({ day, p, countOnDay });
        }
      }
    });

    if (possibleSlots.length > 0) {
      possibleSlots.sort((a, b) => a.countOnDay - b.countOnDay);
      const bestSlots = possibleSlots.filter(s => s.countOnDay === possibleSlots[0].countOnDay);
      const chosen = bestSlots[Math.floor(Math.random() * bestSlots.length)];

      classTimetable[classId][chosen.day][chosen.p] = req;
      facultyAvailable[facultyId][chosen.day][chosen.p] = false; 
      if (roomId) roomAvailable[roomId][chosen.day][chosen.p] = false;
      
      facultyDailyLoadCount[facultyId][chosen.day] += 1;
    } else {
      unassigned.push(req);
    }
  }

  return {
    success: unassigned.length === 0,
    data: classTimetable,
    unassignedCount: unassigned.length,
    unassignedDetails: unassigned,
    globalMaxPeriods
  };
}
