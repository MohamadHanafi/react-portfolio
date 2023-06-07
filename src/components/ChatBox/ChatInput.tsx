import { ForwardedRef, forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  customClass?: string;
  ref?: React.Ref<HTMLInputElement>;
}
const ChatInput = forwardRef(
  ({ customClass, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <input
        className={`rounded-full flex bg-gray-800 placeholder-white placeholder-opacity-75 text-white p-2 h-8 text-xs focus:ring-0 focus:outline-none ${customClass}`}
        type="text"
        placeholder="Type a message ..."
        ref={ref}
        {...props}
      ></input>
    );
  }
);

export default ChatInput;
