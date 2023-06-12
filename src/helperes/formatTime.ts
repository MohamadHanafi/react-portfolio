export const formatTime = (time: number) => {
  let minutes: number | string = Math.floor(time / 60);
  let seconds: number | string = time - minutes * 60;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  // minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${minutes}:${seconds}`;
};
