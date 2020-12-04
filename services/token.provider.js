const createCode = (min=1000, max=10000) => {
  return Math.floor(Math.random() * (max - min) + min); 
} 

module.exports = { createCode };