import React from "react";
import { useStore, useUser } from "@/store";
import { TextLoader } from "@/components/TextLoader";
import { Button } from "@/components/Button";
import { getRandomNumber, formatTime } from "./utils";
import type { TLimitType } from "./types";

export default function Outext() {
  const { isStart, isFinish } = useStore();
  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-800 text-white select-none">
      <div className="container mx-auto h-full">
        {isStart && isFinish && <GameFinish />}
        {isStart && !isFinish && <TextLoader />}
        {!isStart && <GameMenu />}
      </div>
    </div>
  );
}

const GameMenu = () => {
  const VERSION = "2.0.5";
  const [isUserSet, setIsUserSet] = React.useState(false);

  const handleGameStart = () => {
    setIsUserSet(true);
  };

  return (
    <>
      {isUserSet ? (
        <GameStart />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1
            className="text-7xl mb-10 font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
            style={{
              transform: "rotate3d(10, 1, 1, -23deg)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Outext
          </h1>
          <a
            target="_blank"
            className="text-xs text-center my-2"
            href="https://Adonis142857.github.io"
          >
            这是<br />
            属于我的故事<br />
          </a>
          <h3 className="text-xs my-2">版本：v1.0</h3>
          <Button className="my-3" onClick={handleGameStart}>
            开始游戏
          </Button>
        </div>
      )}
    </>
  );
};

const GameStart = () => {
  const { setIsStart, setGameFinishTime, setAttributeCount, attributeCount } =
    useStore();
  const { user, setUser } = useUser();
  const [msg, setMsg] = React.useState("");
  const maxValue = 1000;
  const userKeys = Object.keys(user) as TLimitType[];
  const typeMap: { [key in TLimitType]: string } = {
    power: "力量",
    speed: "技巧",
    wise: "智慧",
    luck: "幸运",
  };

  React.useEffect(() => {
    initUser();
  }, []);

  const handleEnterGame = () => {
    setGameFinishTime([Date.now()]);
    setIsStart(true);
  };

  const onRandomUserAttributes = () => {
    const userAttributes = { ...user };

    for (const key of userKeys) {
      userAttributes[key] = getRandomNumber();
    }

    return userAttributes;
  };

  const initUser = () => {
    setUser(onRandomUserAttributes());
  };

  // 玩家自己随机属性
  const handleRandom = () => {
    const count = attributeCount + 1;
    initUser();
    setAttributeCount(count);
    if (count >= 30 && count < 50) {
      setMsg(`你已经随机了${count}次了，休息一下吧`);
    } else if (count >= 50 && count < 100) {
      setMsg(`你已经刷了${count}次了，真刷不到想要的就放弃吧`);
    } else if (count >= 100) {
      setMsg(`你已经刷了${count}次了，其实，属性根本毫无用处！`);
    }
  };

  return (
    <div className="flex flex-col mx-auto text-center h-full justify-center items-center pt-5">
      {msg && <p>{msg}</p>}
      {userKeys.map((key) => (
        <p key={key}>
          <span>{typeMap[key]}：</span>
          <span>
            {user[key]} / {maxValue}
          </span>
        </p>
      ))}

      <Button className="mt-20" onClick={handleRandom}>
        随机属性
      </Button>
      <Button className="mt-4" onClick={handleEnterGame}>
        开始冒险
      </Button>
    </div>
  );
};

const GameFinish = () => {
  const { gameFinishTime, deathCount, restart, attributeCount } = useStore();
  const [startTime, finishTime] = gameFinishTime;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-2">恭喜你通关了</h1>
      <p className="my-1">你总共死了 {deathCount} 次</p>
      <p className="my-1">你随机了 {attributeCount} 次属性才找到你满意的</p>
      <p>通关时间 {formatTime(startTime, finishTime)} 分钟</p>

      <Button className="my-2" onClick={() => restart()}>
        重新游玩
      </Button>
    </div>
  );
};
