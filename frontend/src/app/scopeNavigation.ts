import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FlagIcon from "@mui/icons-material/Flag";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import type { SvgIconComponent } from "@mui/icons-material";

export type LifeOSScopeId =
  | "personal"
  | "societal"
  | "city"
  | "state"
  | "country"
  | "world";

export interface LifeOSScope {
  id: LifeOSScopeId;
  label: string;
  route: string;
  status: "complete" | "foundation" | "planned";
  description: string;
  source: string;
  Icon: SvgIconComponent;
}

export const LIFEOS_SCOPES: LifeOSScope[] = [
  {
    id: "personal",
    label: "Personal",
    route: "/personal",
    status: "complete",
    description:
      "Self-management across habits, health, diet, wealth, work, learning, goals, and long-term plans.",
    source: "Migrated from Life Tracker",
    Icon: PersonIcon,
  },
  {
    id: "societal",
    label: "Societal",
    route: "/societal",
    status: "foundation",
    description:
      "The operating layer for family, circles, communities, groups, institutions, and nearby coordination.",
    source: "LifeOS scope foundation",
    Icon: GroupsIcon,
  },
  {
    id: "city",
    label: "City",
    route: "/city",
    status: "complete",
    description:
      "Civic services, resources, incidents, departments, dashboards, and city-level operations.",
    source: "Existing LifeOS frontend",
    Icon: ApartmentIcon,
  },
  {
    id: "state",
    label: "State",
    route: "/state",
    status: "foundation",
    description:
      "The future state-level governance layer for administration, schemes, policy, and outcomes.",
    source: "LifeOS scope foundation",
    Icon: AccountBalanceIcon,
  },
  {
    id: "country",
    label: "Country",
    route: "/country",
    status: "foundation",
    description:
      "The future national operating view for strategy, indicators, services, and public systems.",
    source: "LifeOS scope foundation",
    Icon: FlagIcon,
  },
  {
    id: "world",
    label: "World",
    route: "/world",
    status: "foundation",
    description:
      "The future global view for civilization-scale indicators, collaboration, and shared problems.",
    source: "LifeOS scope foundation",
    Icon: PublicIcon,
  },
];

export const getLifeOSScopeFromPath = (pathname: string): LifeOSScopeId | null => {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const scope = LIFEOS_SCOPES.find((item) => item.id === firstSegment);
  return scope?.id ?? null;
};

