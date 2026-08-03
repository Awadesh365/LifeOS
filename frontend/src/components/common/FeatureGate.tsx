import React, { ReactNode } from "react";
import { usePermission } from "../../hooks/usePermission";

interface FeatureGateProps {
  module: string;
  feature?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component that hides its children if the user
 * does not have permission for the specified module/feature.
 *
 * @example
 * <FeatureGate module="TAX_MODULE">
 *    <TaxDashboard />
 * </FeatureGate>
 *
 * @example
 * <FeatureGate module="TAX_MODULE" feature="SUBMIT_BUTTON" fallback={<DisabledButton />}>
 *    <SubmitButton />
 * </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  module,
  feature,
  children,
  fallback = null,
}) => {
  const { checkModule, checkFeature } = usePermission();

  const isEnabled = feature
    ? checkFeature(module, feature)
    : checkModule(module);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
