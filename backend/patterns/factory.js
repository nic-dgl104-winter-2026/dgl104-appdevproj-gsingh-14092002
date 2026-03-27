// Factory Pattern
// Dynamically creates user objects with role-based permissions.
// Each role has a defined set of access rights within the system.

function createUser(username, password, role) {

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
    // Developers can only update the status of tasks assigned to them
    return {
      ...baseUser,
      canCreateTasks: false,
      canDeleteTasks: false,
      canAssignTasks: false,
      canViewReports: false,
    };
  }

  if (role === 'tester') {
    // Testers can only update the status of tasks assigned to them
    return {
      ...baseUser,
      canCreateTasks: false,
      canDeleteTasks: false,
      canAssignTasks: false,
      canViewReports: false,
    };
  }

  // Default role is developer
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