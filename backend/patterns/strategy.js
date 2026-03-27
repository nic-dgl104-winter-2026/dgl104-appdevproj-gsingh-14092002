// STRATEGY PATTERN
// Think of it like Google Maps — it gives you different routes
// to the same destination (walking, driving, cycling)
// Here we have different ways to sort/prioritize tasks
// You can swap the strategy without changing the rest of the code

// Strategy 1 — Sort tasks by priority (high first)
function priorityStrategy(tasks) {
  const order = { high: 1, medium: 2, low: 3 };
  return tasks.sort((a, b) => order[a.priority] - order[b.priority]);
}

// Strategy 2 — Sort tasks by due date (earliest first)
function dueDateStrategy(tasks) {
  return tasks.sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  });
}

// Strategy 3 — Sort tasks by status (todo first, then in progress, then completed)
function statusStrategy(tasks) {
  const order = { todo: 1, inprogress: 2, completed: 3 };
  return tasks.sort((a, b) => order[a.status] - order[b.status]);
}

// This is the context — it uses whichever strategy you pick
class TaskSorter {
  constructor(strategy) {
    // Set the default strategy
    this.strategy = strategy;
  }

  // You can swap strategy anytime
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  // Sort the tasks using the current strategy
  sort(tasks) {
    return this.strategy(tasks);
  }
}

module.exports = {
  TaskSorter,
  priorityStrategy,
  dueDateStrategy,
  statusStrategy,
};