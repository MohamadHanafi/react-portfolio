import moment from "moment";
import { useEffect, useState } from "react";

interface Props {
  // the date is formatted to be DD/MM/YYYY
  date: string;
}

const DateTag = ({ date }: Props) => {
  const [formattedDate, setFormattedDate] = useState("");
  useEffect(() => {
    // format the date to be like 11 May 2021
    // if the date is today or yesterday, it will be formatted to be "Today" or "Yesterday"
    const formattedDate = moment(date, "DD/MM/YYYY").calendar(null, {
      sameDay: "[Today]",
      lastDay: "[Yesterday]",
      sameElse: "DD MMM YYYY",
    });
    // if it starts with 0, remove it
    if (formattedDate.startsWith("0")) {
      setFormattedDate(formattedDate.slice(1));
      return;
    }
    setFormattedDate(formattedDate);
  }, [date]);

  return (
    <div
      style={{
        maxWidth: "fit-content",
      }}
      className="bg-gray-700 text-white text-opacity-40 inline-block py-0.5 px-2 rounded-md text-xs self-center"
    >
      {formattedDate}
    </div>
  );
};

export default DateTag;
