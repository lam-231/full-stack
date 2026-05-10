import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'

describe('Home Page', () => {
    it('renders without crashing', () => {
        render(<Home />)
        const element = screen.getByRole('heading', { level: 1 })
        expect(element).toBeInTheDocument()
    })
})