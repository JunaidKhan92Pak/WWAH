import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  overallSuccess: number;
}

const SuccessCircle = ({ overallSuccess }: Props) => {
  const value = overallSuccess;

  // Determine path color based on percentage
  let pathColor = "#10B981"; // default: green (70–100%)

  if (value < 30) {
    pathColor = "#EF4444"; // red-500
  } else if (value < 70) {
    pathColor = "#F59E0B"; // yellow-500
  }

  return (
    <div className="w-24 h-24">
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          textColor: "#000",
          pathColor: pathColor,
          trailColor: "#E5E7EB", // gray-200
          textSize: "18px",
        })}
      />
    </div>
  );
};

export default SuccessCircle;
