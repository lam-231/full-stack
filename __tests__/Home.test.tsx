import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'

jest.mock('../app/api/auth/[...nextauth]/route', () => ({
    authOptions: {}
}))
jest.mock('next-auth/next', () => ({
    getServerSession: jest.fn().mockResolvedValue(null),
}))

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            discovery: {
                count: jest.fn().mockResolvedValue(40),
                findMany: jest.fn().mockResolvedValue([]),
            },
            user: {
                count: jest.fn().mockResolvedValue(10),
            },
            comment: {
                count: jest.fn().mockResolvedValue(5),
            }
        }))
    }
})

describe('Home Page', () => {
    it('renders the main heading and stats without crashing', async() => {
        const ResolvedHome = await Home()
        render(ResolvedHome)

        const element = screen.getByRole('heading', { level: 1 })
        expect(element).toBeInTheDocument()

        expect(screen.getByText('40')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
    })
})