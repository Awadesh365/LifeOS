import { Suspense, ComponentType } from "react";
import LoadingScreen from "./LoadingScreen";

const Loadable = (Component: ComponentType<any>) => (props: any) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;
