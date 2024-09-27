import { useMemo } from "react";
import "../App.css";
import HeatMap from "@uiw/react-heat-map";
import { Row, Col } from "uiw";
import { useDb } from "../DbContext";
import { dateObjToStr } from "../utils/dateFormatting";
import useCurrentDate from "../hooks/useCurrentDate";
import AddHabitModal from "./AddHabitModal";
import DeleteHabitModal from "./DeleteHabitModal";
import Preview from "./Preview";
import HeatMapCell from "./HeatMapCell";
import { GRID_WIDTH, CELL_RADIUS } from "../utils/constants";

export default function HabitTracker() {
  const { heatMapValues } = useDb();

  let currentDate = useCurrentDate();

  const [start, end] = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    start.setDate(start.getDate() - 365);
    return [start, end];
  }, [currentDate]);

  currentDate = dateObjToStr(currentDate);

  return (
    <div>
      <Row>
        <Col> <div>{currentDate}</div> </Col>
        <Col> <AddHabitModal /> </Col>
        <Col> <DeleteHabitModal /> </Col>
        <Col> <Preview /> </Col>
      </Row>
      {Array.from(heatMapValues).map(([key, arr]) => {
        return (
          <div key={key}>
            <h3 className="heatmap-header">{key}</h3>
            <HeatMap
              width={GRID_WIDTH}
              value={arr}
              startDate={start}
              endDate={end}
              legendCellSize={0}
              rectProps={{ rx: CELL_RADIUS }}
              rectRender={(props, data) => (
                <HeatMapCell props={props} data={data} />
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
