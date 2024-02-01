import { useRef, useState } from "react";
import { experienceContext } from "../../context/Context";
import ViewerFC, { Viewer } from "./Scene/Viewer";
import ExperienceUI from "./ExperienceUI/ExperienceUI";

const Experience = () => {
  const viewerRef = useRef<Viewer>(null);
  const [isLoading, setisLoading] = useState(true);

  const startLandmarkCreation = (pointName: string) => {
    viewerRef.current?.startLandmarkCreation(pointName);
  };

  const updateLines = () => {
    viewerRef.current?.updateLines();
  };

  return (
    <experienceContext.Provider
      value={{
        isLoading: isLoading,
        setisLoading: setisLoading,
        startLandmarkCreation: startLandmarkCreation,
        updateLines: updateLines,
      }}
    >
      <ViewerFC viewerRef={viewerRef} />
      <ExperienceUI />
    </experienceContext.Provider>
  );
};

export default Experience;
