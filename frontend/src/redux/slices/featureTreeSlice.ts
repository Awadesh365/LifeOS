import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { FeatureTree, RbacState } from "../../types/rbac";
import { RootState } from "../store";

const initialState: RbacState = {
  tree: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const featureTreeSlice = createSlice({
  name: "featureTree",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFeatureTree: (state, action: PayloadAction<FeatureTree>) => {
      state.tree = action.payload;
      state.loading = false;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearFeatureTree: (state) => {
      state.tree = null;
      state.lastUpdated = null;
      state.error = null;
    },
  },
});

export const { setLoading, setFeatureTree, setError, clearFeatureTree } =
  featureTreeSlice.actions;

export default featureTreeSlice.reducer;

// --- Selectors ---

const selectFeatureTreeState = (state: RootState) => state.featureTree;

export const selectFeatureTree = createSelector(
  [selectFeatureTreeState],
  (state) => state.tree
);

export const selectIsLoading = createSelector(
  [selectFeatureTreeState],
  (state) => state.loading
);

/**
 * Check if a high-level feature (Module) is enabled.
 * Default: ENABLED (Permissive/Fail-Open) if tree is loaded but key is missing.
 * This can be changed to Fail-Closed if stricter security is needed.
 */
export const selectIsFeatureEnabled = createSelector(
  [selectFeatureTree, (_state: RootState, featureKey: string) => featureKey],
  (tree, featureKey) => {
    if (!tree) return false; // Not loaded yet -> Hidden

    const feature = tree[featureKey];
    if (!feature) return true; // Not in deny list -> Visible

    return feature.IS_ACTIVE !== false;
  }
);

/**
 * Check a granular sub-feature or field permissions.
 * Usage: selectIsSubFeatureEnabled(state, 'TAX_MODULE', 'SUBMIT_BTN')
 */
export const selectIsSubFeatureEnabled = createSelector(
  [
    selectFeatureTree,
    (_state: RootState, featureKey: string, subFeatureKey: string) => ({
      featureKey,
      subFeatureKey,
    }),
  ],
  (tree, { featureKey, subFeatureKey }) => {
    if (!tree) return false;

    const feature = tree[featureKey];
    if (!feature) return true; // Parent not tracked -> allowed
    if (feature.IS_ACTIVE === false) return false; // Parent disabled -> Child disabled

    if (!feature.SUB_FEATURES) return true; // No sub-features tracked -> allowed

    const subFeature = feature.SUB_FEATURES[subFeatureKey];

    // If subFeature is just a boolean
    if (typeof subFeature === "boolean") {
      return subFeature !== false;
    }

    // If subFeature is an object (FeatureConfig)
    if (subFeature && typeof subFeature === "object") {
      return subFeature.IS_ACTIVE !== false;
    }

    // Default
    return true;
  }
);
