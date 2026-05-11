import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Loading from '@/app/(dashboard)/articles/loading'

describe('Articles Loading Component', () => {
    it('renders without crashing', () => {
        const { container } = render(<Loading />)
        expect(container).not.toBeEmptyDOMElement()
    })
})