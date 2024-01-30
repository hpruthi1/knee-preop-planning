import { useState } from "react";

const Radio = () => {
  const [checked, setChecked] = useState(false);

  const handleInputChange = () => {
    setChecked(!checked);
  };
  return (
    <input
      type="radio"
      onClick={() => {
        handleInputChange();
      }}
      checked={checked}
    ></input>
  );
};

export default Radio;
