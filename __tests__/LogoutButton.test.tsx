import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LogoutButton from '@/app/(dashboard)/profile/LogoutButton'

jest.mock('next-auth/react', () => ({
    signOut: jest.fn(),
}))

describe('Logout Button Component', () => {
    it('renders the button successfully', () => {
        render(<LogoutButton />)
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
    })
})