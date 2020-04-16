export enum State {
  Succss = 0,
  Fail = 1,
}
export type Result = {
  state: State;
  msg: string;
};
