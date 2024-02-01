import { useRef, useState } from "react";
import { experienceContext } from "../../context/Context";
import ViewerFC, { Viewer } from "./Scene/Viewer";
import ExperienceUI from "./ExperienceUI/ExperienceUI";

const Experience = () => {
  const viewerRef = useRef<Viewer>(null);
  const [isLoading, setisLoading] = useState(true);

  const [linesCreated, setlinesCreated] = useState(false);

  const startLandmarkCreation = (pointName: string) => {
    viewerRef.current?.startLandmarkCreation(pointName);
  };

  const updateLines = () => {
    viewerRef.current?.updateLines();
  };

  const createLines = () => {
    viewerRef.current?.createLines();
  };

  const updateVarusPlane = (value: number) => {
    viewerRef.current?.updateVarusPlane(value);
  };

  const updateFlexionPlane = (value: number) => {
    viewerRef.current?.updateFlexionPlane(value);
  };

  return (
    <experienceContext.Provider
      value={{
        isLoading: isLoading,
        setisLoading: setisLoading,
        startLandmarkCreation: startLandmarkCreation,
        updateLines: updateLines,
        createLines: createLines,
        linesCreated: linesCreated,
        setlinesCreated: setlinesCreated,
        updateVarusPlane: updateVarusPlane,
        updateFlexionPlane: updateFlexionPlane,
      }}
    >
      <ViewerFC viewerRef={viewerRef} />
      <ExperienceUI />
    </experienceContext.Provider>
  );
};

export default Experience;
