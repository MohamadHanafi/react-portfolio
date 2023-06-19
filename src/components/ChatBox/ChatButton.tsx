import { Dispatch } from "react";
import img from "../../assets/chat-img.png";

interface Props {
  onClick: Dispatch<React.SetStateAction<"open" | "close">>;
}

const ChatButton = ({ onClick }: Props) => {
  return (
    <div
      onClick={() => onClick((prev) => (prev === "open" ? "close" : "open"))}
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
      }}
      className="chat-box-button"
    >
      {" "}
    </div>
  );
};

export default ChatButton;
