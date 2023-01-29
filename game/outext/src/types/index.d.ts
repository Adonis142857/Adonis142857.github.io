export type TScene = (string | TAction)[];

type TActionLabel = string;
type TActionSuccess = string;
type TActionFail = string;

export type TLimitType = "power" | "speed" | "wise" | "luck";

export type TActionLimit = {
  type: TLimitType;
  minValue: number;
};

export type TActionData = [
  TActionLabel,
  TActionSuccess,
  TActionLimit[]?,
  TActionFail?
];

export type TActionList = TActionData[];

export type TActionType = "finish" | "select" | "end";

export type TAction = {
  action: TActionType;
  data?: TActionList;
  timeout?: number;
};

export type User = {
  [key in TLimitType]: number;
};
