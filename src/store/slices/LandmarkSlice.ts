import { createSlice } from "@reduxjs/toolkit";

export interface ILandmark {
  name: string;
  selected?: boolean;
  isPlaced: boolean;
}

const initialState: ILandmark[] = [
  {
    name: "Femur Center",
    isPlaced: false,
    selected: false,
  },
  {
    name: "Hip Center",
    isPlaced: false,
    selected: false,
  },
  { name: "Femur Proximal Canal", isPlaced: false, selected: false },
  { name: "Femur Distal Canal", isPlaced: false, selected: false },
  {
    name: "Medial Epicondyle",
    isPlaced: false,
    selected: false,
  },
  {
    name: "Lateral Epicondyle",
    isPlaced: false,
    selected: false,
  },
  { name: "Distal Medial Pt", isPlaced: false, selected: false },
  { name: "Distal Lateral Pt", isPlaced: false, selected: false },
  {
    name: "Posterior Medial Pt",
    isPlaced: false,
    selected: false,
  },
  {
    name: "Posterior Lateral Pt",
    isPlaced: false,
    selected: false,
  },
];

const landmarkSlice = createSlice({
  name: "Landmark",
  initialState,
  reducers: {
    toggleComplete: (state, { payload }: { payload: ILandmark }) => {
      const landmark = state.find((point) => point.name === payload.name);
      if (landmark) landmark.isPlaced = payload.isPlaced;
    },
    setSelected: (state, { payload }: { payload: ILandmark }) => {
      const landmark = state.find((point) => point.name === payload.name);
      if (landmark) landmark.selected = payload.selected;
    },
  },
});

export const { toggleComplete, setSelected } = landmarkSlice.actions;
export default landmarkSlice.reducer;
