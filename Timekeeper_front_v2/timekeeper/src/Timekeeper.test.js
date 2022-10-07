import {fireEvent, render, screen} from '@testing-library/react';
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
        render(<Timekeeper/>);

        const linkElement = screen.getByText(/Neuer Eintrag/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("Timekeeper should render Edit() on button click", () => {
        render(<Timekeeper/>);

        const button = screen.getByText(/Neuer Eintrag/i);
        fireEvent.click(button);
        expect(screen.getByText(/Speichern für neuer Tag/i)).toBeInTheDocument();
    });

    test("Timekeeper should render validation error for -> Year has no valid input value", () => {
        render(<Timekeeper/>);

        const button = screen.getByText(/Eingaben Prüfen/i);

        fireEvent.click(button);
        expect(screen.getByText(/Bitte geben Sie ein gültiges Jahr ein./i)).toBeInTheDocument();

    });

});