const createCode = (min = 1000, max = 10000): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export { createCode };
