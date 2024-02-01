import "./Landmark.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import RadioComponent from "./RadioComponent";
import { toggleComplete } from "../../store/slices/LandmarkSlice";

const Landmarks = () => {
  const landmarks = useAppSelector((state) => state.landmarks);
  const dispatch = useAppDispatch();

  return (
    <div className="landmark_container">
      <ul>
        {landmarks.map((point, idx) => {
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
              <RadioComponent
                onClick={() => {
                  dispatch(
                    toggleComplete({
                      name: point.name,
                      placed: true,
                    })
                  );
                }}
              />
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
