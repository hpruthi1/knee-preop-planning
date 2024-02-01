import { Button, ButtonGroup } from "@mui/material";
import { useContext, useState } from "react";
import { experienceContext } from "../../context/Context";

const FlexionComponent = () => {
  const [degrees, setdegrees] = useState(0);
  const { updateFlexionPlane } = useContext(experienceContext);
  return (
    <>
      <h3>Flexion/Extension</h3>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button
          onClick={() => {
            setdegrees(degrees + 1);
            updateFlexionPlane(1);
          }}
        >
          +
        </Button>
        <input
          type="number"
          style={{ textAlign: "center" }}
          value={degrees}
          disabled
        ></input>
        <Button
          onClick={() => {
            setdegrees(degrees - 1);
            updateFlexionPlane(-1);
          }}
        >
          -
        </Button>
      </ButtonGroup>
    </>
  );
};

export default FlexionComponent;
