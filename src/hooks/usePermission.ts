import { useSelector } from "react-redux";
import {
  selectIsFeatureEnabled,
  selectIsSubFeatureEnabled,
  selectIsLoading,
} from "../redux/slices/featureTreeSlice";
import { RootState } from "../redux/store";

export const usePermission = () => {
  const loading = useSelector(selectIsLoading);

  // Hook-friendly usage returning boolean directly (requires passing state implicitly via useSelector in component,
  // but to make it easier for devs we wrap it here)

  const checkModule = (module: string) => {
    return useSelector((state: RootState) =>
      selectIsFeatureEnabled(state, module)
    );
  };

  const checkFeature = (module: string, feature: string) => {
    return useSelector((state: RootState) =>
      selectIsSubFeatureEnabled(state, module, feature)
    );
  };

  return {
    loading,
    checkModule,
    checkFeature,
  };
};
