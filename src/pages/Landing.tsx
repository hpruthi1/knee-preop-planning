import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const onBeginClick = () => {
    navigate("/experience");
  };

  return (
    <div className="landing_page_root">
      {/* <img src="background.jpeg" alt="bg" className="background"></img> */}
      <div className="container">
        <h2 style={{ fontWeight: 600, fontSize: "1.7rem" }}>Welcome to</h2>
        <h1>Knee Preop Planning!</h1>
        <button className="type_1" onClick={onBeginClick}>
          Enter Experience
        </button>
      </div>
    </div>
  );
};

export default Landing;
