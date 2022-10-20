import {fireEvent, render, screen} from '@testing-library/react';
import EditDate from './EditDate';
import Timekeeper from './Timekeeper';

window.scrollTo = jest.fn();

describe("Tests for Timekeeper.js", () => {
    afterEach(() => {
        jest.resetAllMocks()
      })
      afterAll(() => {
        jest.clearAllMocks()
      })

    test("Timekeeper should render Button", () => {
        render(<EditDate/>);

        const linkElement = screen.getByText(/Speichern/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("Timekeeper should render validation error for -> Year has no valid input value", () => {
        render(<Timekeeper/>);

        const button = screen.getByText(/Tag Erstellen/i);

        fireEvent.click(button);
        expect(screen.getByText(/Bitte geben Sie ein gültiges Jahr ein./i)).toBeInTheDocument();

    });

});