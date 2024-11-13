import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

test("renders the correct content in App", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const linkElement = await screen.findByText(/Welcome to My App/i); 
  expect(linkElement).toBeInTheDocument();
});
