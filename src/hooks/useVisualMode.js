import { useState } from "react";

//The useVisualMode custom hook is defined
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //The transition function allows transitioning to a new mode
  function transition(newMode, replace = false) {
    if (replace) {
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1] = newMode;
        return newHistory;
      });
    } else {
      setHistory((prevHistory) => [...prevHistory, newMode]);
    }
    setMode(newMode);
  }
  //The back function is defined, which allows going back to the previous mode in history
  function back() {
    if (history.length > 1) {
      // Remove the last mode from history
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);

      // Set the mode to the previous mode
      const previousMode = newHistory[newHistory.length - 1];
      setMode(previousMode);
    }
  }
  return { mode, transition, back };
}
