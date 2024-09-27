import { useState, useEffect } from "react";

const ONE_HOUR = 3600000;

export default function useCurrentDate() {
  const createDate = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const [currentDate, setCurrentDate] = useState(createDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(createDate());
    }, ONE_HOUR);

    return () => clearInterval(interval);
  }, []);

  return currentDate;
}
