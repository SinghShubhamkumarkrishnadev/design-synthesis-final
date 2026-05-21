// ─────────────────────────────────────────────────────────────────────────────
// Design Synthesis — Project Archive Data
// Each project maps to a physical book on the bookshelf
// ─────────────────────────────────────────────────────────────────────────────

export const projects = [
  // ── SHELF 0 ──────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Residenza Silente",
    subtitle: "Private Villa",
    category: "Residential",
    year: "2023",
    location: "Milan, Italy",
    description:
      "A monolithic concrete retreat dissolving into the Lombard countryside. Raw materiality meets refined spatial sequencing across four interconnected volumes.",
    spineColor: "#1A1918",
    spineGradient:
      "linear-gradient(105deg, rgba(255,255,255,0.09) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.35) 100%)",
    textColor: "#B8A98A",
    accentColor: "#C4956A",
    pageColor: "#EDE4D4",
    height: 258,
    thickness: 54,
    shelfRow: 0,
    bookIndex: 0,
    tags: ["Concrete", "Minimalist", "Villa"],
  },
  {
    id: 2,
    title: "Terra Incognita",
    subtitle: "Landscape Project",
    category: "Landscape",
    year: "2022",
    location: "Tuscany, Italy",
    description:
      "A landscape intervention that reads the existing topography as both constraint and material. Limestone walls trace ancient agricultural boundaries.",
    spineColor: "#5C3D28",
    spineGradient:
      "linear-gradient(105deg, rgba(255,220,160,0.12) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
    textColor: "#EDD4A8",
    accentColor: "#D4A068",
    pageColor: "#F0E8D8",
    height: 224,
    thickness: 38,
    shelfRow: 0,
    bookIndex: 1,
    tags: ["Landscape", "Stone", "Terracing"],
  },
  {
    id: 3,
    title: "Forma Library",
    subtitle: "Cultural Institution",
    category: "Cultural",
    year: "2022",
    location: "Vienna, Austria",
    description:
      "A civic reading room carved from solid mass. Precise fenestration choreographs the movement of light across the reading floor throughout the day.",
    spineColor: "#1C2640",
    spineGradient:
      "linear-gradient(105deg, rgba(160,190,255,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.45) 100%)",
    textColor: "#A8BFD8",
    accentColor: "#6A8FAF",
    pageColor: "#E8EEF8",
    height: 272,
    thickness: 50,
    shelfRow: 0,
    bookIndex: 2,
    tags: ["Cultural", "Civic", "Concrete"],
  },
  {
    id: 4,
    title: "Nomad Pavilion",
    subtitle: "Desert Hospitality",
    category: "Hospitality",
    year: "2023",
    location: "Marrakech, Morocco",
    description:
      "A transient hospitality structure negotiating the threshold between interior comfort and a vast, indifferent landscape.",
    spineColor: "#3A2C1A",
    spineGradient:
      "linear-gradient(105deg, rgba(255,200,130,0.12) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.38) 100%)",
    textColor: "#D4B890",
    accentColor: "#C08050",
    pageColor: "#EEE0C8",
    height: 212,
    thickness: 44,
    shelfRow: 0,
    bookIndex: 3,
    tags: ["Hospitality", "Desert", "Pavilion"],
  },
  {
    id: 5,
    title: "Kira Residence",
    subtitle: "Contemplative Home",
    category: "Residential",
    year: "2021",
    location: "Kyoto, Japan",
    description:
      "A contemplative home organized around a central garden void. Timber and paper screen translate traditional spatial logic into contemporary form.",
    spineColor: "#2A2520",
    spineGradient:
      "linear-gradient(105deg, rgba(255,240,220,0.07) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.42) 100%)",
    textColor: "#C8B89A",
    accentColor: "#A0886A",
    pageColor: "#EDE6D8",
    height: 248,
    thickness: 46,
    shelfRow: 0,
    bookIndex: 4,
    tags: ["Residential", "Japanese", "Timber"],
  },
  {
    id: 6,
    title: "White Atelier",
    subtitle: "Studio Interior",
    category: "Interior",
    year: "2023",
    location: "Zürich, Switzerland",
    description:
      "A creative studio interior defined by monochromatic restraint. Every surface is an instrument tuned to capture and redirect natural light.",
    spineColor: "#C4B89E",
    spineGradient:
      "linear-gradient(105deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 30%, transparent 70%, rgba(0,0,0,0.18) 100%)",
    textColor: "#3A3028",
    accentColor: "#6A5A48",
    pageColor: "#F8F4EC",
    height: 218,
    thickness: 34,
    shelfRow: 0,
    bookIndex: 5,
    tags: ["Interior", "Studio", "Minimalist"],
  },

  // ── SHELF 1 ──────────────────────────────────────────────────────────────
  {
    id: 7,
    title: "Alpine Retreat",
    subtitle: "Mountain Residence",
    category: "Residential",
    year: "2022",
    location: "Vorarlberg, Austria",
    description:
      "Embedded into a mountain slope, this residence uses local stone and dark timber to anchor itself to the landscape. Snow and shadow shape the architecture.",
    spineColor: "#3C3830",
    spineGradient:
      "linear-gradient(105deg, rgba(255,248,235,0.07) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)",
    textColor: "#C0B090",
    accentColor: "#906848",
    pageColor: "#EAE0CC",
    height: 262,
    thickness: 52,
    shelfRow: 1,
    bookIndex: 0,
    tags: ["Alpine", "Stone", "Residence"],
  },
  {
    id: 8,
    title: "Casa Volta",
    subtitle: "Luxury Urban Home",
    category: "Residential",
    year: "2021",
    location: "Barcelona, Spain",
    description:
      "A vaulted sequence of spaces weaving through an urban block. Catalan structural tradition is reinterpreted through contemporary material intelligence.",
    spineColor: "#4A3520",
    spineGradient:
      "linear-gradient(105deg, rgba(210,170,100,0.14) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.38) 100%)",
    textColor: "#E0C498",
    accentColor: "#B87840",
    pageColor: "#EEE4D0",
    height: 234,
    thickness: 40,
    shelfRow: 1,
    bookIndex: 1,
    tags: ["Vault", "Heritage", "Luxury"],
  },
  {
    id: 9,
    title: "Meridian Office",
    subtitle: "Corporate Headquarters",
    category: "Commercial",
    year: "2020",
    location: "London, UK",
    description:
      "A headquarters building conceived as an urban threshold. A double-height arcade activates the street edge and mediates between public and private.",
    spineColor: "#0E0E12",
    spineGradient:
      "linear-gradient(105deg, rgba(255,255,255,0.06) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.55) 100%)",
    textColor: "#8A8A9A",
    accentColor: "#5A5A72",
    pageColor: "#E8E8F0",
    height: 264,
    thickness: 56,
    shelfRow: 1,
    bookIndex: 2,
    tags: ["Commercial", "Urban", "Office"],
  },
  {
    id: 10,
    title: "Garden Sequence",
    subtitle: "Landscape Installation",
    category: "Landscape",
    year: "2023",
    location: "Bordeaux, France",
    description:
      "A landscape sequence choreographing movement through a historic winery estate. Time, seasons, and human ritual are inscribed into the ground plane.",
    spineColor: "#2E4028",
    spineGradient:
      "linear-gradient(105deg, rgba(160,240,140,0.07) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.38) 100%)",
    textColor: "#9ABE88",
    accentColor: "#608048",
    pageColor: "#E4EED8",
    height: 220,
    thickness: 42,
    shelfRow: 1,
    bookIndex: 3,
    tags: ["Landscape", "Garden", "Heritage"],
  },
  {
    id: 11,
    title: "Biennale Pavilion",
    subtitle: "Exhibition Architecture",
    category: "Exhibition",
    year: "2021",
    location: "Venice, Italy",
    description:
      "A temporary national pavilion constructed from rammed earth. Impermanence is made material—the building returns to the ground at the end of the exhibition.",
    spineColor: "#4A1C1C",
    spineGradient:
      "linear-gradient(105deg, rgba(255,170,150,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.42) 100%)",
    textColor: "#D4A090",
    accentColor: "#A05040",
    pageColor: "#EEE0D8",
    height: 208,
    thickness: 32,
    shelfRow: 1,
    bookIndex: 4,
    tags: ["Exhibition", "Rammed Earth", "Temporary"],
  },
  {
    id: 12,
    title: "Stillwater Spa",
    subtitle: "Wellness Architecture",
    category: "Hospitality",
    year: "2022",
    location: "Bali, Indonesia",
    description:
      "A hydrotherapy sequence embedded in terraced landscape. Water, volcanic stone, and filtered sky are the primary architectural materials.",
    spineColor: "#343C44",
    spineGradient:
      "linear-gradient(105deg, rgba(190,215,240,0.09) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.42) 100%)",
    textColor: "#A8B8C8",
    accentColor: "#688098",
    pageColor: "#E4EEF4",
    height: 244,
    thickness: 48,
    shelfRow: 1,
    bookIndex: 5,
    tags: ["Wellness", "Water", "Tropical"],
  },
];

/** Filter projects by which shelf row they belong to */
export const getProjectsByShelf = (shelfIndex) =>
  projects
    .filter((p) => p.shelfRow === shelfIndex)
    .sort((a, b) => a.bookIndex - b.bookIndex);

/** Total number of distinct shelf rows */
export const SHELF_COUNT = [...new Set(projects.map((p) => p.shelfRow))].length;