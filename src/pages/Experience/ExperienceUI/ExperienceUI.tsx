import Heading from "../../../components/heading/Heading";
import Landmarks from "../../../components/landmarks/Landmarks";
import RightContainer from "../../../components/right-container/RightContainer";
import "./ExperienceUI.css";

const ExperienceUI = () => {
  return (
    <div className="experience_ui_root">
      <Landmarks />
      <Heading />
      <RightContainer />
    </div>
  );
};

export default ExperienceUI;
