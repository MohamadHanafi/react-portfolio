import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime } from "../../helperes";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  audioFile: HTMLAudioElement;
  customClass?: string;
}
const AudioPlayer = ({ audioFile, customClass = "", ...props }: Props) => {
  const audioSliderRef = useRef<HTMLInputElement>(null);
  const fileDurationRef = useRef<HTMLSpanElement>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [isFilePlaying, setIsFilePlaying] = useState(false);

  const handleOnPlay = useMemo(
    () => () => {
      if (!audioFile) return;
      audioFile.play();
      setIsFilePlaying(true);
    },
    [audioFile]
  );

  const handleOnPause = useMemo(
    () => () => {
      if (!audioFile) return;
      audioFile.pause();
      setIsFilePlaying(false);
    },
    [audioFile]
  );

  const renderControls = () => {
    if (!isFilePlaying) {
      return (
        <PlayIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => handleOnPlay()}
        />
      );
    }
    if (isFilePlaying) {
      return (
        <PauseIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => handleOnPause()}
        />
      );
    }
  };

  useEffect(() => {
    if (!audioFile || !audioSliderRef.current) return;

    audioFile.onloadedmetadata = () => {
      fileDurationRef.current!.innerText = formatTime(
        Math.floor(audioFile.duration)
      );
      // set the max value of the slider
      audioSliderRef.current!.max = String(Math.floor(audioFile.duration));
    };

    audioFile.ontimeupdate = () => {
      // set the input range thumb
      setSliderValue(audioFile.currentTime);
    };

    audioFile.onended = () => {
      setIsFilePlaying(false);
    };

    audioFile.onpause = () => {
      setIsFilePlaying(false);
    };
  }, [audioFile, audioSliderRef]);

  return (
    <div
      id="audio-player-container"
      className={
        "audio rounded-full w-full flex items-center justify-between gap-1 " +
        customClass
      }
    >
      <div id="voice-controls">{audioFile && renderControls()}</div>

      <input
        ref={audioSliderRef}
        id="seek-slider"
        type="range"
        value={sliderValue}
        onChange={(e) => {
          const value = Number(e.target.value);
          setSliderValue(value);
          audioFile!.currentTime = value;
        }}
      />

      <div
        id="time-tags"
        style={{
          fontSize: "10px",
        }}
      >
        <span id="current-time">{formatTime(0)}</span>/
        <span id="duration" ref={fileDurationRef}>
          {formatTime(0)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
