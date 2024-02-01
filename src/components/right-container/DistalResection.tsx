import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
const DistalResection = () => {
  const [resection, setresection] = useState(0);
  return (
    <>
      <h3>Distal Resection</h3>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button
          onClick={() => {
            setresection(resection + 1);
          }}
        >
          +
        </Button>
        <input
          style={{ textAlign: "center" }}
          type="text"
          value={resection + "mm"}
          disabled
        ></input>
        <Button
          onClick={() => {
            setresection(resection - 1);
          }}
        >
          -
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DistalResection;
