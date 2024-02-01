import "./Landmark.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import RadioComponent from "./RadioComponent";
import { setSelected } from "../../store/slices/LandmarkSlice";
import { useContext } from "react";
import { experienceContext } from "../../context/Context";

const Landmarks = () => {
  const { startLandmarkCreation, createLines, updateLines, linesCreated } =
    useContext(experienceContext);
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
                disable={landmarks[idx].isPlaced}
                onClick={() => {
                  dispatch(
                    setSelected({
                      name: point.name,
                      isPlaced: false,
                      selected: true,
                    })
                  );

                  startLandmarkCreation(point.name);
                }}
              />
            </div>
          );
        })}
      </ul>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button
          disabled={landmarks.some((l) => !l.isPlaced)}
          onClick={() => {
            linesCreated ? updateLines() : createLines();
          }}
        >
          Update Line
        </button>
      </div>
    </div>
  );
};

export default Landmarks;
