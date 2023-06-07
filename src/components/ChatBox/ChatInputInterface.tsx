import { ForwardedRef, forwardRef, useContext, useMemo } from "react";
import IconButton from "../shared/IconButton";
import ChatInput from "./ChatInput";
import { MicrophoneIcon, PhoneIcon } from "@heroicons/react/solid";
import { MessagesContext } from "../../context/messagesContext";
import { MessageInterface } from "./interface";

interface Props {}

const ChatInputInterface = forwardRef(
  ({}: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const { typedMessage, setTypedMessage, messages, setMessages } =
      useContext(MessagesContext);

    const handleSubmit = useMemo(() => {
      return (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!typedMessage) return;
        // 1. get the messages from the context
        // 2. add the new message to the messages
        const newMessage: MessageInterface = {
          id: messages.length + 1,
          createdAt: new Date(),
          message: typedMessage,
          sender: "user",
          state: "received",
        };
        // 3. set the messages in the context
        setMessages((prev: MessageInterface[]) => [...prev, newMessage]);
        // 4. clear the input
        // @ts-expect-error
        ref.current.value = "";
        setTypedMessage("");
      };
    }, [typedMessage]);

    return (
      <form
        className="flex items-center justify-center w-full gap-1"
        onSubmit={handleSubmit}
      >
        <ChatInput
          customClass="w-3/4"
          ref={ref}
          defaultValue={typedMessage}
          onChange={(e) => setTypedMessage(e.currentTarget.value)}
        />
        <IconButton
          onClick={() => {
            // TODO: implement voice recording
          }}
          icon={<MicrophoneIcon className="w-4 h-4" />}
        />
        <IconButton
          onClick={() => {}}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
      </form>
    );
  }
);

export default ChatInputInterface;
