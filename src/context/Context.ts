import { Dispatch, SetStateAction, createContext } from "react";

export interface IExperienceContextType {
  isLoading: boolean;
  setisLoading: Dispatch<SetStateAction<boolean>>;
}

export const experienceContext = createContext<IExperienceContextType>(
  {} as IExperienceContextType
);
