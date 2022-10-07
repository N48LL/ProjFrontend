import {render, screen} from '@testing-library/react';
import Layout from './Layout';

window.scrollTo = jest.fn();

describe("Test for Layout.js", () => {
    afterEach(() => {
        jest.resetAllMocks()
      })
      afterAll(() => {
        jest.clearAllMocks()
      })

    test("Layout should render h1 Title", () => {
        render(<Layout/>);

        const linkElement = screen.getByText(/Timekeeper/i);
        expect(linkElement).toBeInTheDocument();
    });
});
    