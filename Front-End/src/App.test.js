import {render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Timekeeper from './Timekeeper';

// Mocked Components
jest.mock("./Timekeeper", () => () => <div>Mocked_Timekeeper</div>);
jest.mock("./NotFound", () => () => <div>Mocked_NotFound</div>);
jest.mock("./GlobalNavigation", () => () => <div>Mocked_GlobalNavigation</div>);
jest.mock("./Layout", () => () => <div>Mocked_Layout</div>);

describe("Routing tests for App.js", () => {
  test("Default route should render Timekeeper component", () => {
    render(
      <MemoryRouter>
        <App/>
        <Timekeeper/>
      </MemoryRouter>
    );
    expect(screen.getByText("Mocked_Timekeeper"))
    expect(screen.getByText("Mocked_Layout"))
    });

  test("404 route should render NotFound component", () => {
    render(
      <MemoryRouter initialEntries={["/notfound"]}>
        <App/>
      </MemoryRouter>
    );
    expect(screen.getByText("Mocked_NotFound"))
    });

    test(" /1337 -> 404 route should render NotFound component", () => {
      render(
        <MemoryRouter initialEntries={["/1337"]}>
          <App/>
        </MemoryRouter>
      );
      expect(screen.getByText("Mocked_NotFound"))
      });
});