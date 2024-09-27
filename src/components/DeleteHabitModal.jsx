import { useState } from "react";
import "../App.css";
import { Modal, Button, Select } from "uiw";
import { useDb } from "../DbContext";
import { MODAL_WIDTH } from "../utils/constants";

export default function DeleteHabitModal() {
  const { heatMapValues, setHeatMapValues, deleteHeatMapValues } = useDb();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState("");

  const handleClick = () => setModalVisible(!modalVisible);

  const deleteHabit = async () => {
    await deleteHeatMapValues(selectedHabit);

    setHeatMapValues((values) => {
      const newValues = new Map(values);
      newValues.delete(selectedHabit);
      return newValues;
    });
  };

  return (
    <>
      <Button basic icon="delete" type="danger" onClick={handleClick}>
        Delete
      </Button>
      <Modal
        className="modal"
        title="Delete habit"
        isOpen={modalVisible}
        confirmText="Delete"
        cancelText="Cancel"
        icon="information"
        type="dark"
        width={MODAL_WIDTH}
        onConfirm={deleteHabit}
        onClosed={handleClick}
        cancelButtonProps={{ type: "success" }}
        confirmButtonProps={{ type: "danger", icon: "warning-o" }}
      >
        <Select
          value={selectedHabit}
          onChange={(e) => setSelectedHabit(e.target.value)}
        >
          <Select.Option value="">Choose an item...</Select.Option>
          {Array.from(heatMapValues).map(([key, _]) => {
            return (
              <Select.Option key={key} value={key}>
                {key}
              </Select.Option>
            );
          })}
        </Select>
      </Modal>
    </>
  );
}
