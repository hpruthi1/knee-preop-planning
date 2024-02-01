import { Button, ButtonGroup } from "@mui/material";
import { useContext, useState } from "react";
import { experienceContext } from "../../context/Context";

const VarusComponent = () => {
  const [degrees, setdegrees] = useState(0);
  const { updateVarusPlane } = useContext(experienceContext);
  return (
    <>
      <h3>Varus/Valgus</h3>

      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button
          onClick={() => {
            setdegrees(degrees + 1);
            updateVarusPlane(1);
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
            updateVarusPlane(-1);
          }}
        >
          -
        </Button>
      </ButtonGroup>
    </>
  );
};

export default VarusComponent;
