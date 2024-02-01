import { Dispatch, SetStateAction, createContext } from "react";

export interface IExperienceContextType {
  isLoading: boolean;
  setisLoading: Dispatch<SetStateAction<boolean>>;
  startLandmarkCreation: (pointName: string) => void;
  updateLines: () => void;
  createLines: () => void;
  linesCreated: boolean;
  setlinesCreated: Dispatch<SetStateAction<boolean>>;
}

export const experienceContext = createContext<IExperienceContextType>(
  {} as IExperienceContextType
);
