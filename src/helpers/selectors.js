export function getAppointmentsForDay(state, day) {
  // Find the selected day object in the 'days' array of the state
  const selectedDay = state.days.find((item) => item.name === day);

  // If the selected day object is not found, return an empty array
  if (!selectedDay) {
    return [];
  }

  // Retrieve the appointments for the selected day based on the appointment IDs
  const appointments = selectedDay.appointments.map(
    (id) => state.appointments[id]
  );

  // Return the array of appointments for the selected day
  return appointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewer = state.interviewers[interview.interviewer]; //interview.interviewer is interviewer id

  return {
    ...interview,
    interviewer,
  };
}

export function getInterviewersForDay(state, day) {
  const selectedInteriew = state.days.find((item) => item.name === day);
  if (!selectedInteriew) {
    return [];
  }
  const interviewers = selectedInteriew.interviewers.map(
    (id) => state.interviewers[id]
  );

  return interviewers;
}
