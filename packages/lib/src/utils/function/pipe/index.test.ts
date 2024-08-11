import { asyncPipe, pipe } from '.'

test('pipe', () => {
  const result = pipe(
    10,
    (x: number) => x * 2,
    (x: number) => x + 1,
    (x: number) => x.toString()
  )

  expect(result).toBe('21')
})

test('async pipe', async () => {
  const result = await asyncPipe(
    10,
    async (x: number) => x * 2,
    async (x: number) => x + 1,
    async (x: number) => x.toString()
  )

  expect(result).toBe('21')
})
