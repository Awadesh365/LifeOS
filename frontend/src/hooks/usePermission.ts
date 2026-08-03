import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectFeatureTree, selectIsLoading } from "../redux/slices/featureTreeSlice";

export const usePermission = () => {
  const loading = useSelector(selectIsLoading);
  const featureTree = useSelector(selectFeatureTree);

  const checkModule = useCallback(
    (module: string) => {
      if (!featureTree) return false;

      const feature = featureTree[module];
      if (!feature) return true;

      return feature.IS_ACTIVE !== false;
    },
    [featureTree],
  );

  const checkFeature = useCallback(
    (module: string, feature: string) => {
      if (!featureTree) return false;

      const moduleConfig = featureTree[module];
      if (!moduleConfig) return true;
      if (moduleConfig.IS_ACTIVE === false) return false;
      if (!moduleConfig.SUB_FEATURES) return true;

      const subFeature = moduleConfig.SUB_FEATURES[feature];
      if (typeof subFeature === "boolean") return subFeature !== false;
      if (subFeature && typeof subFeature === "object") {
        return subFeature.IS_ACTIVE !== false;
      }

      return true;
    },
    [featureTree],
  );

  return {
    loading,
    checkModule,
    checkFeature,
  };
};
