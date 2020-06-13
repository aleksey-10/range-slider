'use strict';

const form = document.getElementById('form-range-slider');
const slider = document.getElementById('range-slider-input');
const field = slider.querySelector('.slider__field');

const buttons = {
  min: slider.querySelector('.slider__button--min'),
  max: slider.querySelector('.slider__button--max'),
}

const coordinates = {
  get width() {
    return slider.clientWidth;
  },
  get differential() {
    return this.width / 100;
  },
  min: form.min.value,
  max:  form.max.value,
};

document.addEventListener('DOMContentLoaded', () => {
  setPosition('min');
  setPosition('max');
});

form.addEventListener('submit', e => e.preventDefault());

form.addEventListener('change', function(e) {
  if (!e.target.classList.contains('form__input')) {
    return;
  }

  const type = getType(e.target);

  setPosition(type);
});

slider.addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON') {
    return;
  }

  const clickPosition = calcPosition(e.clientX);

  const centerBetween = coordinates.min +
    (coordinates.max - coordinates.min) / 2;

  const type = clickPosition < centerBetween ? 'min' : 'max'; 

  form[type].value = Math.round(clickPosition);

  setPosition(type);
});

slider.addEventListener('mousedown', function(e) {
  if (!e.target.classList.contains('slider__button')) {
    return;
  }

  const type = getType(e.target);

  document.addEventListener('mousemove', onMouseMove);

  document.addEventListener('mouseup', function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  })

  function onMouseMove(event) {
    const movementPosition = calcPosition(event.clientX);
  
    form[type].value = Math.round(movementPosition);
  
    setPosition(type);
  }
});

function setPosition(type) {
  const position = Number(form[type].value);

  if (!checkCoordinates(type, position)) {
    return setPosition(type);
  }

  const x = position * coordinates.differential;

  if (type === 'min') {
    field.style.left = x + 'px';
  } else {
    field.style.right = coordinates.width - x + 'px';
  }

  buttons[type].style.left = x + 'px';
  coordinates[type] = position;
}

function checkCoordinates(type, position) {
  if (position < 0) {
    form[type].value = 0;
  } else if (position > 100) {
    form[type].value = 100;
  } else if (type === 'min' && position > coordinates.max) {
    form[type].value = coordinates.max;
  } else if (type === 'max' && position < coordinates.min) {
    form[type].value = coordinates.min;
  } else {
    return true;
  }

  return false;
}

function getType(element) {
  const pattern = /\b\w+\-\-(min|max)\b/g;
  const type = element.classList.value.match(pattern)[0].split('--')[1];

  return type; 
}

function calcPosition(x) {
  return (x - slider
    .getBoundingClientRect().x) / coordinates.differential;
}