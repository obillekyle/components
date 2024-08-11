import { dataURLtoBlob } from './data'

describe('data', () => {
  test('dataURLtoBlob', async () => {
    const blob = dataURLtoBlob('data:text/plain;base64,YQ==')
    expect(blob).instanceOf(Blob)
    expect(await blob!.text()).toBe('a')
  })
})
