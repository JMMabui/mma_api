// Define the sum function for testing
const sum = (a: number, b: number): number => a + b

describe('sum function', () => {
  it('should return the sum of two numbers', () => {
    expect(sum(1, 2)).toBe(3) // Verifica se 1 + 2 é igual a 3
  })

  it('should handle negative numbers', () => {
    expect(sum(-1, -1)).toBe(-2) // Verifica a soma de números negativos
  })
})
