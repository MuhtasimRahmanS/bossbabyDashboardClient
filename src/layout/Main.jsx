import { Outlet } from "react-router-dom";
import Sidebar from "../element/Sidebar";

const Main = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
