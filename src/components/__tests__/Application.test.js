import React from "react";

import { render, cleanup } from "@testing-library/react";

import Application from "components/Application";
import {waitForElement, fireEvent} from "@testing-library/react";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);
//The argument we pass to waitForElement is a function that returns a promise a DOM node.It is looking for something based on the text "Monday".
  return waitForElement(() => getByText("Monday")).then(() => {
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
});