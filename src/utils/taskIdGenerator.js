export const generateTaskId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '123456789';
  
  const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
  const getRandomNumber = () => numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${getRandomLetter()}${getRandomLetter()}-${getRandomNumber()}${getRandomNumber()}${getRandomNumber()}${getRandomNumber()}`;
};