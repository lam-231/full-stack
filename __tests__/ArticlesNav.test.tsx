import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ArticlesNav from '@/app/(dashboard)/articles/ArticlesNav'

jest.mock('next/navigation', () => ({
    usePathname: () => '/articles',
}))

describe('Articles Navigation', () => {
    it('renders the navigation container', () => {
        const { container } = render(<ArticlesNav />)
        expect(container).not.toBeEmptyDOMElement()
    })
})