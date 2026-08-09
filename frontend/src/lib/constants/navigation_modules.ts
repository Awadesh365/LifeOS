/**
 * LifeOS Navigation Modules
 * Complete navigation structure for Indian e-Governance
 * Created: December 17, 2025
 */

import { NavItem } from "../../types/navigation";

// =============================================================================
// 1. DISTRICT ADMINISTRATION
// =============================================================================
export const DISTRICT_ADMIN_MODULE: NavItem[] = [
  {
    key: "district-dashboard",
    label: "District Dashboard",
    labelKey: "sidebar.district.dashboard",
    icon: "dashboard",
    route: "dashboard",
    enabled: true,
  },
  {
    key: "offices",
    label: "Offices",
    labelKey: "sidebar.district.offices",
    icon: "business",
    enabled: true,
    items: [
      {
        key: "collectorate",
        label: "District Magistrate Office",
        labelKey: "sidebar.district.collectorate",
        icon: "account_balance",
        route: "district/collectorate",
        enabled: true,
      },
      {
        key: "sub-divisions",
        label: "Sub-Divisions",
        labelKey: "sidebar.district.subDivisions",
        icon: "domain",
        route: "district/sub-divisions",
        enabled: true,
      },
      {
        key: "tehsils",
        label: "Sub-Districts",
        labelKey: "sidebar.district.tehsils",
        icon: "location_city",
        route: "district/tehsils",
        enabled: true,
      },
      {
        key: "blocks",
        label: "Development Blocks",
        labelKey: "sidebar.district.blocks",
        icon: "grid_view",
        route: "district/blocks",
        enabled: true,
      },
    ],
  },
  {
    key: "meetings",
    label: "Meetings",
    labelKey: "sidebar.district.meetings",
    icon: "event",
    enabled: true,
    items: [
      {
        key: "calendar",
        label: "Calendar",
        labelKey: "sidebar.district.calendar",
        icon: "calendar_month",
        route: "district/calendar",
        enabled: true,
      },
      {
        key: "minutes",
        label: "Meeting Minutes",
        labelKey: "sidebar.district.minutes",
        icon: "description",
        route: "district/minutes",
        enabled: true,
      },
      {
        key: "vip-visits",
        label: "VIP Visits",
        labelKey: "sidebar.district.vipVisits",
        icon: "stars",
        route: "district/vip-visits",
        enabled: true,
      },
    ],
  },
  {
    key: "orders",
    label: "Orders",
    labelKey: "sidebar.district.orders",
    icon: "gavel",
    enabled: true,
    items: [
      {
        key: "district-orders",
        label: "District Orders",
        labelKey: "sidebar.district.districtOrders",
        icon: "article",
        route: "district/orders",
        enabled: true,
      },
      {
        key: "circulars",
        label: "Circulars",
        labelKey: "sidebar.district.circulars",
        icon: "campaign",
        route: "district/circulars",
        enabled: true,
      },
      {
        key: "directives",
        label: "Central Directives",
        labelKey: "sidebar.district.directives",
        icon: "flag",
        route: "district/directives",
        enabled: true,
      },
    ],
  },
  {
    key: "staff",
    label: "Staff",
    labelKey: "sidebar.district.staff",
    icon: "badge",
    enabled: true,
    items: [
      {
        key: "officer-directory",
        label: "Officer Directory",
        labelKey: "sidebar.district.officerDirectory",
        icon: "people",
        route: "district/officers",
        enabled: true,
      },
      {
        key: "transfers",
        label: "Transfers & Postings",
        labelKey: "sidebar.district.transfers",
        icon: "swap_horiz",
        route: "district/transfers",
        enabled: true,
      },
      {
        key: "attendance",
        label: "Attendance",
        labelKey: "sidebar.district.attendance",
        icon: "schedule",
        route: "district/attendance",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 2. STATE ADMINISTRATION
// =============================================================================
export const STATE_ADMIN_MODULE: NavItem[] = [
  {
    key: "state-dashboard",
    label: "State Dashboard",
    icon: "domain",
    route: "state/dashboard",
    enabled: true,
  },
  {
    key: "district-monitoring",
    label: "District Monitoring",
    icon: "monitoring",
    enabled: true,
    items: [
      {
        key: "district-performance",
        label: "District Performance",
        icon: "analytics",
        route: "state/districts/performance",
        enabled: true,
      },
      {
        key: "comparative-analysis",
        label: "Comparative Analysis",
        icon: "compare",
        route: "state/districts/compare",
        enabled: true,
      },
      {
        key: "monthly-reports",
        label: "Monthly Reports",
        icon: "summarize",
        route: "state/districts/reports",
        enabled: true,
      },
    ],
  },
  {
    key: "schemes-policies",
    label: "Schemes & Policies",
    icon: "policy",
    enabled: true,
    items: [
      {
        key: "central-schemes",
        label: "Central Gov Schemes",
        icon: "flag",
        route: "state/schemes/central",
        enabled: true,
      },
      {
        key: "state-schemes",
        label: "State Gov Schemes",
        icon: "campaign",
        route: "state/schemes/state",
        enabled: true,
      },
      {
        key: "implementation",
        label: "Implementation Status",
        icon: "task_alt",
        route: "state/schemes/status",
        enabled: true,
      },
    ],
  },
  {
    key: "state-reports",
    label: "State Reports",
    icon: "assessment",
    enabled: true,
    items: [
      {
        key: "high-command",
        label: "Ministry Reports",
        icon: "summarize",
        route: "state/reports/high-command",
        enabled: true,
      },
      {
        key: "cabinet",
        label: "Cabinet Briefings",
        icon: "groups",
        route: "state/reports/cabinet",
        enabled: true,
      },
      {
        key: "legislature",
        label: "Legislative Reports",
        icon: "account_balance",
        route: "state/reports/legislature",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 3. CITIZEN SERVICES
// =============================================================================
export const CITIZEN_SERVICES_MODULE: NavItem[] = [
  {
    key: "citizen-portal",
    label: "Citizen Portal",
    icon: "home",
    route: "services/overview",
    enabled: true,
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: "verified",
    enabled: true,
    items: [
      {
        key: "birth-cert",
        label: "Birth Certificate",
        icon: "child_friendly",
        route: "services/certificates/birth",
        enabled: true,
      },
      {
        key: "death-cert",
        label: "Death Certificate",
        icon: "sentiment_sad",
        route: "services/certificates/death",
        enabled: true,
      },
      {
        key: "caste-cert",
        label: "Caste Certificate",
        icon: "badge",
        route: "services/certificates/caste",
        enabled: true,
      },
      {
        key: "income-cert",
        label: "Income Certificate",
        icon: "payments",
        route: "services/certificates/income",
        enabled: true,
      },
      {
        key: "domicile-cert",
        label: "Domicile Certificate",
        icon: "home",
        route: "services/certificates/domicile",
        enabled: true,
      },
      {
        key: "character-cert",
        label: "Character Certificate",
        icon: "verified_user",
        route: "services/certificates/character",
        enabled: true,
      },
    ],
  },
  {
    key: "payments",
    label: "Payments",
    icon: "payments",
    enabled: true,
    items: [
      {
        key: "property-tax",
        label: "Property Tax",
        icon: "home_work",
        route: "services/payments/property-tax",
        enabled: true,
      },
      {
        key: "water-bill",
        label: "Water Charges",
        icon: "water_drop",
        route: "services/payments/water",
        enabled: true,
      },
      {
        key: "electricity",
        label: "Electricity Charges",
        icon: "bolt",
        route: "services/payments/electricity",
        enabled: true,
      },
      {
        key: "trade-license",
        label: "Trade License",
        icon: "store",
        route: "services/payments/trade-license",
        enabled: true,
      },
    ],
  },
  {
    key: "grievances",
    label: "Grievances",
    icon: "support_agent",
    enabled: true,
    items: [
      {
        key: "file-complaint",
        label: "File Complaint",
        icon: "report_problem",
        route: "services/grievances/new",
        enabled: true,
      },
      {
        key: "track-status",
        label: "Track Status",
        icon: "timeline",
        route: "services/grievances/track",
        enabled: true,
      },
      {
        key: "cm-helpline",
        label: "State Helpline",
        icon: "phone",
        route: "services/grievances/cm-helpline",
        enabled: true,
      },
    ],
  },
  {
    key: "e-district",
    label: "District Services",
    icon: "computer",
    enabled: true,
    items: [
      {
        key: "rti",
        label: "RTI (Right to Info)",
        icon: "info",
        route: "services/e-district/rti",
        enabled: true,
      },
      {
        key: "arms-license",
        label: "Arms License",
        icon: "security",
        route: "services/e-district/arms",
        enabled: true,
      },
      {
        key: "other-services",
        label: "Other Services",
        icon: "more_horiz",
        route: "services/e-district/other",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 4. DEVELOPMENT SCHEMES
// =============================================================================
export const DEV_SCHEMES_MODULE: NavItem[] = [
  {
    key: "scheme-dashboard",
    label: "Schemes Dashboard",
    icon: "trending_up",
    route: "schemes/dashboard",
    enabled: true,
  },
  {
    key: "central-schemes",
    label: "Central Schemes",
    icon: "flag",
    enabled: true,
    items: [
      {
        key: "pm-awas",
        label: "PM Housing Scheme",
        icon: "home",
        route: "schemes/central/pm-awas",
        enabled: true,
      },
      {
        key: "pm-kisan",
        label: "PM Farmers Fund",
        icon: "agriculture",
        route: "schemes/central/pm-kisan",
        enabled: true,
      },
      {
        key: "mgnrega",
        label: "Employment (MGNREGA)",
        icon: "engineering",
        route: "schemes/central/mgnrega",
        enabled: true,
      },
      {
        key: "ujjwala",
        label: "PM Clean Fuel Scheme",
        icon: "local_fire_department",
        route: "schemes/central/ujjwala",
        enabled: true,
      },
      {
        key: "ayushman",
        label: "PM Health Scheme",
        icon: "health_and_safety",
        route: "schemes/central/ayushman",
        enabled: true,
      },
    ],
  },
  {
    key: "state-schemes",
    label: "State Schemes",
    icon: "campaign",
    enabled: true,
    items: [
      {
        key: "cm-schemes",
        label: "Chief Minister Schemes",
        icon: "star",
        route: "schemes/state/cm",
        enabled: true,
      },
      {
        key: "subsidies",
        label: "Subsidies & Grants",
        icon: "redeem",
        route: "schemes/state/subsidies",
        enabled: true,
      },
      {
        key: "local-dev",
        label: "Local Area Development",
        icon: "location_city",
        route: "schemes/state/local",
        enabled: true,
      },
    ],
  },
  {
    key: "implementation",
    label: "Implementation",
    icon: "task_alt",
    enabled: true,
    items: [
      {
        key: "beneficiaries",
        label: "Beneficiary List",
        icon: "people",
        route: "schemes/implementation/beneficiaries",
        enabled: true,
      },
      {
        key: "fund-util",
        label: "Fund Utilization",
        icon: "account_balance_wallet",
        route: "schemes/implementation/funds",
        enabled: true,
      },
      {
        key: "progress",
        label: "Progress Reports",
        icon: "assessment",
        route: "schemes/implementation/progress",
        enabled: true,
      },
      {
        key: "geo-tagging",
        label: "Geo-Tagging Status",
        icon: "location_on",
        route: "schemes/implementation/geo",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 5. EMERGENCY SERVICES
// =============================================================================
export const EMERGENCY_MODULE: NavItem[] = [
  {
    key: "command-center",
    label: "Command Center",
    icon: "crisis_alert",
    route: "emergency/map/overview",
    enabled: true,
  },
  {
    key: "incidents",
    label: "Incidents",
    icon: "warning",
    enabled: true,
    items: [
      {
        key: "active",
        label: "Active Incidents",
        icon: "notifications_active",
        route: "emergency/incidents/active",
        enabled: true,
      },
      {
        key: "dispatch",
        label: "Dispatch Operations",
        icon: "local_shipping",
        route: "emergency/dispatch",
        enabled: true,
      },
      {
        key: "resolved",
        label: "Closed Incidents",
        icon: "check_circle",
        route: "emergency/incidents/resolved",
        enabled: true,
      },
    ],
  },
  {
    key: "live-map",
    label: "Live Map",
    icon: "map",
    enabled: true,
    items: [
      {
        key: "resources",
        label: "Asset Tracking",
        icon: "pin_drop",
        route: "emergency/map/resources",
        enabled: true,
      },
      {
        key: "hotspots",
        label: "Risk Heatmaps",
        icon: "whatshot",
        route: "emergency/map/hotspots",
        enabled: true,
      },
      {
        key: "traffic",
        label: "Traffic Conditions",
        icon: "traffic",
        route: "emergency/map/traffic",
        enabled: true,
      },
    ],
  },
  {
    key: "emergency-resources",
    label: "Emergency Assets",
    icon: "inventory_2",
    enabled: true,
    items: [
      {
        key: "fire-stations",
        label: "Fire Stations",
        icon: "local_fire_department",
        route: "emergency/resources/fire",
        enabled: true,
      },
      {
        key: "ambulances",
        label: "Ambulance Fleet",
        icon: "local_hospital",
        route: "emergency/resources/ambulance",
        enabled: true,
      },
      {
        key: "police-vehicles",
        label: "Patrol Vehicles",
        icon: "local_police",
        route: "emergency/resources/police",
        enabled: true,
      },
      {
        key: "equipment",
        label: "Equipment",
        icon: "build",
        route: "emergency/resources/equipment",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 6. REVENUE & LAND
// =============================================================================
export const REVENUE_MODULE: NavItem[] = [
  {
    key: "revenue-dashboard",
    label: "Revenue Dashboard",
    icon: "account_balance",
    route: "revenue/dashboard",
    enabled: true,
  },
  {
    key: "land-records",
    label: "Land Records",
    icon: "landscape",
    enabled: true,
    items: [
      {
        key: "khatauni",
        label: "Rights Records (RoR)",
        icon: "description",
        route: "revenue/land/khatauni",
        enabled: true,
      },
      {
        key: "land-maps",
        label: "Land Maps",
        icon: "map",
        route: "revenue/land/maps",
        enabled: true,
      },
      {
        key: "mutation",
        label: "Mutation Records",
        icon: "swap_horiz",
        route: "revenue/land/mutation",
        enabled: true,
      },
      {
        key: "digitization",
        label: "Digitization Status",
        icon: "computer",
        route: "revenue/land/digitization",
        enabled: true,
      },
    ],
  },
  {
    key: "disputes",
    label: "Disputes",
    icon: "gavel",
    enabled: true,
    items: [
      {
        key: "pending-cases",
        label: "Pending Cases",
        icon: "hourglass_top",
        route: "revenue/disputes/pending",
        enabled: true,
      },
      {
        key: "revenue-court",
        label: "Land Court",
        icon: "balance",
        route: "revenue/disputes/court",
        enabled: true,
      },
      {
        key: "appeals",
        label: "Appeals",
        icon: "record_voice_over",
        route: "revenue/disputes/appeals",
        enabled: true,
      },
    ],
  },
  {
    key: "collection",
    label: "Collection",
    icon: "payments",
    enabled: true,
    items: [
      {
        key: "stamp-duty",
        label: "Stamp Duties",
        icon: "receipt",
        route: "revenue/collection/stamp",
        enabled: true,
      },
      {
        key: "registration",
        label: "Land Registration",
        icon: "edit_document",
        route: "revenue/collection/registration",
        enabled: true,
      },
      {
        key: "land-revenue",
        label: "Land Revenue",
        icon: "agriculture",
        route: "revenue/collection/land",
        enabled: true,
      },
    ],
  },
  {
    key: "patwari",
    label: "Revenue Officer Module",
    icon: "person",
    enabled: true,
    items: [
      {
        key: "daily-reports",
        label: "Daily Reports",
        icon: "today",
        route: "revenue/patwari/daily",
        enabled: true,
      },
      {
        key: "field-visits",
        label: "Field Visits",
        icon: "directions_walk",
        route: "revenue/patwari/visits",
        enabled: true,
      },
      {
        key: "crop-survey",
        label: "Crop Survey",
        icon: "grass",
        route: "revenue/patwari/crop",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 7. HEALTH SERVICES
// =============================================================================
export const HEALTH_MODULE: NavItem[] = [
  {
    key: "health-dashboard",
    label: "Health Dashboard",
    icon: "local_hospital",
    route: "health/dashboard",
    enabled: true,
  },
  {
    key: "facilities",
    label: "Facilities",
    icon: "medical_services",
    enabled: true,
    items: [
      {
        key: "district-hospital",
        label: "District Hospital",
        icon: "local_hospital",
        route: "health/facilities/district",
        enabled: true,
      },
      {
        key: "chc-phc",
        label: "Health Centers (CHC/PHC)",
        icon: "health_and_safety",
        route: "health/facilities/chc-phc",
        enabled: true,
      },
      {
        key: "sub-centers",
        label: "Health Sub-Centers",
        icon: "medical_information",
        route: "health/facilities/sub-centers",
        enabled: true,
      },
      {
        key: "private",
        label: "Private Hospitals",
        icon: "domain",
        route: "health/facilities/private",
        enabled: true,
      },
    ],
  },
  {
    key: "programs",
    label: "Programs",
    icon: "vaccines",
    enabled: true,
    items: [
      {
        key: "immunization",
        label: "Immunization",
        icon: "vaccines",
        route: "health/programs/immunization",
        enabled: true,
      },
      {
        key: "maternal",
        label: "Maternal Care",
        icon: "pregnant_woman",
        route: "health/programs/maternal",
        enabled: true,
      },
      {
        key: "family-planning",
        label: "Family Welfare",
        icon: "family_restroom",
        route: "health/programs/family",
        enabled: true,
      },
      {
        key: "disease-control",
        label: "Disease Control",
        icon: "coronavirus",
        route: "health/programs/disease",
        enabled: true,
      },
    ],
  },
  {
    key: "surveillance",
    label: "Surveillance",
    icon: "biotech",
    enabled: true,
    items: [
      {
        key: "outbreaks",
        label: "Disease Alerts",
        icon: "warning",
        route: "health/surveillance/outbreaks",
        enabled: true,
      },
      {
        key: "epidemic",
        label: "Epidemic Tracking",
        icon: "trending_up",
        route: "health/surveillance/epidemic",
        enabled: true,
      },
      {
        key: "lab-reports",
        label: "Lab Reports",
        icon: "science",
        route: "health/surveillance/lab",
        enabled: true,
      },
    ],
  },
  {
    key: "health-resources",
    label: "Health Resources",
    icon: "inventory",
    enabled: true,
    items: [
      {
        key: "doctors",
        label: "Doctor Availability",
        icon: "person",
        route: "health/resources/doctors",
        enabled: true,
      },
      {
        key: "medicine",
        label: "Medical Inventory",
        icon: "medication",
        route: "health/resources/medicine",
        enabled: true,
      },
      {
        key: "equipment",
        label: "Equipment Status",
        icon: "build",
        route: "health/resources/equipment",
        enabled: true,
      },
      {
        key: "ambulance",
        label: "Ambulance Fleet",
        icon: "local_shipping",
        route: "health/resources/ambulance",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 8. EDUCATION
// =============================================================================
export const EDUCATION_MODULE: NavItem[] = [
  {
    key: "education-dashboard",
    label: "Education Dashboard",
    icon: "school",
    route: "education/dashboard",
    enabled: true,
  },
  {
    key: "schools",
    label: "Schools",
    icon: "apartment",
    enabled: true,
    items: [
      {
        key: "govt-schools",
        label: "Government Schools",
        icon: "school",
        route: "education/schools/government",
        enabled: true,
      },
      {
        key: "private-schools",
        label: "Private Schools",
        icon: "business",
        route: "education/schools/private",
        enabled: true,
      },

      {
        key: "special",
        label: "Special Schools",
        icon: "accessible",
        route: "education/schools/special",
        enabled: true,
      },
    ],
  },
  {
    key: "students",
    label: "Students",
    icon: "people",
    enabled: true,
    items: [
      {
        key: "enrollment",
        label: "Enrollment Data",
        icon: "how_to_reg",
        route: "education/students/enrollment",
        enabled: true,
      },
      {
        key: "dropout",
        label: "Retention Tracking",
        icon: "person_off",
        route: "education/students/dropout",
        enabled: true,
      },
      {
        key: "scholarship",
        label: "Scholarships",
        icon: "card_giftcard",
        route: "education/students/scholarship",
        enabled: true,
      },
      {
        key: "mdm",
        label: "Nutrition Program",
        icon: "restaurant",
        route: "education/students/mdm",
        enabled: true,
      },
    ],
  },
  {
    key: "teachers",
    label: "Teachers",
    icon: "person",
    enabled: true,
    items: [
      {
        key: "directory",
        label: "Teacher Directory",
        icon: "contacts",
        route: "education/teachers/directory",
        enabled: true,
      },
      {
        key: "training",
        label: "Training Programs",
        icon: "model_training",
        route: "education/teachers/training",
        enabled: true,
      },
      {
        key: "transfers",
        label: "Transfer Requests",
        icon: "swap_horiz",
        route: "education/teachers/transfers",
        enabled: true,
      },
      {
        key: "attendance",
        label: "Attendance",
        icon: "schedule",
        route: "education/teachers/attendance",
        enabled: true,
      },
    ],
  },
  {
    key: "exams",
    label: "Exams",
    icon: "quiz",
    enabled: true,
    items: [
      {
        key: "board",
        label: "Board Examinations",
        icon: "grading",
        route: "education/exams/board",
        enabled: true,
      },
      {
        key: "competitive",
        label: "Competitive Tests",
        icon: "emoji_events",
        route: "education/exams/competitive",
        enabled: true,
      },
      {
        key: "results",
        label: "Performance Analysis",
        icon: "analytics",
        route: "education/exams/results",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 9. POLICE & SECURITY
// =============================================================================
export const POLICE_MODULE: NavItem[] = [
  {
    key: "police-dashboard",
    label: "Police Dashboard",
    icon: "local_police",
    route: "police/dashboard",
    enabled: true,
  },
  {
    key: "stations",
    label: "Stations",
    icon: "business",
    enabled: true,
    items: [
      {
        key: "all-thanas",
        label: "Police Stations",
        icon: "local_police",
        route: "police/stations/all",
        enabled: true,
      },
      {
        key: "outposts",
        label: "Outposts",
        icon: "security",
        route: "police/stations/outposts",
        enabled: true,
      },
      {
        key: "checkposts",
        label: "Checkpoints",
        icon: "traffic",
        route: "police/stations/checkposts",
        enabled: true,
      },
    ],
  },
  {
    key: "fir",
    label: "First Info Reports (FIR)",
    icon: "description",
    enabled: true,
    items: [
      {
        key: "register-fir",
        label: "File New Report",
        icon: "add_circle",
        route: "police/fir/register",
        enabled: true,
      },
      {
        key: "pending",
        label: "Pending Cases",
        icon: "hourglass_top",
        route: "police/fir/pending",
        enabled: true,
      },
      {
        key: "challan",
        label: "Traffic Fines",
        icon: "receipt",
        route: "police/fir/challan",
        enabled: true,
      },
      {
        key: "court",
        label: "Court Cases",
        icon: "gavel",
        route: "police/fir/court",
        enabled: true,
      },
    ],
  },
  {
    key: "crime-analytics",
    label: "Crime Analytics",
    icon: "analytics",
    enabled: true,
    items: [
      {
        key: "hotspots",
        label: "Crime Hotspots",
        icon: "whatshot",
        route: "police/analytics/hotspots",
        enabled: true,
      },
      {
        key: "trends",
        label: "Crime Trends",
        icon: "trending_up",
        route: "police/analytics/trends",
        enabled: true,
      },
      {
        key: "reports",
        label: "Monthly Reports",
        icon: "summarize",
        route: "police/analytics/reports",
        enabled: true,
      },
    ],
  },
  {
    key: "personnel",
    label: "Personnel",
    icon: "badge",
    enabled: true,
    items: [
      {
        key: "directory",
        label: "Staff Directory",
        icon: "people",
        route: "police/personnel/directory",
        enabled: true,
      },
      {
        key: "duty-roster",
        label: "Duty Roster",
        icon: "schedule",
        route: "police/personnel/roster",
        enabled: true,
      },
      {
        key: "training",
        label: "Training",
        icon: "fitness_center",
        route: "police/personnel/training",
        enabled: true,
      },
      {
        key: "welfare",
        label: "Welfare",
        icon: "favorite",
        route: "police/personnel/welfare",
        enabled: true,
      },
    ],
  },
  {
    key: "emergency-police",
    label: "Emergency",
    icon: "emergency",
    enabled: true,
    items: [
      {
        key: "112-calls",
        label: "Emergency Calls (112)",
        icon: "phone",
        route: "police/emergency/112",
        enabled: true,
      },
      {
        key: "women-safety",
        label: "Women's Safety",
        icon: "woman",
        route: "police/emergency/women",
        enabled: true,
      },
      {
        key: "vip-security",
        label: "VIP Protection",
        icon: "stars",
        route: "police/emergency/vip",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 10. ENVIRONMENT & SANITATION
// =============================================================================
export const ENVIRONMENT_MODULE: NavItem[] = [
  {
    key: "env-dashboard",
    label: "Environment Dashboard",
    icon: "eco",
    route: "environment/dashboard",
    enabled: true,
  },
  {
    key: "swachh-bharat",
    label: "Clean India Mission",
    icon: "cleaning_services",
    enabled: true,
    items: [
      {
        key: "odf",
        label: "Open Defecation Free (ODF)",
        icon: "wc",
        route: "environment/swachh/odf",
        enabled: true,
      },
      {
        key: "toilets",
        label: "Sanitation Infrastructure",
        icon: "bathroom",
        route: "environment/swachh/toilets",
        enabled: true,
      },
      {
        key: "garbage",
        label: "Garbage Collection",
        icon: "delete",
        route: "environment/swachh/garbage",
        enabled: true,
      },
      {
        key: "waste",
        label: "Waste Processing",
        icon: "recycling",
        route: "environment/swachh/waste",
        enabled: true,
      },
    ],
  },
  {
    key: "green",
    label: "Green Initiatives",
    icon: "park",
    enabled: true,
    items: [
      {
        key: "plantation",
        label: "Plantation Drives",
        icon: "forest",
        route: "environment/green/plantation",
        enabled: true,
      },
      {
        key: "forest",
        label: "Forest Cover",
        icon: "nature",
        route: "environment/green/forest",
        enabled: true,
      },
      {
        key: "pollution",
        label: "Pollution Control",
        icon: "air",
        route: "environment/green/pollution",
        enabled: true,
      },
      {
        key: "river",
        label: "River Cleaning",
        icon: "water",
        route: "environment/green/river",
        enabled: true,
      },
    ],
  },
  {
    key: "urban",
    label: "Urban Services",
    icon: "location_city",
    enabled: true,
    items: [
      {
        key: "street-lights",
        label: "Street Lighting",
        icon: "lightbulb",
        route: "environment/urban/lights",
        enabled: true,
      },
      {
        key: "roads",
        label: "Road Maintenance",
        icon: "add_road",
        route: "environment/urban/roads",
        enabled: true,
      },
      {
        key: "drainage",
        label: "Drainage Systems",
        icon: "water_damage",
        route: "environment/urban/drainage",
        enabled: true,
      },
      {
        key: "parks",
        label: "Public Parks & Gardens",
        icon: "park",
        route: "environment/urban/parks",
        enabled: true,
      },
    ],
  },
  {
    key: "compliance",
    label: "Compliance",
    icon: "verified",
    enabled: true,
    items: [
      {
        key: "ngt",
        label: "Green Tribunal Orders",
        icon: "gavel",
        route: "environment/compliance/ngt",
        enabled: true,
      },
      {
        key: "pollution-reports",
        label: "Pollution Reports",
        icon: "assessment",
        route: "environment/compliance/reports",
        enabled: true,
      },
      {
        key: "inspections",
        label: "Inspections",
        icon: "search",
        route: "environment/compliance/inspections",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 11. ANALYTICS & REPORTS
// =============================================================================
export const ANALYTICS_MODULE: NavItem[] = [
  {
    key: "analytics-dashboard",
    label: "Analytics Dashboard",
    icon: "insights",
    route: "analytics/dashboard",
    enabled: true,
  },
  {
    key: "performance",
    label: "Performance",
    icon: "speed",
    enabled: true,
    items: [
      {
        key: "scorecard",
        label: "District Scorecard",
        icon: "score",
        route: "analytics/performance/scorecard",
        enabled: true,
      },
      {
        key: "kpis",
        label: "Departmental KPIs",
        icon: "trending_up",
        route: "analytics/performance/kpis",
        enabled: true,
      },
      {
        key: "comparative",
        label: "Comparative Analysis",
        icon: "compare_arrows",
        route: "analytics/performance/compare",
        enabled: true,
      },
    ],
  },
  {
    key: "custom-reports",
    label: "Reports",
    icon: "summarize",
    enabled: true,
    items: [
      {
        key: "builder",
        label: "Report Builder",
        icon: "build",
        route: "analytics/reports/builder",
        enabled: true,
      },
      {
        key: "saved",
        label: "Saved Reports",
        icon: "bookmark",
        route: "analytics/reports/saved",
        enabled: true,
      },
      {
        key: "scheduled",
        label: "Scheduled Reports",
        icon: "schedule",
        route: "analytics/reports/scheduled",
        enabled: true,
      },
    ],
  },
  {
    key: "gis",
    label: "GIS Analytics",
    icon: "map",
    enabled: true,
    items: [
      {
        key: "spatial",
        label: "Spatial Analysis",
        icon: "layers",
        route: "analytics/gis/spatial",
        enabled: true,
      },
      {
        key: "heatmaps",
        label: "Heatmaps",
        icon: "gradient",
        route: "analytics/gis/heatmaps",
        enabled: true,
      },
      {
        key: "infra-maps",
        label: "Infrastructure Mapping",
        icon: "domain",
        route: "analytics/gis/infrastructure",
        enabled: true,
      },
    ],
  },
  {
    key: "statutory",
    label: "Statutory Reports",
    icon: "article",
    enabled: true,
    items: [
      {
        key: "monthly",
        label: "Monthly Reports",
        icon: "calendar_month",
        route: "analytics/statutory/monthly",
        enabled: true,
      },
      {
        key: "quarterly",
        label: "Quarterly Reports",
        icon: "date_range",
        route: "analytics/statutory/quarterly",
        enabled: true,
      },
      {
        key: "annual",
        label: "Annual Reports",
        icon: "event",
        route: "analytics/statutory/annual",
        enabled: true,
      },
    ],
  },
];

// =============================================================================
// 12. SYSTEM ADMINISTRATION
// =============================================================================
export const SYSTEM_ADMIN_MODULE: NavItem[] = [
  {
    key: "system-status",
    label: "System Status",
    icon: "dns",
    route: "admin/status",
    enabled: true,
  },
  {
    key: "user-mgmt",
    label: "User Management",
    icon: "manage_accounts",
    enabled: true,
    items: [
      {
        key: "users",
        label: "User Directory",
        icon: "people",
        route: "admin/users/directory",
        enabled: true,
      },
      {
        key: "roles",
        label: "Roles & Permissions",
        icon: "admin_panel_settings",
        route: "admin/users/roles",
        enabled: true,
      },
      {
        key: "access-logs",
        label: "Access Logs",
        icon: "history",
        route: "admin/users/logs",
        enabled: true,
      },
      {
        key: "password-reset",
        label: "Password Reset",
        icon: "lock_reset",
        route: "admin/users/password",
        enabled: true,
      },
    ],
  },
  {
    key: "tenant-config",
    label: "Tenant Configuration",
    icon: "domain",
    enabled: true,
    items: [
      {
        key: "district-settings",
        label: "District Settings",
        icon: "settings",
        route: "admin/tenant/settings",
        enabled: true,
      },
      {
        key: "features",
        label: "Feature Flags",
        icon: "toggle_on",
        route: "admin/tenant/features",
        enabled: true,
      },
      {
        key: "branding",
        label: "Branding Settings",
        icon: "palette",
        route: "admin/tenant/branding",
        enabled: true,
      },
      {
        key: "integrations",
        label: "Integrations",
        icon: "hub",
        route: "admin/tenant/integrations",
        enabled: true,
      },
    ],
  },
  {
    key: "system-settings",
    label: "System Settings",
    icon: "settings",
    enabled: true,
    items: [
      {
        key: "email-sms",
        label: "Communication Channels",
        icon: "mail",
        route: "admin/settings/email-sms",
        enabled: true,
      },
      {
        key: "notifications",
        label: "Notification Policies",
        icon: "notifications",
        route: "admin/settings/notifications",
        enabled: true,
      },
      {
        key: "backup",
        label: "Backup & Restore",
        icon: "backup",
        route: "admin/settings/backup",
        enabled: true,
      },
      {
        key: "api",
        label: "API Management",
        icon: "api",
        route: "admin/settings/api",
        enabled: true,
      },
    ],
  },
  {
    key: "audit",
    label: "Audit & Logs",
    icon: "shield",
    enabled: true,
    items: [
      {
        key: "activity",
        label: "Activity Logs",
        icon: "list",
        route: "admin/audit/activity",
        enabled: true,
      },
      {
        key: "errors",
        label: "Error Logs",
        icon: "error",
        route: "admin/audit/errors",
        enabled: true,
      },
      {
        key: "security",
        label: "Security Events",
        icon: "security",
        route: "admin/audit/security",
        enabled: true,
      },
    ],
  },
];
