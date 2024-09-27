import { useState } from "react";
import "../App.css";
import { Modal, Button, Input } from "uiw";
import { useDb } from "../DbContext";
import { MODAL_WIDTH } from "../utils/constants";

export default function AddHabitModal() {
  const [habitName, setHabitName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { saveHeatMapValues, setHeatMapValues, createHeatMapValues } = useDb();

  const addHabitHeatMap = () => {
    if (!habitName) return;

    const newValues = createHeatMapValues(habitName);

    saveHeatMapValues(newValues);
    setHeatMapValues((values) => {
      const updatedValues = new Map(values);
      updatedValues.set(habitName, newValues);

      return updatedValues;
    });
  };

  const handleInputChange = (e) => setHabitName(e.target.value);
  const handleButtonClick = () => setModalVisible(!modalVisible);
  const handleModalClose = () => {
    if (modalVisible) handleButtonClick();
  };

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      addHabitHeatMap();
      handleButtonClick();
    }
  };

  return (
    <>
      <Button
        basic
        icon="plus-square-o"
        type="success"
        onClick={handleButtonClick}
      >
        Add Habit
      </Button>
      <Modal
        className="modal"
        title="Add habit"
        isOpen={modalVisible}
        confirmText="Add"
        cancelText="Cancel"
        icon="information"
        type="dark"
        width={MODAL_WIDTH}
        onConfirm={addHabitHeatMap}
        onClosed={handleModalClose}
      >
        <Input
          placeholder="Habit name"
          onChange={handleInputChange}
          onKeyDown={handleInputEnter}
        />
      </Modal>
    </>
  );
}
