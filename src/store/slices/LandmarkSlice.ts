import { createSlice } from "@reduxjs/toolkit";

interface ILandmark {
  name: string | undefined;
  isPlaced: boolean | undefined;
}

const initialState: ILandmark[] = [
  {
    name: "Femur Center",
    isPlaced: false,
  },
  {
    name: "Hip Center",
    isPlaced: false,
  },
  { name: "Femur Proximal Canal", isPlaced: false },
  { name: "Femur Distal Canal", isPlaced: false },
  {
    name: "Medical Epicondyle",
    isPlaced: false,
  },
  {
    name: "Lateral Epicondyle",
    isPlaced: false,
  },
  { name: "Distal Medical Pt", isPlaced: false },
  { name: "Distal Lateral Pt", isPlaced: false },
  {
    name: "Posterior Medical Pt",
    isPlaced: false,
  },
  {
    name: "Posterior Lateral Pt",
    isPlaced: false,
  },
];

const landmarkSlice = createSlice({
  name: "Landmark",
  initialState,
  reducers: {
    toggleComplete: (state, action) => {
      const landmark = state.find(
        (point) => (point.name = action.payload.name)
      );
      if (landmark) landmark.isPlaced = !landmark.isPlaced;
    },
  },
});

export const { toggleComplete } = landmarkSlice.actions;
export default landmarkSlice.reducer;
