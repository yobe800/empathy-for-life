const getRandomDogCoordinates = () => {
  const x = Math.trunc(Math.random() * 1000);
  const y = Math.trunc(Math.random() * 920);

  return { x, y };
};

export default getRandomDogCoordinates;
