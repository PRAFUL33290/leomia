'use strict';

class InputManager {
  constructor() {
    this.down = new Set();
    this.pressed = new Set();
    this._queue = new Set();
    window.addEventListener('keydown', e => {
      if (!this.down.has(e.code)) this._queue.add(e.code);
      this.down.add(e.code);
      // prevent arrow keys scrolling
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.down.delete(e.code); });
  }
  update() {
    this.pressed = new Set(this._queue);
    this._queue.clear();
  }
  isDown(code) { return this.down.has(code); }
  just(code) { return this.pressed.has(code); }
}
