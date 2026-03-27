// FACTORY PATTERN
// A factory is like a machine that creates different types of users
// You tell it what role you want, it gives you the right user object
// Think of it like a job application — Admin gets all access,
// Developer gets limited access, Tester gets read only

function createUser(username, password, role) {

  // Base user — every user has these basics
  const baseUser = {
    username,
    password,
    role,
  };

  // Depending on the role, we add different permissions
  if (role === 'admin') {
    return {
      ...baseUser,
      canDeleteTasks: true,
      canAssignTasks: true,
      canViewReports: true,
    };
  }

  if (role === 'manager') {
    return {
      ...baseUser,
      canDeleteTasks: false,
      canAssignTasks: true,
      canViewReports: true,
    };
  }

  if (role === 'developer') {
    return {
      ...baseUser,
      canDeleteTasks: false,
      canAssignTasks: false,
      canViewReports: false,
    };
  }

  if (role === 'tester') {
    return {
      ...baseUser,
      canDeleteTasks: false,
      canAssignTasks: false,
      canViewReports: false,
    };
  }

  // Default — if no role given, make them a developer
  return {
    ...baseUser,
    role: 'developer',
    canDeleteTasks: false,
    canAssignTasks: false,
    canViewReports: false,
  };
}

module.exports = createUser;