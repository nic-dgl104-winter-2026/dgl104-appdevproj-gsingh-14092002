// FACTORY PATTERN
// A factory is like a machine that creates different types of users
// You tell it what role you want, it gives you the right user object
//
// ROLES AND PERMISSIONS:
// Admin   — full access, can do everything
// Manager — can create, assign and delete tasks, can view reports
// Developer — CANNOT create tasks, can only update status of assigned tasks
// Tester  — CANNOT create tasks, can only update status of assigned tasks

function createUser(username, password, role) {

  // Base user — every user has these basics
  const baseUser = {
    username,
    password,
    role,
  };

  if (role === 'admin') {
    return {
      ...baseUser,
      canCreateTasks: true,
      canDeleteTasks: true,
      canAssignTasks: true,
      canViewReports: true,
    };
  }

  if (role === 'manager') {
    return {
      ...baseUser,
      canCreateTasks: true,
      canDeleteTasks: true,
      canAssignTasks: true,
      canViewReports: true,
    };
  }

  if (role === 'developer') {
    // Developer can ONLY update status of tasks assigned to them
    // They cannot create, delete or assign tasks
    return {
      ...baseUser,
      canCreateTasks: false,
      canDeleteTasks: false,
      canAssignTasks: false,
      canViewReports: false,
    };
  }

  if (role === 'tester') {
    // Tester can ONLY update status of tasks assigned to them
    // They cannot create, delete or assign tasks
    return {
      ...baseUser,
      canCreateTasks: false,
      canDeleteTasks: false,
      canAssignTasks: false,
      canViewReports: false,
    };
  }

  // Default — if no role given, make them a developer
  return {
    ...baseUser,
    role: 'developer',
    canCreateTasks: false,
    canDeleteTasks: false,
    canAssignTasks: false,
    canViewReports: false,
  };
}

module.exports = createUser;