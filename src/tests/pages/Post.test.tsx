import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getSession } from "next-auth/client"

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
    slug: 'my-new-post', title: 'My New Post', content: '<p>Post content</p>', updatedAt: '10 de Abril'
}

jest.mock('../../services/prismic');
jest.mock('next-auth/client')

describe('Posts page', () => {
    it('should render the page correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument();
        expect(screen.getByText("Post content")).toBeInTheDocument();
    })

    it('should redirect user if user has no subscription', async () => {
        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValue(null)


        const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it('should load initial data', async () => {
        const getSessionMocked = mocked(getSession);
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

        getSessionMocked.mockResolvedValue({
            activeSubscription: 'fake-active-subscription'
        })

        const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any);

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