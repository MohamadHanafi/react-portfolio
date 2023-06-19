import { Fragment, useEffect, useRef, useState } from "react";
import { MessageInterface } from "../../interface";
import moment from "moment";
import DateTag from "./DateTag";
import Message from "./Message";

interface Props {
  messages: MessageInterface[];
}

const ChatInterface = ({ messages }: Props) => {
  const [messagesByDate, setMessagesByDate] = useState<
    Record<string, MessageInterface[]>
  >({});

  const chatRef = useRef<HTMLDivElement>(null);

  // divide the messages into arrays according to the createdAt date
  useEffect(() => {
    const messagesByDate = messages?.reduce(
      (acc: Record<string, MessageInterface[]>, message: MessageInterface) => {
        const date = moment(message.createdAt).format("DD/MM/YYYY");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(message);
        return acc;
      },
      {}
    );
    setMessagesByDate(messagesByDate);

    // scroll to the bottom of the chat
    setImmediate(() =>
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      })
    );
  }, [messages]);
  return (
    <div
      ref={chatRef}
      style={{
        maxHeight: "90%",
        overflowY: "auto",
        marginBottom: "0.5rem",
        overflowX: "hidden",
        // hide the scroll bar
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="h-full flex flex-col gap-1.5 w-full"
    >
      {messagesByDate &&
        Object.keys(messagesByDate).map((date) => {
          return (
            <Fragment key={date}>
              <DateTag date={date} />
              {messagesByDate[date].map((message, idx) => {
                const trianglePosition =
                  message.sender === "admin" ? "left" : "right";
                const prevMessage = messagesByDate[date][idx - 1];
                return (
                  <Message
                    key={idx}
                    message={message}
                    showTriangle={!(prevMessage?.sender === message.sender)}
                    trianglePosition={trianglePosition}
                  />
                );
              })}
            </Fragment>
          );
        })}
    </div>
  );
};

export default ChatInterface;
