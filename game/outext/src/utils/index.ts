export const getRandomNumber = (min = 0, max = 10): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * 单位：分钟
 */
export const formatTime = (start: number, end: number) => {
  const time = end - start;

  return (time / 1000 / 60).toFixed(1);
};

export const getRandomName = () => {
  const nameList = ["王大铁", "李家毛", "刘石板", "王二狗"];
  const randomNumber = getRandomNumber(0, 3);

  return nameList[randomNumber];
};
