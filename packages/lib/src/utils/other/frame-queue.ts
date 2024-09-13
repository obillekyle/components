export class FrameQueue {
  private static _id = 0
  private static _queue = new Set<() => void>()
  private static _tick = () => {
    this._id = requestAnimationFrame(this._tick)
    for (const fn of this._queue) fn()
  }

  static add(callback: () => void) {
    if (this._queue.size === 0) this._id = requestAnimationFrame(this._tick)
    this._queue.add(callback)
  }

  static remove(callback: () => void) {
    this._queue.delete(callback)
    this._queue.size === 0 && cancelAnimationFrame(this._id)
  }
}
