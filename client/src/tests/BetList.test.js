import React from 'react';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import BetList from '../components/BetList';

afterEach(cleanup);

it('renders', () => {
    const { asFragment } = render(<BetList bets={[
        {
            cityId: '123',
            name: 'test',
            inzet: 12,
            guess: 22,
            time: 'date',
            timeOfNow: 'date2'
        }
    ]} />);
    expect(asFragment()).toMatchSnapshot();
});