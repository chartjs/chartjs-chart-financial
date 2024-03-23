import {BarElement} from 'chart.js';

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param {Rectangle} bar the bar
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the bar
 * @private
 */
function getBarBounds(bar, useFinalPosition) {
  const {x, y, base, width, height} = bar.getProps(['x', 'low', 'high', 'width', 'height'], useFinalPosition);

  let left, right, top, bottom, half;

  if (bar.horizontal) {
    half = height / 2;
    left = Math.min(x, base);
    right = Math.max(x, base);
    top = y - half;
    bottom = y + half;
  } else {
    half = width / 2;
    left = x - half;
    right = x + half;
    top = Math.min(y, base); // use min because 0 pixel at top of screen
    bottom = Math.max(y, base);
  }

  return {left, top, right, bottom};
}

function inRange(bar, x, y, useFinalPosition) {
  const skipX = x === null;
  const skipY = y === null;
  const bounds = !bar || (skipX && skipY) ? false : getBarBounds(bar, useFinalPosition);

  return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

export class FinancialElement extends BarElement {

  static defaults = {
    backgroundColors: {
      up: 'rgba(75, 192, 192, 0.5)',
      down: 'rgba(255, 99, 132, 0.5)',
      unchanged: 'rgba(201, 203, 207, 0.5)',
    },
    borderColors: {
      up: 'rgb(75, 192, 192)',
      down: 'rgb(255, 99, 132)',
      unchanged: 'rgb(201, 203, 207)',
    }
  };

  height() {
    return this.base - this.y;
  }

  inRange(mouseX, mouseY, useFinalPosition) {
    return inRange(this, mouseX, mouseY, useFinalPosition);
  }

  inXRange(mouseX, useFinalPosition) {
    return inRange(this, mouseX, null, useFinalPosition);
  }

  inYRange(mouseY, useFinalPosition) {
    return inRange(this, null, mouseY, useFinalPosition);
  }

  getRange(axis) {
    return axis === 'x' ? this.width / 2 : this.height / 2;
  }

  getCenterPoint(useFinalPosition) {
    const {x, low, high} = this.getProps(['x', 'low', 'high'], useFinalPosition);
    return {
      x,
      y: (high + low) / 2
    };
  }

  tooltipPosition(useFinalPosition) {
    const {x, open, close} = this.getProps(['x', 'open', 'close'], useFinalPosition);
    return {
      x,
      y: (open + close) / 2
    };
  }
}
