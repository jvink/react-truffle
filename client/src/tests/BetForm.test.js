import React from 'react';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import BetForm from '../components/BetForm';

afterEach(cleanup);

it('renders', () => {
    const { asFragment } = render(<BetForm />);
    expect(asFragment()).toMatchSnapshot();
});