import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from "next-auth/client";
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');
jest.mock('next/router');

describe(('SigninButton Component'), () => {
    it('renders correctly when user not authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />);

        // screen.logTestingPlaygroundURL();

        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    })

    it('should redirect user to sign in when not authenticated', () => {
        const mockedSignin = mocked(signIn);

        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(mockedSignin).toHaveBeenCalled();

    })

    it('should redirect to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                    name: 'John Doe',
                    email: 'johndoe@gmail.com'
                },
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            },
            false
        ]);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWith('/posts');
    })
})