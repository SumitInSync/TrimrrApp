import { Suspense } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import DashBoard from "./pages/DashBoard";
import Auth from "./pages/Auth";
import RedirectLink from "./pages/RedirectLink";
import Link from "./pages/Link";
import UrlProvider from "./context";
import RequireAuth from "./components/require-auth";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <DashBoard />
          </RequireAuth>
        )
      },
      {
        path: "/auth",
        element: <Auth />
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <Link />
          </RequireAuth>
        )
      },
      {
        path: "/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RedirectLink />
          </Suspense>
        )
      }
    ]
  }
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
