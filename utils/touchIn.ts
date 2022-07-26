import { Touch } from 'react';

function touchIn(touch: Touch, rect: DOMRect) {
  return touch.clientY > rect.top && touch.clientY < rect.top + rect.height &&
    touch.clientX > rect.x && touch.clientX < rect.x + rect.width;
}

export default touchIn;
