import { useTheme } from "next-themes";
import { BarLoader } from "react-spinners";

const Spinner = () => {
  const { theme } = useTheme();
  const spinnerColor = theme === "light" ? "#09090b" : "#fff";
  return (
    <div className="flex justify-center ">
      <BarLoader color={spinnerColor} />
    </div>
  );
};
export default Spinner;
