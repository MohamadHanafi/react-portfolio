import {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import IconButton from "../shared/IconButton";
import ChatInput from "./ChatInput";
import {
  MicrophoneIcon,
  PhoneIcon,
  ChatIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/solid";
import { MessagesContext } from "../../context/messagesContext";
import { MessageInterface } from "../../interface";
import { InputType } from "./type/input.type";
import { v4 as uuid } from "uuid";

const ChatInputInterface = forwardRef(
  (_props, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      typedMessage,
      setTypedMessage,
      setMessages,
      audioFile,
      setAudioFile,
      sendMessage,
    } = useContext(MessagesContext);
    const [inputType, setInputType] = useState<InputType>("text");

    const handleSubmit = useMemo(() => {
      return async (e?: React.FormEvent<HTMLFormElement>) => {
        e && e.preventDefault();
        if (inputType === "text" && !typedMessage) return;
        if (inputType === "voice" && !audioFile) return;
        // 1. get the messages from the context
        // 2. add the new message to the messages
        const _id = uuid();
        const newMessage: MessageInterface = {
          _id,
          message: inputType === "text" ? typedMessage : audioFile!.src,
          sender: "user",
          state: "pending",
          type: inputType === "text" ? "text" : "audio",
          userId: localStorage.getItem("id")!,
        };
        // 3. set the messages in the context
        setMessages((prev: MessageInterface[]) => [...prev, newMessage]);

        // 4. send the message to the server
        const res = await sendMessage(newMessage);
        if (res) {
          setMessages((prev: MessageInterface[]) =>
            prev.map((message) => {
              if (message._id === _id) {
                return {
                  ...message,
                  state: "received",
                };
              }
              return message;
            })
          );
        } else {
          setMessages((prev: MessageInterface[]) =>
            prev.map((message) => {
              if (message._id === _id) {
                return {
                  ...message,
                  state: "failed",
                };
              }
              return message;
            })
          );
        }
        // 5. clear the input
        // @ts-expect-error
        if (ref && ref.current) {
          // @ts-expect-error
          ref.current.value = "";
        }
        setTypedMessage("");
        setAudioFile(null);
      };
    }, [
      typedMessage,
      audioFile,
      inputType,
      ref,
      setAudioFile,
      setMessages,
      setTypedMessage,
    ]);

    useEffect(() => {
      if (inputType === "text") {
        // @ts-expect-error
        ref.current?.focus();
      }
    }, [inputType, ref]);

    return (
      <form
        className="flex justify-between gap-1 w-full"
        onSubmit={handleSubmit}
      >
        <ChatInput
          ref={ref}
          defaultValue={typedMessage}
          onChange={(e) => setTypedMessage(e.currentTarget.value)}
          inputType={inputType}
        />
        <IconButton
          onClick={() => {
            setInputType((prev) => (prev === "text" ? "voice" : "text"));
          }}
          icon={
            inputType === "text" ? (
              <MicrophoneIcon className="w-4 h-4" />
            ) : (
              <ChatIcon className="w-4 h-4" />
            )
          }
        />
        <IconButton
          hidden={inputType === "voice" || !!typedMessage}
          onClick={() => {}}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
        <IconButton
          hidden={
            (inputType === "text" && !typedMessage) ||
            (inputType === "voice" && !audioFile)
          }
          onClick={() => handleSubmit()}
          rotate="90deg"
          icon={<PaperAirplaneIcon className="w-4 h-4" />}
        />
      </form>
    );
  }
);

export default ChatInputInterface;
