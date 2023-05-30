import React from "react"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import AppFunctional from "./AppFunctional"
import "@testing-library/jest-dom/extend-expect"

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})


test('up Buttons Render', () => {
  render(<AppFunctional />);
  const upButton = screen.queryByText('UP');
  expect(upButton).toBeInTheDocument();
})

test('right Buttons Render', () => {
  render(<AppFunctional />);
  const rightButton = screen.queryByText('RIGHT')
  expect(rightButton).toBeInTheDocument();
})

test('down Buttons Render', () => {
  render(<AppFunctional />);
  const downButton = screen.queryByText('DOWN')
  expect(downButton).toBeInTheDocument();
})

test('left Buttons Render', () => {
  render(<AppFunctional />);
  const leftButton = screen.queryByText('LEFT')
  expect(leftButton).toBeInTheDocument();
})

test('reset Buttons Render', () => {
  render(<AppFunctional />);
  const resetButton = screen.queryByText('reset')
  expect(resetButton).toBeInTheDocument();
})