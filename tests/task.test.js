// Unit Tests for Task Management System
// Tests core functions using Jest

const createUser = require('../backend/patterns/factory');
const { TaskSorter, priorityStrategy, dueDateStrategy } = require('../backend/patterns/strategy');

// ─── Factory Pattern Tests ────────────────────────

describe('Factory Pattern - createUser', () => {

  test('Admin has full permissions', () => {
    const user = createUser('adminuser', 'password', 'admin');
    expect(user.role).toBe('admin');
    expect(user.canCreateTasks).toBe(true);
    expect(user.canDeleteTasks).toBe(true);
    expect(user.canAssignTasks).toBe(true);
    expect(user.canViewReports).toBe(true);
  });

  test('Manager can create and assign tasks', () => {
    const user = createUser('manageruser', 'password', 'manager');
    expect(user.role).toBe('manager');
    expect(user.canCreateTasks).toBe(true);
    expect(user.canAssignTasks).toBe(true);
  });

  test('Developer cannot create or delete tasks', () => {
    const user = createUser('devuser', 'password', 'developer');
    expect(user.role).toBe('developer');
    expect(user.canCreateTasks).toBe(false);
    expect(user.canDeleteTasks).toBe(false);
  });

  test('Tester cannot create or delete tasks', () => {
    const user = createUser('testeruser', 'password', 'tester');
    expect(user.role).toBe('tester');
    expect(user.canCreateTasks).toBe(false);
    expect(user.canDeleteTasks).toBe(false);
  });

  test('Unknown role defaults to developer', () => {
    const user = createUser('unknown', 'password', 'unknown');
    expect(user.role).toBe('developer');
    expect(user.canCreateTasks).toBe(false);
  });

});

// ─── Strategy Pattern Tests ───────────────────────

describe('Strategy Pattern - TaskSorter', () => {

  const tasks = [
    { id: 1, title: 'Task A', priority: 'low', due_date: '2024-03-01' },
    { id: 2, title: 'Task B', priority: 'high', due_date: '2024-01-01' },
    { id: 3, title: 'Task C', priority: 'medium', due_date: '2024-02-01' },
  ];

  test('Priority strategy sorts high first', () => {
    const sorter = new TaskSorter(priorityStrategy);
    const sorted = sorter.sort([...tasks]);
    expect(sorted[0].priority).toBe('high');
    expect(sorted[1].priority).toBe('medium');
    expect(sorted[2].priority).toBe('low');
  });

  test('Due date strategy sorts earliest first', () => {
    const sorter = new TaskSorter(dueDateStrategy);
    const sorted = sorter.sort([...tasks]);
    expect(sorted[0].due_date).toBe('2024-01-01');
    expect(sorted[1].due_date).toBe('2024-02-01');
    expect(sorted[2].due_date).toBe('2024-03-01');
  });

  test('Strategy can be swapped at runtime', () => {
    const sorter = new TaskSorter(priorityStrategy);
    sorter.setStrategy(dueDateStrategy);
    const sorted = sorter.sort([...tasks]);
    expect(sorted[0].due_date).toBe('2024-01-01');
  });

});