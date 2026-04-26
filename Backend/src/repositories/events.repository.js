let events = [];
let nextId = 1;

module.exports = {
  getAll: () => events,
  
  getById: (id) => events.find(e => e.id === id),
  
  add: (data) => {
    const newEvent = { id: nextId++, ...data };
    events.push(newEvent);
    return newEvent;
  },
  
  update: (id, data) => {
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...data };
      return events[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events.splice(index, 1);
      return true;
    }
    return false;
  }
};