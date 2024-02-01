import { useState } from "react";

type RadioProps = {
  onClick: React.MouseEventHandler<HTMLInputElement>;
};

const RadioComponent = (props: RadioProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <input
      type="radio"
      onClick={(e) => {
        setChecked(!checked);
        props.onClick(e);
      }}
      defaultChecked={checked}
    ></input>
  );
};

export default RadioComponent;
