import { useEffect, useReducer } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }; // Update the selected day in the state
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      }; // Update the application data in the state

    case SET_INTERVIEW:
      // return { ...state, appointments: action.appointments };
      return {
        ...state,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: action.interview,
          },
        },
      }; // Update the interview data for a specific appointment in the state
    case SET_SPOTS:
      return { ...state, days: action.days, appointments: action.appointments };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  }); // Initialize the state using useReducer hook

  const setDay = (day) => dispatch({ type: SET_DAY, day }); // Dispatch action to update the selected day in the state

  // Establish a WebSocket connection when the component mounts
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // Listen for "SET_INTERVIEW" messages from the WebSocket server
    socket.addEventListener("message", (event) => {
      console.log("event.data:", event.data);
      const data = JSON.parse(event.data);
      if (data.type === "SET_INTERVIEW") {
        // Dispatch "SET_INTERVIEW" action to update interview data
        dispatch({
          type: "SET_INTERVIEW",
          id: data.id,
          interview: data.interview,
        });
      }
    });

    // Send a "ping" message to the server once the WebSocket connection is open
    socket.addEventListener("open", () => {
      const message = "ping";
      socket.send(message);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, [dispatch]);

  // Fetch initial data from the server
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        const [daysResponse, appointmentsResponse, interviewersResponse] = all;
        // Dispatch "SET_APPLICATION_DATA" action to update the application state
        dispatch({
          type: SET_APPLICATION_DATA,
          days: daysResponse.data,
          appointments: appointmentsResponse.data,
          interviewers: interviewersResponse.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // useCallback
  useEffect(() => {
    updateSpots(state.appointments);
  }, [state.appointments]);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview,
    };

    // Make a PUT request to update the appointment with the interview data
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };
      // Dispatch "SET_INTERVIEW" action to update interview data
      dispatch({
        type: SET_INTERVIEW,
        id,
        interview,
      });
      // Update spots when booking an interview
      updateSpots(appointments);
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    // Make a DELETE request to remove the interview data from the server
    return axios.delete(`/api/appointments/${id}`).then(() => {
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };
      // Dispatch "SET_INTERVIEW" action to update interview data
      dispatch({
        type: SET_INTERVIEW,
        id,
        interview: null,
      });
      // Update spots when canceling an interview
      updateSpots(appointments);
    });
  }

  function updateSpots(appointments) {
    // Calculate and update the number of spots for each day
    const days = state.days.map((day) => {
      const spots = getAppointmentsForDay(
        { days: state.days, appointments },
        day.name
      ).reduce((count, appointment) => {
        if (appointments[appointment.id].interview === null) {
          return count + 1;
        }
        return count;
      }, 0);
      return { ...day, spots };
    });

    // Update the state with the updated 'days' array
    dispatch({ type: SET_SPOTS, days, appointments });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
