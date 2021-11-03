import React from 'react'
import { render, screen } from '@testing-library/react'
import { Async } from '.'

test('should render correctly', () => {
    render(<Async />);

    expect(screen.getByText("Hello World")).toBeInTheDocument()
})