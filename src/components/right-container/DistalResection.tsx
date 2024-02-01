import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
const DistalResection = () => {
  const [resection, setresection] = useState(0);
  return (
    <>
      <h3>Distal Resection</h3>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button>+</Button>
        <input
          style={{ textAlign: "center" }}
          type="text"
          value={resection + "mm"}
          disabled
        ></input>
        <Button>-</Button>
      </ButtonGroup>
    </>
  );
};

export default DistalResection;
