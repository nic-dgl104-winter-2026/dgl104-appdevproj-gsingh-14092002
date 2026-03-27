// OBSERVER PATTERN
// Think of it like a YouTube subscription
// When a task changes, everyone who is "subscribed" gets notified
// The task is the "publisher", the users are the "subscribers"

class EventObserver {
  constructor() {
    // This is our list of subscribers
    this.observers = [];
  }

  // Subscribe — add someone to the notification list
  subscribe(observerFunction) {
    this.observers.push(observerFunction);
  }

  // Unsubscribe — remove someone from the notification list
  unsubscribe(observerFunction) {
    this.observers = this.observers.filter(
      (obs) => obs !== observerFunction
    );
  }

  // Notify — when something happens, tell everyone on the list
  notify(data) {
    this.observers.forEach((observerFunction) => {
      observerFunction(data);
    });
  }
}

// Create one shared observer for task events
const taskObserver = new EventObserver();

// These are example subscribers — functions that react to task changes
function logTaskChange(data) {
  console.log(`Task updated: "${data.title}" is now "${data.status}"`);
}

function notifyAssignedUser(data) {
  console.log(`Notification sent: Task "${data.title}" was updated!`);
}

// Subscribe both functions to the observer
taskObserver.subscribe(logTaskChange);
taskObserver.subscribe(notifyAssignedUser);

module.exports = taskObserver;