import { createContext, useContext, useState, useEffect } from "react";
import localforage from "localforage";

const DbContext = createContext();

export function DbProvider({ children }) {
  const [heatMapValues, setHeatMapValues] = useState(new Map());

  useEffect(() => {
    const load = async () => {
      const values = await loadHeatMapValues();
      setHeatMapValues(values);
    };

    load();
  }, []);

  const updateDayProgress = async (id, checkboxValue, notes) => {
    const habitDay = await localforage.getItem(id);

    // this arbitrary 10 value changes the day's cell to green
    habitDay.count = checkboxValue ? 10 : -1;
    habitDay.notes = notes;

    await localforage.setItem(habitDay.id, habitDay);

    setHeatMapValues((values) => {
      const habitName = habitDay.id.split(" -")[0];
      const newValues = new Map(values);

      const newHabitArr = newValues
        .get(habitName)
        .map((value) => (value.id === habitDay.id ? habitDay : value));
      newValues.set(habitName, newHabitArr);

      return newValues;
    });
  };

  const createHeatMapValues = (habitName) => {
    const dateSpan = new Date();

    const values = Array.from({ length: 365 }, (_, idx) => {
      if (idx !== 0) {
        dateSpan.setDate(dateSpan.getDate() + 1);
      }

      const dateStr = dateSpan.toLocaleString().split(",")[0];
      const key = `${habitName} - ${dateStr}`;

      return {
        id: key,
        date: dateStr,
        count: -1,
        notes: "",
      };
    });

    return values;
  };

  const saveHeatMapValues = (values) => {
    values.map((val) => localforage.setItem(val.id, val));
  };

  const loadHeatMapValues = async () => {
    const data = new Map();

    await localforage.iterate((val, key, _idx) => {
      const habitName = key.split(" -")[0];
      if (data.has(habitName)) {
        data.get(habitName).push(val);
      } else {
        data.set(habitName, [val]);
      }
    });

    const sortByDate = (array) =>
      array.sort((a, b) => new Date(a.date) - new Date(b.date));

    data.forEach((val, _key) => sortByDate(val));

    return data;
  };

  const deleteHeatMapValues = async (selectedHabit) => {
    if (selectedHabit === "") return;

    await localforage.iterate((_, key) => {
      const habitName = key.split(" -")[0];
      if (habitName === selectedHabit) localforage.removeItem(key);
    });
  };

  return (
    <DbContext.Provider
      value={{
        heatMapValues,
        setHeatMapValues,
        createHeatMapValues,
        saveHeatMapValues,
        deleteHeatMapValues,
        updateDayProgress,
      }}
    >
      {children}
    </DbContext.Provider>
  );
}

export const useDb = () => useContext(DbContext);
