import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from "next-auth/client";
import { SigninButton } from '.';

jest.mock('next-auth/client');

describe(('SigninButton Component'), () => {
    it('renders correctly when user not authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false])

        render(
            <SigninButton />
        )

        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    })

    it('renders correctly when user authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([
            { user: { name: 'John Doe', email: 'johndoe@gmail.com' }, expires: 'fake-expires' },
            false
        ])
        const { debug } = render(
            <SigninButton />
        )

        expect(screen.getByText('John Doe')).toBeInTheDocument();

        // debug()
    })
})