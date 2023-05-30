import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "components/Application.scss";
import DayList from "./DayList";
import "components/Appointment";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  // hook to fetch data from the server
  //renders data for days (nav bar)
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        const [daysResponse, appointmentsResponse, interviewersResponse] = all;
        setState((prev) => ({
          ...prev,
          days: daysResponse.data,
          appointments: appointmentsResponse.data,
          interviewers: interviewersResponse.data,
        }));
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    // Make a PUT request to update the appointment with the interview data
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        // Update the state with the new appointment
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        setState((prev) => ({
          ...prev,
          appointments,
        }));
      })
      .catch((error) => {
        // Handle any errors that occur during the PUT request
        console.error(error);
      });
  }

  function cancelInterview(id) {
    // Update the appointment's interview data to null
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    //Make a DELETE request to remove the interview data from the server
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        //Update the state with the modified appointment
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        setState((prev) => ({
          ...prev,
          appointments,
        }));

      })
      .catch((error) => {
        //Handle any error that occur during the DELETE request
        console.log(error);
      });
  }


  function editInterview(id) {
      const appointment = {
        ...state.appointments[id],
        interview:null,
      };

     //Make a PUT request to edit the interview data from the server
     return axios
      .put(`/api/appointments/${id}`) 
      .then(() => {
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        setState((prev) =>({
          ...prev,
          appointments,
        }));
      })
      .catch((error) =>{
        console.log(error);

      });

  }

  //to get the interviewers for the selected day
  // const interviewers = getInterviewersForDay(state, state.day);
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />

        <nav className="sidebar__menu">
          {/* Passing day and days to <DayList> */}
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>

        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map((appointment) => {
          const interview = getInterview(state, appointment.interview);
          const interviewersForDay = getInterviewersForDay(state, state.day);

          return (
            <Appointment
              key={appointment.id}
              id={appointment.id}
              time={appointment.time}
              interview={interview}
              interviewers={interviewersForDay}
              bookInterview={bookInterview}
              cancelInterview={cancelInterview}
              editInterview={editInterview}
            />
          );
        })}
      </section>
    </main>
  );
}
