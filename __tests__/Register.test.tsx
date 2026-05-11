import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RegisterPage from '@/app/(dashboard)/register/page'

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

describe('Register Page', () => {
    it('renders the registration form without crashing', () => {
        render(<RegisterPage />)

        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toHaveTextContent('Реєстрація екіпажу')

        const button = screen.getByRole('button', { name: /Створення...|Зареєструватись/i })
        expect(button).toBeInTheDocument()
    })
})