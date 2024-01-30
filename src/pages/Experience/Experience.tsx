import { useRef, useState } from "react";
import { experienceContext } from "../../context/Context";
import ViewerFC from "./Scene/Viewer";

const Experience = () => {
  const viewerRef = useRef<Viewer>(null);
  const [isLoading, setisLoading] = useState(true);

  return (
    <experienceContext.Provider
      value={{
        isLoading: isLoading,
        setisLoading: setisLoading,
      }}
    >
      {/* <ExperienceUI /> */}
      <ViewerFC viewerRef={viewerRef} />
    </experienceContext.Provider>
  );
};

export default Experience;
