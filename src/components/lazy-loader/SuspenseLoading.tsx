import { CircularProgress } from "@mui/material";

const SuspenseLoading = ({ bgColor = "", circularColor = "white" }) => {
  return (
    <div
      className="center_align_container"
      style={{
        height: "100vh",
        backgroundColor: bgColor,
      }}
    >
      <CircularProgress style={{ color: circularColor }} />
    </div>
  );
};

export default SuspenseLoading;
