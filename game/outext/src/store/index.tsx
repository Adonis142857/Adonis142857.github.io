import type { User } from "@/types";
import React, { FC, createContext, useContext, useState } from "react";

type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Store {
  isStart: boolean;
  setIsStart: SetStateAction<boolean>;
  select: string;
  setSelect: SetStateAction<string>;
  isFinish: boolean;
  setIsFinish: SetStateAction<boolean>;
  deathCount: number;
  setDeathCount: SetStateAction<number>;
  gameFinishTime: number[];
  setGameFinishTime: SetStateAction<number[]>;
  attributeCount: number;
  setAttributeCount: SetStateAction<number>;
  restart: () => void;
}

interface UserProps {
  user: User;
  setUser: SetStateAction<User>;
}

interface SaveProps {
  saveSelect: string;
  setSaveSelect: SetStateAction<string>;
}

const StoreContext = createContext<Store>({} as Store);

const UserContext = createContext<UserProps>({} as UserProps);

const SaveContext = createContext<SaveProps>({} as SaveProps);

export const useStore = () => useContext(StoreContext);

export const useUser = () => useContext(UserContext);

export const useSave = () => useContext(SaveContext);

export const Store: FC = ({ children }) => {
  const defaultSelect = "game-open";
  const [user, setUser] = useState<User>({
    power: 5,
    speed: 5,
    wise: 5,
    luck: 5,
  });
  const [isStart, setIsStart] = useState(false);
  const [select, setSelect] = useState(defaultSelect);
  const [saveSelect, setSaveSelect] = useState(defaultSelect);
  const [isFinish, setIsFinish] = useState(false);
  const [deathCount, setDeathCount] = useState(0);
  const [attributeCount, setAttributeCount] = useState(0);
  const [gameFinishTime, setGameFinishTime] = useState<number[]>([]);

  const restart = () => {
    setIsStart(false);
    setSelect(defaultSelect);
    setSaveSelect(defaultSelect);
    setIsFinish(false);
    setDeathCount(0);
    setAttributeCount(0);
    setGameFinishTime([]);
  };

  return (
    <StoreContext.Provider
      value={{
        isStart,
        setIsStart,
        select,
        setSelect,
        isFinish,
        setIsFinish,
        deathCount,
        setDeathCount,
        attributeCount,
        setAttributeCount,
        gameFinishTime,
        setGameFinishTime,
        restart,
      }}
    >
      <UserContext.Provider value={{ user, setUser }}>
        <SaveContext.Provider value={{ saveSelect, setSaveSelect }}>
          {children}
        </SaveContext.Provider>
      </UserContext.Provider>
    </StoreContext.Provider>
  );
};

export default Store;
