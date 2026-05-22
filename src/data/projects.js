// ─────────────────────────────────────────────────────────────────────────────
// Design Synthesis — Project Archive Data
// Each project maps to a physical book on the bookshelf
// Phase 2: Extended with coverImage, gallery, longDescription, challenge,
//          solution, technologies, credits
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
    longDescription:
      "Conceived as a dialogue between permanence and landscape, Residenza Silente emerges from the Lombard plain as four interlocking concrete volumes. The programme distributes living, sleeping, work, and contemplative spaces across distinct pavilions linked by a subterranean promenade — a sequence of compressed and expanded spatial moments that modulates light, views, and privacy with architectural precision. Exposed board-formed concrete, aged bronze joinery, and locally sourced limestone combine to form a material palette of austere warmth.",
    challenge:
      "The client sought radical privacy without enclosure — a retreat that felt simultaneously sheltered and open to the sky. The sloping site, flood-plain regulations, and a strict local height limit of 4.2 m demanded creative sectional thinking.",
    solution:
      "The solution sank the connecting promenade 900 mm below grade, allowing pavilions to read as low, landscape-scaled forms while achieving generous 3.8 m internal ceiling heights. Rainwater gardens regulate runoff and become integral to the spatial experience.",
    coverImage: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6d9db24e?w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
    ],
    technologies: ["Board-formed Concrete", "Aged Bronze", "Limestone", "Passive Cooling"],
    credits: "Structural: Ingegneria Alpina · Lighting: Atelier Lumina · Photography: Studio Nord",
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
    title: "Maison Brûlée",
    subtitle: "Cultural Pavilion",
    category: "Cultural",
    year: "2022",
    location: "Lyon, France",
    description:
      "A charred timber pavilion at the confluence of the Rhône and Saône rivers. Shou Sugi Ban cladding references industrial heritage while sheltering a seasonal arts programme.",
    longDescription:
      "Standing at the river confluence, Maison Brûlée reinterprets the region's silk and industrial histories through the ancient Japanese technique of Shou Sugi Ban — charred timber weathering to a silver-black patina over time. The pavilion houses a seasonal programme of installations, readings, and performances within a single flexible interior. Full-height pivoting screens allow the structure to open entirely to the riverside promenade.",
    challenge:
      "A temporary programme brief — designed for five years — was reconciled with materials that improve with age. Fire regulations near the waterway required extensive fire-engineering collaboration.",
    solution:
      "Structural glulam was wrapped rather than replaced by the charred skin, with the timber frame engineered to be demountable and re-erected at a future site should the programme find a permanent home.",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=900&q=80",
    ],
    technologies: ["Shou Sugi Ban", "Glulam", "Pivot Screens", "Adaptive Reuse"],
    credits: "Fire Engineering: Pyrotec Lyon · Carpentry: Atelier Bois · Client: Métropole de Lyon",
    spineColor: "#2C1A0E",
    spineGradient:
      "linear-gradient(105deg, rgba(255,200,120,0.10) 0%, transparent 30%, rgba(0,0,0,0.38) 100%)",
    textColor: "#D4A96A",
    accentColor: "#E8823A",
    pageColor: "#F0E6D3",
    height: 236,
    thickness: 38,
    shelfRow: 0,
    bookIndex: 1,
    tags: ["Timber", "Cultural", "Riverside"],
  },
  {
    id: 3,
    title: "Harbour Terminus",
    subtitle: "Marine Transport Hub",
    category: "Infrastructure",
    year: "2022",
    location: "Oslo, Norway",
    description:
      "A public ferry terminus stretching 280 m along the Oslo Fjord. Weathering steel and Douglas fir create a building that is simultaneously civic infrastructure and public promenade.",
    longDescription:
      "Harbour Terminus redefines the prosaic function of a transit building as a civic gesture. The 280-metre linear structure mediates between the fjord and the city, offering sheltered berths at its lower level and a continuous public roof-walk above. Weathering steel exterior planes develop an oxidised patina aligned to the harbour's maritime context, while Douglas fir interiors provide warmth for daily commuters.",
    challenge:
      "Harsh marine conditions, a compressed 26-month programme, and the requirement to maintain full ferry operations throughout construction demanded modular fabrication and sequential assembly.",
    solution:
      "The building was divided into 12 prefabricated structural bays, each assembled onshore and craned into position overnight. Interface details were standardised to allow parallel fabrication streams.",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601628828688-632f38a5a3b2?w=900&q=80",
    ],
    technologies: ["Weathering Steel", "Douglas Fir", "Prefabrication", "Marine Engineering"],
    credits: "Marine Structural: Arup Oslo · Client: Ruter AS · Photography: Åke Eson Lindman",
    spineColor: "#4A3728",
    spineGradient:
      "linear-gradient(105deg, rgba(255,255,255,0.07) 0%, transparent 40%, rgba(0,0,0,0.30) 100%)",
    textColor: "#C8B49A",
    accentColor: "#B07850",
    pageColor: "#EBE0D0",
    height: 244,
    thickness: 46,
    shelfRow: 0,
    bookIndex: 2,
    tags: ["Infrastructure", "Marine", "Public"],
  },
  {
    id: 4,
    title: "Garden of Absence",
    subtitle: "Memorial Landscape",
    category: "Landscape",
    year: "2021",
    location: "Kyoto, Japan",
    description:
      "A contemporary memorial garden within the grounds of a seventeenth-century temple complex. Raked gravel, moss, and black granite reference Zen spatial philosophy while honouring contemporary loss.",
    longDescription:
      "Commissioned by the temple community as a space of contemplation and remembrance, Garden of Absence weaves contemporary spatial thinking into a 400-year-old context. The garden occupies a previously neglected courtyard, transforming it through raked Shirakawa gravel, moss-covered mounds, and monolithic black granite forms that cast precise shadows calibrated to the solstice calendar. The experience changes fundamentally across seasons and times of day.",
    challenge:
      "Working within a protected UNESCO heritage context required every intervention to be fully reversible. Local craftspeople with centuries of inherited garden tradition were essential collaborators.",
    solution:
      "All hardscape elements were set without mortar or permanent fixings. The design dialogue with the chief garden master of the temple extended across three growing seasons before planting commenced.",
    coverImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80",
    ],
    technologies: ["Shirakawa Gravel", "Moss Culture", "Black Granite", "Heritage-Sensitive"],
    credits: "Garden Master: Kenji Matsumoto · Photography: Iwan Baan · Client: Temple Community",
    spineColor: "#1C2B1E",
    spineGradient:
      "linear-gradient(105deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.40) 100%)",
    textColor: "#9EB89E",
    accentColor: "#6A9B6A",
    pageColor: "#E8EDE6",
    height: 220,
    thickness: 32,
    shelfRow: 0,
    bookIndex: 3,
    tags: ["Landscape", "Memorial", "Zen"],
  },

  // ── SHELF 1 ──────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Torre Invisibile",
    subtitle: "Mixed-Use Tower",
    category: "Commercial",
    year: "2021",
    location: "Barcelona, Spain",
    description:
      "A 22-storey tower clad in reflective low-iron glass that dissolves into the Mediterranean sky. Floor plates rotate 2° per floor, generating organic torque without structural compromise.",
    longDescription:
      "Torre Invisibile explores the boundary between solid and atmosphere. Each floor plate rotates two degrees relative to the one below, creating a gentle torque visible from street level as a shimmer of displaced reflections. Low-iron glass cladding minimises the green cast common to curtain-wall buildings, allowing the tower to mirror the sky with unusual fidelity. At ground level, the building splays open to create a covered public piazza with a permanently installed water feature.",
    challenge:
      "The floor plate rotation, while architecturally deliberate, introduced complex perimeter column geometry and non-standard façade panel shapes at every level.",
    solution:
      "A parametric structural model coordinated with the façade engineer allowed each of the 1,440 unique glass panels to be cut from a rationalised set of 18 base geometries, dramatically reducing fabrication cost.",
    coverImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?w=900&q=80",
    ],
    technologies: ["Low-Iron Glass", "Parametric Façade", "Rotating Floors", "BIM-Integrated"],
    credits: "Structural: Arup Barcelona · Façade: Permasteelisa · Developer: Inmobiliaria Catalana",
    spineColor: "#1E2D3D",
    spineGradient:
      "linear-gradient(105deg, rgba(150,200,255,0.12) 0%, transparent 40%, rgba(0,0,0,0.30) 100%)",
    textColor: "#8BAFC8",
    accentColor: "#4A8DB8",
    pageColor: "#E4EDF5",
    height: 268,
    thickness: 50,
    shelfRow: 1,
    bookIndex: 0,
    tags: ["Tower", "Glass", "Commercial"],
  },
  {
    id: 6,
    title: "Wabi-Sabi House",
    subtitle: "Family Residence",
    category: "Residential",
    year: "2020",
    location: "Portland, USA",
    description:
      "A family home built around imperfection: hand-thrown ceramic tiles, cracked clay plasters, and raw Douglas fir celebrate material honesty in a Pacific Northwest forest clearing.",
    longDescription:
      "Wabi-Sabi House takes its name from the Japanese aesthetic of finding beauty in imperfection and transience. Every material was chosen for its capacity to age gracefully: hand-thrown ceramic tiles sourced from a local studio, clay plasters mixed on site with varying aggregate ratios, and Douglas fir beams left with saw marks intact. The programme organises private and collective life across a single-storey L-plan, wrapping a south-facing courtyard garden.",
    challenge:
      "The clients' brief required radical material authenticity in a jurisdiction with prescriptive building codes that generally favour standardised, inspectable finishes.",
    solution:
      "Extensive pre-application meetings with the building department, supported by material samples and third-party structural assessments, established a precedent for each non-standard finish before design was finalised.",
    coverImage: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=80",
    ],
    technologies: ["Clay Plaster", "Hand-Thrown Ceramic", "Douglas Fir", "Passive Solar"],
    credits: "Ceramics: Mudlark Studio · Clay Plaster: Earth Building Co. · Photography: Jeremy Bittermann",
    spineColor: "#3D2B1C",
    spineGradient:
      "linear-gradient(105deg, rgba(255,220,160,0.08) 0%, transparent 35%, rgba(0,0,0,0.32) 100%)",
    textColor: "#C8A878",
    accentColor: "#A07040",
    pageColor: "#F0E8D8",
    height: 230,
    thickness: 40,
    shelfRow: 1,
    bookIndex: 1,
    tags: ["Residential", "Crafts", "Forest"],
  },
  {
    id: 7,
    title: "Sala delle Acque",
    subtitle: "Spa & Thermal Baths",
    category: "Wellness",
    year: "2020",
    location: "Vals, Switzerland",
    description:
      "A contemporary thermal bath complex carved into an alpine meadow. Quartzite walls, spring water channels, and a vaulted travertine ceiling create an archaeology of water and stone.",
    longDescription:
      "Sala delle Acque draws on the long tradition of alpine thermal culture while proposing a new spatial typology: a single vaulted hall that concentrates all bathing rituals within one shared atmosphere. Quartzite sourced from the adjacent mountain provides the primary wall material; its natural stratification creates horizontal shadow lines at varying water levels. Spring water enters through cast bronze spouts at body temperature, overflowing into channels that carry it through each successive pool.",
    challenge:
      "Engineering thermal stratification — maintaining distinct temperature zones within a unified spatial volume — without visible mechanical infrastructure.",
    solution:
      "The pools were carved at different floor levels, exploiting natural heat stratification. Supply and return circuits are concealed within the quartzite wall construction, with no surface-mounted pipework visible.",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80",
    ],
    technologies: ["Quartzite", "Travertine", "Thermal Engineering", "Bronze", "Spring Water"],
    credits: "Thermal Engineering: Bollinger+Grohmann · Stonemasons: Bündner Naturstein",
    spineColor: "#8B9B8A",
    spineGradient:
      "linear-gradient(105deg, rgba(255,255,255,0.10) 0%, transparent 45%, rgba(0,0,0,0.28) 100%)",
    textColor: "#E8EDE8",
    accentColor: "#B8D4B8",
    pageColor: "#EFF3EE",
    height: 248,
    thickness: 44,
    shelfRow: 1,
    bookIndex: 2,
    tags: ["Wellness", "Stone", "Alpine"],
  },
  {
    id: 8,
    title: "Biblioteca Nera",
    subtitle: "Municipal Library",
    category: "Civic",
    year: "2021",
    location: "Ghent, Belgium",
    description:
      "A public library clad in black phosphate-treated steel. The exterior's industrial severity dissolves inside into warm ash wood reading alcoves and a soaring daylit atrium.",
    longDescription:
      "Biblioteca Nera presents a deliberate urban paradox: a monolithic dark exterior that gives way to one of the most luminous interiors in the city. Black phosphate-treated steel cladding references the industrial brick warehouses that once lined this canal district. Inside, the building opens around a 22-metre daylit atrium lined with ash timber reading alcoves stacked four levels high, each angled to capture northern light over the canal.",
    challenge:
      "The phosphate-treated steel cladding system was not listed in the Belgian building code, requiring independent fire-performance certification before planning consent could be granted.",
    solution:
      "A full-scale mock-up panel was fire-tested to BS476 standards, establishing the system's 90-minute fire rating. The test data formed the basis of a building regulations approval that has since been cited in three subsequent Belgian projects.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=80",
    ],
    technologies: ["Phosphate Steel", "Ash Timber", "Daylit Atrium", "Acoustic Engineering"],
    credits: "Acoustic: Müller-BBM · Library Consultant: Stichting Openbare Bibliotheek · Photography: Filip Dujardin",
    spineColor: "#1A1A1A",
    spineGradient:
      "linear-gradient(105deg, rgba(255,255,255,0.07) 0%, transparent 30%, rgba(0,0,0,0.45) 100%)",
    textColor: "#D0C8B8",
    accentColor: "#907050",
    pageColor: "#ECE8E0",
    height: 260,
    thickness: 56,
    shelfRow: 1,
    bookIndex: 3,
    tags: ["Library", "Civic", "Steel"],
  },

  // ── SHELF 2 ──────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "Studio Umbra",
    subtitle: "Artist's Studio",
    category: "Cultural",
    year: "2023",
    location: "Oaxaca, Mexico",
    description:
      "A painter's studio embedded in a hillside above Oaxaca city. Adobe construction and a single north-facing clerestory create constant, shadowless light within a cave-like interior.",
    longDescription:
      "Studio Umbra was designed around a single experiential ambition: to create a light so consistent and diffuse that no hour of the working day offers an advantage over any other. Adobe walls 600 mm thick regulate temperature without mechanical cooling, maintaining a near-constant 19°C throughout the year. The north-facing clerestory admits a column of reflected sky light that travels across the studio floor over the course of the day — the only clock the artist requires.",
    challenge:
      "Oaxaca's seismic zone 4D designation required significant structural engineering for masonry construction. Standard adobe is not permitted in seismic zones without reinforcement.",
    solution:
      "Horizontal and vertical rebar cages were integrated within the adobe walls and connected to a reinforced concrete ring beam — a technique developed with local engineers and craftspeople who had built similar structures in the valley for two generations.",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    ],
    technologies: ["Adobe", "Seismic-Reinforced Masonry", "Clerestory", "Passive Cooling"],
    credits: "Seismic Engineering: UNAM Faculty of Engineering · Builder: Constructora Zapoteca",
    spineColor: "#8B5E3C",
    spineGradient:
      "linear-gradient(105deg, rgba(255,220,180,0.10) 0%, transparent 40%, rgba(0,0,0,0.30) 100%)",
    textColor: "#F0D8B8",
    accentColor: "#E89850",
    pageColor: "#F5EDE0",
    height: 218,
    thickness: 34,
    shelfRow: 2,
    bookIndex: 0,
    tags: ["Studio", "Adobe", "Light"],
  },
  {
    id: 10,
    title: "Passage du Temps",
    subtitle: "Hospitality Interior",
    category: "Interior",
    year: "2022",
    location: "Paris, France",
    description:
      "A boutique hotel interior that layers a century of Parisian living: Haussmann bones, Art Deco marquetry, and contemporary craft objects coexist as a curated archaeological section.",
    longDescription:
      "Passage du Temps refuses to pretend the building was born in a single era. The 1889 Haussmann structure is stripped to its limestone party walls and timber joinery, then relined with Art Deco-period marquetry panels salvaged from a demolished Montparnasse brasserie. Contemporary craft objects — ceramics, textiles, and furniture — are placed alongside the historical material not as contrast but as continuation. Each of the 24 rooms is a unique composition within this shared material language.",
    challenge:
      "Sourcing 340 square metres of salvaged Art Deco marquetry panels in restorable condition while working to a defined budget and programme.",
    solution:
      "A six-month salvage campaign across Belgium, the Netherlands, and northern France located sufficient material in three separate demolition sales. A specialist marquetry restorer was retained as a sub-consultant for the duration of the fit-out.",
    coverImage: "https://images.unsplash.com/photo-1551105378-78e609e1d468?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=80",
    ],
    technologies: ["Salvaged Marquetry", "Limestone", "Art Deco", "Adaptive Reuse"],
    credits: "Marquetry Restoration: Atelier Duchamp · FF&E: Maison de Crafts · Photography: Francis Amiand",
    spineColor: "#4A3828",
    spineGradient:
      "linear-gradient(105deg, rgba(220,180,120,0.10) 0%, transparent 45%, rgba(0,0,0,0.28) 100%)",
    textColor: "#D4B888",
    accentColor: "#C09050",
    pageColor: "#F2E8D8",
    height: 234,
    thickness: 42,
    shelfRow: 2,
    bookIndex: 1,
    tags: ["Interior", "Hospitality", "Heritage"],
  },
  {
    id: 11,
    title: "Fjord Pavilion",
    subtitle: "Public Observatory",
    category: "Landscape",
    year: "2020",
    location: "Bergen, Norway",
    description:
      "A public observatory cantilevering 18 metres over the Nærøyfjord. Laminated glass floors, weathering steel structure, and a single unobstructed viewpoint redefine the relationship between visitor and landscape.",
    longDescription:
      "Fjord Pavilion is an act of concentrated attention — a single platform that focuses 600,000 annual visitors on one of the world's most dramatic natural landscapes. The 18-metre cantilever over the fjord is achieved through a V-shaped weathering steel truss that channels loads to two concrete anchor points in the bedrock. Laminated glass floor panels allow visitors to look directly down to the water 212 metres below. The pavilion has no interior — it is infrastructure for seeing.",
    challenge:
      "The cantilever required anchoring into granite bedrock at an angle of 67° to vertical, in a location accessible only by boat during the construction season.",
    solution:
      "Rock bolts were installed by specialist alpine engineers absailing from the cliff face. The steel structure was fabricated in Bergen and delivered by fjord barge in three sections, assembled on site with a 200-tonne crane positioned on a floating platform.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
    ],
    technologies: ["Laminated Glass", "Weathering Steel Cantilever", "Rock Bolt Anchoring", "Marine Construction"],
    credits: "Structural: Multiconsult AS · Client: Statens Vegvesen · Photography: Rasmus Norlander",
    spineColor: "#2A3540",
    spineGradient:
      "linear-gradient(105deg, rgba(120,180,220,0.10) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)",
    textColor: "#9BB8C8",
    accentColor: "#5A8FA8",
    pageColor: "#E4ECF0",
    height: 242,
    thickness: 36,
    shelfRow: 2,
    bookIndex: 2,
    tags: ["Landscape", "Observatory", "Cantilever"],
  },
  {
    id: 12,
    title: "Casa Terracotta",
    subtitle: "Community Centre",
    category: "Civic",
    year: "2023",
    location: "Seville, Spain",
    description:
      "A neighbourhood community centre built entirely from locally fired terracotta bricks. A central cooling tower draws air through the building via traditional Moorish wind-tower principles.",
    longDescription:
      "Casa Terracotta recovers a pre-industrial building logic for a contemporary civic programme. All 180,000 bricks were fired in a surviving local kiln using traditional Sevillian techniques, producing subtle colour variation that animates every wall surface. The central cooling tower — derived from the malqaf wind-catchers of Islamic architecture — draws hot air upward and out while pulling cooled air from a subterranean cistern through the building's rooms. Mechanical cooling was omitted entirely.",
    challenge:
      "Demonstrating to the municipal client that a building with no mechanical cooling could meet the thermal comfort requirements of its programme — including a children's library, meeting rooms, and an outdoor kitchen.",
    solution:
      "Thermal dynamic modelling over a full Seville climate year demonstrated that the passive systems maintain interior temperatures below 27°C for 98% of occupied hours. The cistern beneath the building stores winter rainwater for the evaporative cooling cycle.",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
    ],
    technologies: ["Terracotta Brick", "Wind Tower", "Evaporative Cooling", "Passive Architecture"],
    credits: "Passive Systems: Transsolar · Kiln: Alfares Santa Ana · Photography: Fernando Alda",
    spineColor: "#8B4A2A",
    spineGradient:
      "linear-gradient(105deg, rgba(255,180,120,0.12) 0%, transparent 40%, rgba(0,0,0,0.30) 100%)",
    textColor: "#F0C898",
    accentColor: "#D07040",
    pageColor: "#F5E8D8",
    height: 226,
    thickness: 44,
    shelfRow: 2,
    bookIndex: 3,
    tags: ["Civic", "Terracotta", "Passive"],
  },
   {
    id: 13,
    title: "Casa Terracotta",
    subtitle: "Community Centre",
    category: "Civic",
    year: "2023",
    location: "Seville, Spain",
    description:
      "A neighbourhood community centre built entirely from locally fired terracotta bricks. A central cooling tower draws air through the building via traditional Moorish wind-tower principles.",
    longDescription:
      "Casa Terracotta recovers a pre-industrial building logic for a contemporary civic programme. All 180,000 bricks were fired in a surviving local kiln using traditional Sevillian techniques, producing subtle colour variation that animates every wall surface. The central cooling tower — derived from the malqaf wind-catchers of Islamic architecture — draws hot air upward and out while pulling cooled air from a subterranean cistern through the building's rooms. Mechanical cooling was omitted entirely.",
    challenge:
      "Demonstrating to the municipal client that a building with no mechanical cooling could meet the thermal comfort requirements of its programme — including a children's library, meeting rooms, and an outdoor kitchen.",
    solution:
      "Thermal dynamic modelling over a full Seville climate year demonstrated that the passive systems maintain interior temperatures below 27°C for 98% of occupied hours. The cistern beneath the building stores winter rainwater for the evaporative cooling cycle.",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
    ],
    technologies: ["Terracotta Brick", "Wind Tower", "Evaporative Cooling", "Passive Architecture"],
    credits: "Passive Systems: Transsolar · Kiln: Alfares Santa Ana · Photography: Fernando Alda",
    spineColor: "#8B4A2A",
    spineGradient:
      "linear-gradient(105deg, rgba(255,180,120,0.12) 0%, transparent 40%, rgba(0,0,0,0.30) 100%)",
    textColor: "#F0C898",
    accentColor: "#D07040",
    pageColor: "#F5E8D8",
    height: 226,
    thickness: 44,
    shelfRow: 2,
    bookIndex: 3,
    tags: ["Civic", "Terracotta", "Passive"],
  },
   {
    id: 14,
    title: "Casa Terracotta",
    subtitle: "Community Centre",
    category: "Civic",
    year: "2023",
    location: "Seville, Spain",
    description:
      "A neighbourhood community centre built entirely from locally fired terracotta bricks. A central cooling tower draws air through the building via traditional Moorish wind-tower principles.",
    longDescription:
      "Casa Terracotta recovers a pre-industrial building logic for a contemporary civic programme. All 180,000 bricks were fired in a surviving local kiln using traditional Sevillian techniques, producing subtle colour variation that animates every wall surface. The central cooling tower — derived from the malqaf wind-catchers of Islamic architecture — draws hot air upward and out while pulling cooled air from a subterranean cistern through the building's rooms. Mechanical cooling was omitted entirely.",
    challenge:
      "Demonstrating to the municipal client that a building with no mechanical cooling could meet the thermal comfort requirements of its programme — including a children's library, meeting rooms, and an outdoor kitchen.",
    solution:
      "Thermal dynamic modelling over a full Seville climate year demonstrated that the passive systems maintain interior temperatures below 27°C for 98% of occupied hours. The cistern beneath the building stores winter rainwater for the evaporative cooling cycle.",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
    ],
    technologies: ["Terracotta Brick", "Wind Tower", "Evaporative Cooling", "Passive Architecture"],
    credits: "Passive Systems: Transsolar · Kiln: Alfares Santa Ana · Photography: Fernando Alda",
    spineColor: "#8B4A2A",
    spineGradient:
      "linear-gradient(105deg, rgba(255,180,120,0.12) 0%, transparent 40%, rgba(0,0,0,0.30) 100%)",
    textColor: "#F0C898",
    accentColor: "#D07040",
    pageColor: "#F5E8D8",
    height: 226,
    thickness: 44,
    shelfRow: 2,
    bookIndex: 3,
    tags: ["Civic", "Terracotta", "Passive"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Derived helpers
// ─────────────────────────────────────────────────────────────────────────────

export const SHELF_COUNT = 3;

export function getProjectsByShelf(shelfIndex) {
  return projects.filter((p) => p.shelfRow === shelfIndex);
}

export function getProjectById(id) {
  return projects.find((p) => p.id === id) ?? null;
}