import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Dashboard from "../pages/Dashboard";
import ManageProducts from "../pages/ManageProduct";
import ManageOrder from "../pages/ManageOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/manage-product",
        element: <ManageProducts />,
      },
      {
        path: "/manage-order",
        element: <ManageOrder />,
      },
    ],
  },
]);

export default router;
