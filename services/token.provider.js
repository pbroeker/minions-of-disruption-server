const createCode = (limit=1000) => {
  return randomNumber(limit);
} 

const randomNumber = (limit) => {
  if (typeof limit === 'number') return Math.floor(Math.random() * limit);
}

module.exports = { createCode };