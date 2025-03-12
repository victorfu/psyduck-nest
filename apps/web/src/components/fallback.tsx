import { Spin } from "antd";

export const Fallback = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spin />
    </div>
  );
};
