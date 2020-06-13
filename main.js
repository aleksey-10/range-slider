'use strict';

const form = document.getElementById('form-range-slider');
const slider = document.getElementById('range-slider-input');
const field = slider.querySelector('.slider__field');

const buttons = {
  min: slider.querySelector('.slider__button--min'),
  max: slider.querySelector('.slider__button--max'),
}

const sliderCoordinates = slider.getBoundingClientRect();

const coordinates = {
  width: slider.clientWidth,
  get differential() {
    return this.width / 100;
  },
  min: 0,
  max: slider.clientWidth,
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

  const x = e.clientX - sliderCoordinates.x;
  const centerBetween = coordinates.min +
    (coordinates.max - coordinates.min) / 2;

  const type = x < centerBetween ? 'min' : 'max'; 

  form[type].value = Math.round(x / coordinates.differential);

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

  function onMouseMove(e) {
    const x = event.clientX - sliderCoordinates.x;
  
    form[type].value = Math.round(x / coordinates.differential);
  
    setPosition(type);
  }
});

function setPosition(type) {
  const position = form[type].value * coordinates.differential;

  if (!checkCoordinates(type, position)) {
    return setPosition(type);
  }

  if (type === 'min') {
    field.style.left = position + 'px';
  } else {
    field.style.right = coordinates.width - position + 'px';
  }

  buttons[type].style.left = position + 'px';
  coordinates[type] = position;
}

function checkCoordinates(type, position) {
  if (position < 0) {
    form[type].value = 0;
  } else if (position > coordinates.width) {
    form[type].value = 100;
  } else if (type === 'min' && position > coordinates.max) {
    form[type].value = coordinates.max / coordinates.differential;
  } else if (type === 'max' && position < coordinates.min) {
    form[type].value = coordinates.min / coordinates.differential;
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
