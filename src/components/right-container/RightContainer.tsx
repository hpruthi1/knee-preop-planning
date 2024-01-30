import { Button, ButtonGroup } from "@mui/material";
import "./RightContainer.css";
import ControlledSwitches from "./SwitchComponent";

const RightContainer = () => {
  return (
    <div className="rightOverlay">
      <ul>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          <div>
            <h3>Varus/Valgus</h3>

            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button>+</Button>
              <Button>-</Button>
            </ButtonGroup>
          </div>

          <div>
            <h3>Flexion/Extension</h3>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button>+</Button>
              <Button>-</Button>
            </ButtonGroup>
          </div>

          <div>
            <h3>Distal Resection</h3>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button>+</Button>
              <Button>-</Button>
            </ButtonGroup>
          </div>
        </div>
      </ul>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Resection
        <ControlledSwitches />
      </div>
    </div>
  );
};

export default RightContainer;
