import "./Landmark.css";
import { pointsListData } from "./Points";
import Radio from "./Radio";

const Landmarks = () => {
  return (
    <div className="landmark_container">
      <ul>
        {pointsListData.map((point, idx) => {
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1em",
              }}
            >
              <li>{point.name}</li>
              <Radio />
            </div>
          );
        })}
      </ul>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button onClick={() => {}}>Update Line</button>
      </div>
    </div>
  );
};

export default Landmarks;
