
export const easeInSine = (x: number): number => 1 - Math.cos((x * Math.PI) / 2);
export const easeOutSine = (x: number): number => Math.sin((x * Math.PI) / 2);
export const easeInOutSine = (x: number): number => -(Math.cos(Math.PI * x) - 1) / 2;
export const easeInQuad = (x: number): number => x * x;
export const easeOutQuad = (x: number): number => 1 - (1 - x) * (1 - x);
export const easeInOutQuad = (x: number): number => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
export const easeInCubic = (x: number): number => x * x * x;
export const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
export const easeInOutCubic = (x: number): number => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const easeInQuart = (x: number): number => x * x * x * x;
export const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
export const easeInOutQuart = (x: number): number => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
export const easeInQuint = (x: number): number => x * x * x * x * x;
export const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);
export const easeInOutQuint = (x: number): number => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
export const easeInExpo = (x: number): number => x === 0 ? 0 : Math.pow(2, 10 * x - 10);
export const easeOutExpo = (x: number): number => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
export const easeInOutExpo = (x: number): number => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
export const easeInCirc = (x: number): number => 1 - Math.sqrt(1 - Math.pow(x, 2));
export const easeOutCirc = (x: number): number => Math.sqrt(1 - Math.pow(x - 1, 2));
export const easeInBounce = (x: number): number => 1 - easeOutBounce(1 - x);
export const easeInElastic = (x: number): number => x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * (2 * Math.PI) / 3);
export const easeOutElastic = (x: number): number => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1;


export const easeInOutCirc = (x: number): number => x < 0.5
  ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
  : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;

export const easeInBack = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return c3 * x * x * x - c1 * x * x;
}

export const easeOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export const easeInOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

export const easeInOutElastic = (x: number): number => {
  const c5 = (2 * Math.PI) / 4.5;
  return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

export const easeOutBounce = (x: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

export const easeInOutBounce = (x: number): number => {
  return x < 0.5
    ? (1 - easeOutBounce(1 - 2 * x)) / 2
    : (1 + easeOutBounce(2 * x - 1)) / 2;
}

export const easing = {
  'in-sine': easeInSine,
  'out-sine': easeOutSine,
  'in-out-sine': easeInOutSine,
  'in-quad': easeInQuad,
  'out-quad': easeOutQuad,
  'in-out-quad': easeInOutQuad,
  'in-cubic': easeInCubic,
  'out-cubic': easeOutCubic,
  'in-out-cubic': easeInOutCubic,
  'in-quart': easeInQuart,
  'out-quart': easeOutQuart,
  'in-out-quart': easeInOutQuart,
  'in-quint': easeInQuint,
  'out-quint': easeOutQuint,
  'in-out-quint': easeInOutQuint,
  'in-expo': easeInExpo,
  'out-expo': easeOutExpo,
  'in-out-expo': easeInOutExpo,
  'in-circ': easeInCirc,
  'out-circ': easeOutCirc,
  'in-out-circ': easeInOutCirc,
  'in-back': easeInBack,
  'out-back': easeOutBack,
  'in-out-back': easeInOutBack,
  'in-elastic': easeInElastic,
  'out-elastic': easeOutElastic,
  'in-out-elastic': easeInOutElastic,
  'in-bounce': easeInBounce,
  'out-bounce': easeOutBounce,
  'in-out-bounce': easeInOutBounce,
}