import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Love Match Finder title", () => {
  render(<App />);
  const title = screen.getByText(/love match finder/i);
  expect(title).toBeInTheDocument();
});
