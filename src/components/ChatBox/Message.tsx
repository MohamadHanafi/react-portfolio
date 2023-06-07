import { useEffect, useState } from "react";
import { MessageInterface } from "./interface";
import moment from "moment";

interface Props {
  message: MessageInterface;
  showTriangle?: boolean;
  trianglePosition?: "left" | "right";
}

/**
 * will render the message component
 * if the message is sent by the user, it will be rendered on the right side
 *
 * if the message is sent by the admin, it will be rendered on the left side
 *
 * if the message is pending, it will be rendered with an opacity of 0.5
 *
 * if the message is sent by the user, and the state is sent a gray tick will be rendered
 *
 * if the message is sent by the user, and the state is received a double gray tick will be rendered
 *
 * if the message is sent by the user, and the state is read a double blue tick will be rendered
 *
 * if the message is the first message of the user or the admin, a triangle will be rendered
 *
 * @param {Props} { message: { message, createdAt, state, sender } }
 * @returns
 */
const Message = ({
  message: { sender, message, createdAt, state },
  showTriangle = false,
  trianglePosition,
}: Props) => {
  return (
    <div
      style={{
        maxWidth: "90%",
      }}
      className={`text-xs py-1 px-2.5 rounded-md relative ${senderToClass[sender]}`}
    >
      {message}
      {showTriangle && trianglePosition && (
        <Triangle position={trianglePosition} />
      )}
    </div>
  );
};

const senderToClass: Record<MessageInterface["sender"], string> = {
  admin: "bg-gray-500 text-white text-opacity-60 self-start",
  user: "bg-green-500 text-white text-opacity-90 self-end",
};

const Triangle = ({ position }: { position: "left" | "right" }) => {
  return (
    <div
      style={{
        borderTop:
          position === "left"
            ? "12px solid rgb(107, 114, 128)"
            : "12px solid rgb(16, 185, 129)",
        borderLeft: position === "left" ? "16px solid transparent" : undefined,
        borderRight:
          position === "right" ? "16px solid transparent" : undefined,
      }}
      className={`w-0 h-0 absolute top-0 ${
        position === "left" ? "-left-1.5" : "-right-1.5"
      }`}
    ></div>
  );
};

export default Message;
