import { CustomEventHandler } from '.'

type Events = { example: [string] }
class MyEvent extends CustomEventHandler<Events> {
  value: any
}
function callback(this: MyEvent, args: string) {
  this.value = args
}

describe('CustomEvent class', () => {
  test('constructor', () => {
    const event = new MyEvent()
    expect(event).toBeInstanceOf(MyEvent)
  })

  test('add and emit', () => {
    const event = new MyEvent()
    event.addEventListener('example', callback)

    event.emit('example', ['test'])
    expect(event.value).toEqual('test')

    event.dispatchEvent('example', ['test2'])
    expect(event.value).toEqual('test2')
  })

  test('remove', () => {
    const event = new MyEvent()
    event.addEventListener('example', callback)

    event.removeEventListener('example', callback)

    event.emit('example', ['test'])
    expect(event.value).toEqual(undefined)
  })
})
