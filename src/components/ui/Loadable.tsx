import { Suspense, ComponentType } from "react";
import LoadingScreen from "./LoadingScreen";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Loadable = (Component: ComponentType<any>) => (props: any) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;
