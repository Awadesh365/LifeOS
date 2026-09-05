import { useLocalSearchParams } from "expo-router";
import IntelligenceScreen from "@/features/intelligence/IntelligenceScreen";
export default function IntelligenceRoute() {
  const { path } = useLocalSearchParams<{ path: string[] }>();
  return (
    <IntelligenceScreen
      path={Array.isArray(path) ? path.join("/") : (path ?? "")}
    />
  );
}
