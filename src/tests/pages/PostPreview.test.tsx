import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from "next-auth/client"
import { useRouter } from 'next/router';

import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
    slug: 'my-new-post', title: 'My New Post', content: '<p>Post content</p>', updatedAt: '10 de Abril'
}

jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

describe('PostPreview page', () => {
    it('should render the page correctly', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<PostPreview post={post} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument();
        expect(screen.getByText("Post content")).toBeInTheDocument();
        expect(screen.getByText("Wanna keep reading?")).toBeInTheDocument();
    })

    it('should redirect user to full post if the user has a subscription', async () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMocked = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' },
            false
        ] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked
        } as any)

        render(<PostPreview post={post} />)

        expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('should load initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My New Post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post content' }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        const response = await getStaticProps({ params: { slug: 'my-new-post' } } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})