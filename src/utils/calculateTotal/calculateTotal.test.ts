import { describe, it, expect } from 'vitest'
import { calculateTotal } from './calculateTotal'

describe('calculateTotal', () => {
    it('should sum comma-separated amounts correctly', () => {
        const result = calculateTotal('10,20,30')
        expect(result).toBe(60)
    })

    it('should handle newline-separated values', () => {
        const result = calculateTotal('5\n10\n15')
        expect(result).toBe(30)
    })

    it('should ignore extra spaces and empty lines', () => {
        const result = calculateTotal('  10 , 20  , , \n30\n ')
        expect(result).toBe(60)
    })

    it('should ignore invalid (non-numeric) values', () => {
        const result = calculateTotal('10,abc,20')
        expect(result).toBe(30)
    })

    it('should return 0 if all values are invalid', () => {
        const result = calculateTotal('foo,bar,baz')
        expect(result).toBe(0)
    })
})
