'use strict';

import {Chart} from 'chart.js';

function createCanvas(w, h) {
  const canvas = document.createElement('CANVAS');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function createImageData(w, h) {
  const canvas = createCanvas(w, h);
  const context = canvas.getContext('2d');
  return context.getImageData(0, 0, w, h);
}

function readImageData(url, callback) {
  const image = new Image();

  image.onload = function() {
    const h = image.height;
    const w = image.width;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, w, h);
    callback(ctx.getImageData(0, 0, w, h));
  };

  image.src = url;
}

function canvasFromImageData(data) {
  const canvas = createCanvas(data.width, data.height);
  const context = canvas.getContext('2d');
  context.putImageData(data, 0, 0);
  return canvas;
}

function acquireChart(config, options) {
  const wrapper = document.createElement('DIV');
  const canvas = document.createElement('CANVAS');
  let chart, key;

  config = config || {};
  options = options || {};
  options.canvas = options.canvas || {height: 512, width: 512};
  options.wrapper = options.wrapper || {class: 'chartjs-wrapper'};

  function setAttributes(element, attributes) {
    for (key in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
  }

  setAttributes(canvas, options.canvas);
  setAttributes(wrapper, options.wrapper);

  config.options = config.options || {};
  config.options.animation = config.options.animation === undefined ? false : config.options.animation;
  config.options.responsive = config.options.responsive === undefined ? false : config.options.responsive;
  config.options.defaultFontFamily = config.options.defaultFontFamily || 'Arial';

  wrapper.appendChild(canvas);
  window.document.body.appendChild(wrapper);

  try {
    chart = new Chart(canvas.getContext('2d'), config);
  } catch (e) {
    window.document.body.removeChild(wrapper);
    throw e;
  }

  chart.$test = {
    persistent: options.persistent,
    wrapper: wrapper
  };

  return chart;
}

function injectCSS(css) {
  // http://stackoverflow.com/q/3922139
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  if (style.styleSheet) {   // IE
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
}

function releaseChart(chart) {
  chart.destroy();

  const wrapper = (chart.$test || {}).wrapper;
  if (wrapper && wrapper.parentNode) {
    wrapper.parentNode.removeChild(wrapper);
  }
}

function triggerMouseEvent(chart, type, el) {
  const node = chart.canvas;
  const rect = node.getBoundingClientRect();
  const x = el ? el.x !== undefined ? el.x : el._model.x : null;
  const y = el ? el.y !== undefined ? el.y : el._model.y : null;

  const event = new MouseEvent(type, {
    clientX: el ? rect.left + x : undefined,
    clientY: el ? rect.top + y : undefined,
    cancelable: true,
    bubbles: true,
    view: window
  });

  node.dispatchEvent(event);
}

export default {
  injectCSS: injectCSS,
  acquireChart: acquireChart,
  releaseChart: releaseChart,
  createCanvas: createCanvas,
  createImageData: createImageData,
  canvasFromImageData: canvasFromImageData,
  readImageData: readImageData,
  triggerMouseEvent: triggerMouseEvent
};
