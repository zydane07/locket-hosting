export const generateID = () => {
  const unix = Math.floor(Date.now() / 1000);
  const random = Math.floor(Math.random() * 100);
  const ID = unix + random;
  return ID;
};

export const expiredDate = (numOfMinutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + numOfMinutes);
  return date;
};

export const isTokenExpired = (date: Date) => {
  if (new Date() > date) {
    return true;
  }
  return false;
};
