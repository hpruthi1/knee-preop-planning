import "./RightContainer.css";
import ControlledSwitches from "./SwitchComponent";
import VarusComponent from "./VarusComponent";
import FlexionComponent from "./FlexionComponent";
import DistalResection from "./DistalResection";

const RightContainer = () => {
  return (
    <div className="rightOverlay">
      <ul>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          <div>
            <VarusComponent />
          </div>
          <div>
            <FlexionComponent />
          </div>
          <div>
            <DistalResection />
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
