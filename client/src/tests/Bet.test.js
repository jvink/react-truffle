import React from 'react';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import Bet from '../components/Bet';

afterEach(cleanup);

it('renders', () => {
    const { asFragment } = render(<Bet type={1} bet={
        {
            cityId: '123',
            name: 'Rotterdam',
            inzet: 12,
            guess: 22,
            time: '2019-06-12:00:00+01:00',
            timeOfNow: '2019-06-06T18:52:26+01:00'
        }
    } />);
    expect(asFragment()).toMatchSnapshot();
});

it('renders correct status', () => {
    const { getByTestId } = render(<Bet type={0} bet={
        {
            cityId: '1234',
            name: 'Dordrecht',
            inzet: 20,
            guess: 15,
            time: '2019-06-13:00:00+01:00',
            timeOfNow: '2019-06-06T18:52:26+01:00'
        }
    } />);

    expect(getByTestId("status")).toHaveTextContent("Pending");
});