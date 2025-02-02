import { useState } from "react";
import "../App.css";
import { Tooltip, Modal, Checkbox, Textarea } from "uiw";
import { useDb } from "../DbContext";
import { reverseDateStr } from "../utils/dateFormatting";
import useCurrentDate from "../hooks/useCurrentDate";
import { MODAL_WIDTH } from "../utils/constants";

export default function HeatMapCell({ props, data }) {
  // some cells on each end are auto generated by the heatmap component
  // with no corresponding entry in indexedDB
  const isDeadCell = !Object.hasOwn(data, "id");

  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(!isDeadCell && data.count !== -1);
  const [notes, setNotes] = useState(data.notes);
  const { updateDayProgress } = useDb();
  const currentDate = useCurrentDate();
  const cellDate = new Date(data.date);
  const isPastDate = cellDate < currentDate;

  const formattedCellDate = reverseDateStr(data.date);
  const habitName = data.id?.split(" -")[0];

  const handleCellClick = () => setModalVisible(!modalVisible);
  const handleCheckboxChange = (e) => setChecked(e.target.checked);
  const handleTextareaChange = (e) => setNotes(e.target.value);
  const handleModalConfirm = () => updateDayProgress(data.id, checked, notes);

  const showModal = !isDeadCell && cellDate <= currentDate;

  if (isDeadCell) props.opacity = 0.7; // .

  return (
    <>
      <Tooltip content={formattedCellDate}>
        <rect {...props} onClick={handleCellClick} />
      </Tooltip>
      {showModal && (
        <Modal
          className="modal"
          title={`${formattedCellDate} - ${habitName}`}
          isOpen={modalVisible}
          confirmText="Save"
          cancelText="Cancel"
          icon="information"
          type="dark"
          width={MODAL_WIDTH}
          onConfirm={handleModalConfirm}
          onClosed={handleCellClick}
        >
          <form className="form-container">
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              disabled={isPastDate}
            >
              Complete?
            </Checkbox>
            <div className="form-textarea">
              <Textarea
                placeholder="Notes"
                value={notes}
                onChange={handleTextareaChange}
                disabled={isPastDate}
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
