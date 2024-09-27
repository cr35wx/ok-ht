import "../App.css";
import HeatMap from "@uiw/react-heat-map";
import { Tooltip, Button, Popover } from "uiw";
import { reverseDateStr } from "../utils/dateFormatting";
import { GRID_WIDTH, CELL_RADIUS } from "../utils/constants";

export default function Preview() {
  const createDateEntries = (year, month, dayCount, startDay) => {
    return [...Array(dayCount)].map((_, idx) => ({
      date: `${year}/${month}/${startDay + idx}`,
      count: 10,
    }));
  };

  const previewHeatMapValues = [
    { date: "06/24/2022", count: 10 },
    ...createDateEntries(2022, 7, 17, 10),
    ...createDateEntries(2022, 9, 17, 10),
    ...createDateEntries(2022, 12, 27, 1),
    { date: "2023/04/12", count: 10 },
    { date: "2023/05/01", count: 10 },
    { date: "2023/05/02", count: 10 },
    { date: "2023/05/03", count: 10 },
    { date: "2023/05/04", count: 10 },
    { date: "2023/05/08", count: 10 },
    { date: "2023/01/26", count: 10 },
  ];

  const start = new Date("06/24/2022");
  const end = new Date("06/24/2023");

  return (
    <div>
      <Popover
        trigger="click"
        placement="top"
        usePortal={false}
        visibleArrow={false}
        content={
          <HeatMap
            className="preview-heatmap"
            value={previewHeatMapValues}
            width={GRID_WIDTH}
            startDate={start}
            endDate={end}
            legendCellSize={0}
            rectProps={{ rx: CELL_RADIUS }}
            rectRender={(props, data) => (
              <Tooltip placement="top" content={reverseDateStr(data.date)}>
                <rect {...props} />
              </Tooltip>
            )}
          />
        }
      >
        <Button basic icon="map">
          Preview
        </Button>
      </Popover>
    </div>
  );
}
