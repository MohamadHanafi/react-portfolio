import {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { InputType } from "./type/input.type";
import { PlayIcon, StopIcon, TrashIcon } from "@heroicons/react/solid";
import { useAudioRecorder } from "react-audio-voice-recorder";
import AudioVisualizer from "./AudioVisualizer";
import { MessagesContext } from "../../context/messagesContext";
import { formatTime } from "../../helperes";
import AudioPlayer from "./AudioPlayer";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  inputType?: InputType;
  customClass?: string;
  ref?: React.Ref<HTMLInputElement>;
}
const ChatInput = forwardRef(
  (
    { customClass, inputType, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [permission, setPermission] = useState<boolean>(false);
    const [showPermissionDenied, setShowPermissionDenied] =
      useState<boolean>(false);

    const { audioFile, setAudioFile } = useContext(MessagesContext);

    const {
      startRecording,
      stopRecording,
      recordingBlob,
      isRecording,
      recordingTime,
      mediaRecorder,
    } = useAudioRecorder();

    useEffect(() => {
      if (!recordingBlob) return;
      setAudioFile(new Audio(URL.createObjectURL(recordingBlob)));
    }, [recordingBlob, setAudioFile]);

    const requestPermission = useMemo(() => {
      return async () => {
        try {
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          setPermission(true);
          setShowPermissionDenied(false);
          return true;
        } catch (error) {
          return false;
        }
      };
    }, []);

    const handleStartRecording = useMemo(() => {
      return async () => {
        const start = (permission: boolean) => {
          if (!permission) return setShowPermissionDenied(true);
          setShowPermissionDenied(false);

          // start recording
          startRecording();
        };
        if (!permission) {
          await requestPermission().then(start);
        } else {
          start(true);
        }
      };
    }, [permission, requestPermission, startRecording]);

    const renderVoiceInput = useMemo(() => {
      return () => (
        <div className="audio rounded-full w-full bg-gray-800 p-2 h-8 flex items-center justify-between gap-1">
          <div
            id="voice-controls"
            style={{
              flex: 1,
            }}
          >
            {!isRecording ? (
              <PlayIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => handleStartRecording()}
              />
            ) : (
              <StopIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => stopRecording()}
              />
            )}
          </div>
          {showPermissionDenied && (
            <span
              onClick={() => requestPermission()}
              style={{ fontSize: "12px" }}
              className="text-red-500 cursor-pointer"
            >
              allow record ...
            </span>
          )}
          {mediaRecorder?.stream && (
            <AudioVisualizer
              stream={mediaRecorder.stream}
              recordingTime={recordingTime}
            />
          )}
          <div
            id="time-tag"
            style={mediaRecorder?.stream ? { flex: 1 } : {}}
            className=" flex items-center justify-center"
          >
            <span
              style={{
                fontSize: "10px",
              }}
              className="text-gray-400"
            >
              {formatTime(recordingTime)}
            </span>
          </div>
        </div>
      );
    }, [
      isRecording,
      mediaRecorder?.stream,
      recordingTime,
      showPermissionDenied,
      handleStartRecording,
      stopRecording,
      requestPermission,
    ]);

    if (inputType === "text") {
      return (
        <input
          className={`rounded-full w-full bg-gray-800 placeholder-white placeholder-opacity-75 text-white p-2 h-8 text-xs focus:ring-0 focus:outline-none ${customClass}`}
          type="text"
          placeholder="Type a message ..."
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <>
        {audioFile ? (
          <div className="bg-gray-800 p-2 h-8 rounded-full flex items-center relative pr-4">
            <AudioPlayer audioFile={audioFile} customClass="" />
            <TrashIcon
              className="w-3.5 h-3.5 cursor-pointer text-red-500 absolute top-1/2 transform -translate-y-1/2 right-0.5"
              onClick={() => setAudioFile(null)}
            />
          </div>
        ) : (
          renderVoiceInput()
        )}
      </>
    );
  }
);

export default ChatInput;
