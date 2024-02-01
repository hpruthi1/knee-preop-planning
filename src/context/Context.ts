import { Dispatch, SetStateAction, createContext } from "react";

export interface IExperienceContextType {
  isLoading: boolean;
  setisLoading: Dispatch<SetStateAction<boolean>>;
  startLandmarkCreation: (pointName: string) => void;
}

export const experienceContext = createContext<IExperienceContextType>(
  {} as IExperienceContextType
);
