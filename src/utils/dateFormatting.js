export const reverseDateStr = (str) => {
  const [year, month, day] = str.split("/");
  return `${month}/${day}/${year}`;
};

export const dateObjToStr = (date) => {
  return date.toLocaleString().split(",").at(0);
};
