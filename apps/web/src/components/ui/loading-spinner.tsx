import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ fullpage = false }: { fullpage?: boolean }) => {
  const Spinner = () => {
    return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  };

  return fullpage ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner />
    </div>
  ) : (
    <Spinner />
  );
};

export default LoadingSpinner;
