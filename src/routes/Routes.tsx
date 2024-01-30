import { FC, Suspense, lazy } from "react";
import type { RouteObject } from "react-router-dom";
import SuspenseLoading from "../components/lazy-loader/SuspenseLoading";

const Loadable = (Component: FC) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<SuspenseLoading />}>
      <Component {...props} />
    </Suspense>
  );

const LandingPageRef = Loadable(lazy(() => import("../pages/Landing")));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPageRef />,
  },
];

export default routes;
