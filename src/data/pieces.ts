export interface JewelryPiece {
  id: string;
  name: string;
  code: string;
  desc: string;
  image: string;
  alt: string;
  category?: string;
  srcset?: string;
}

export const PIECES: JewelryPiece[] = [
  {
    id: "SN00145",
    name: "Emerald Cascade Necklace",
    code: "SN00145",
    category: "Necklace",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sn00145-emerald-cascade-necklace.webp",
    srcset: "/assets/jewelry/sn00145-emerald-cascade-necklace-480.webp 480w, /assets/jewelry/sn00145-emerald-cascade-necklace-800.webp 800w, /assets/jewelry/sn00145-emerald-cascade-necklace-1200.webp 1200w",
    alt: "Emerald Cascade Necklace featuring a fine green emerald centerpiece framed by cascading white diamonds"
  },
  {
    id: "SR00098",
    name: "The Arc Solitaire Ring",
    code: "SR00098",
    category: "Ring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sr00098-the-arc-solitaire-ring.webp",
    srcset: "/assets/jewelry/sr00098-the-arc-solitaire-ring-480.webp 480w, /assets/jewelry/sr00098-the-arc-solitaire-ring-800.webp 800w, /assets/jewelry/sr00098-the-arc-solitaire-ring-1200.webp 1200w",
    alt: "The Arc Solitaire Ring with a brilliant round white diamond nestled above a pavé-set contoured gold band"
  },
  {
    id: "SE0005",
    name: "Infinity Fall Earrings",
    code: "SE0005",
    category: "Earring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/se0005-infinity-fall-earrings.webp",
    srcset: "/assets/jewelry/se0005-infinity-fall-earrings-480.webp 480w, /assets/jewelry/se0005-infinity-fall-earrings-800.webp 800w, /assets/jewelry/se0005-infinity-fall-earrings-1200.webp 1200w",
    alt: "Infinity Fall Earrings with pear-cut vivid red rubies and delicate looped white diamond drops"
  },
  {
    id: "SR00080",
    name: "Vertex Signet Ring",
    code: "SR00080",
    category: "Ring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sr00080-vertex-signet-ring.webp",
    srcset: "/assets/jewelry/sr00080-vertex-signet-ring-480.webp 480w, /assets/jewelry/sr00080-vertex-signet-ring-800.webp 800w, /assets/jewelry/sr00080-vertex-signet-ring-1200.webp 1200w",
    alt: "Vertex Signet Ring in sculptural yellow gold set with twin square princess-cut white diamonds"
  },
  {
    id: "SE00084",
    name: "Soho Cluster Studs",
    code: "SE00084",
    category: "Earring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/se00084-soho-cluster-studs.webp",
    srcset: "/assets/jewelry/se00084-soho-cluster-studs-480.webp 480w, /assets/jewelry/se00084-soho-cluster-studs-800.webp 800w, /assets/jewelry/se00084-soho-cluster-studs-1200.webp 1200w",
    alt: "Soho Cluster Studs featuring a vibrant mosaic of emeralds, coral cabochons, rubies and diamond pavé"
  },
  {
    id: "SN00152",
    name: "Polki Fresco Pendant",
    code: "SN00152",
    category: "Necklace",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sn00152-polki-fresco-pendant.webp",
    srcset: "/assets/jewelry/sn00152-polki-fresco-pendant-480.webp 480w, /assets/jewelry/sn00152-polki-fresco-pendant-800.webp 800w, /assets/jewelry/sn00152-polki-fresco-pendant-1200.webp 1200w",
    alt: "Polki Fresco Pendant necklace showcasing uncut polki diamonds encircled by fine enamel detailing"
  },
  {
    id: "SBR00015",
    name: "Stream Emerald Tennis Bracelet",
    code: "SBR00015",
    category: "Bracelet",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sbr00015-stream-emerald-tennis-bracelet.webp",
    srcset: "/assets/jewelry/sbr00015-stream-emerald-tennis-bracelet-480.webp 480w, /assets/jewelry/sbr00015-stream-emerald-tennis-bracelet-800.webp 800w, /assets/jewelry/sbr00015-stream-emerald-tennis-bracelet-1200.webp 1200w",
    alt: "Stream Emerald Tennis Bracelet crafted in yellow gold with alternating pear and emerald-cut green gems"
  },
  {
    id: "SE00086",
    name: "Mosaic Flower Pearl Earrings",
    code: "SE00086",
    category: "Earring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/se00086-mosaic-flower-pearl-earrings.webp",
    srcset: "/assets/jewelry/se00086-mosaic-flower-pearl-earrings-480.webp 480w, /assets/jewelry/se00086-mosaic-flower-pearl-earrings-800.webp 800w, /assets/jewelry/se00086-mosaic-flower-pearl-earrings-1200.webp 1200w",
    alt: "Mosaic Flower Pearl Earrings featuring multi-colored gemstone petals and lustrous natural pearl drops"
  },
  {
    id: "SR00031",
    name: "Wildflower Ring",
    code: "SR00031",
    category: "Ring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sr00031-wildflower-ring.webp",
    srcset: "/assets/jewelry/sr00031-wildflower-ring-480.webp 480w, /assets/jewelry/sr00031-wildflower-ring-800.webp 800w, /assets/jewelry/sr00031-wildflower-ring-1200.webp 1200w",
    alt: "Wildflower Ring in white gold set with marquise and pear-cut white diamonds in an open floral motif"
  },
  {
    id: "SN00129",
    name: "Scarlet Noor Necklace",
    code: "SN00129",
    category: "Necklace",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sn00129-scarlet-noor-necklace.webp",
    srcset: "/assets/jewelry/sn00129-scarlet-noor-necklace-480.webp 480w, /assets/jewelry/sn00129-scarlet-noor-necklace-800.webp 800w, /assets/jewelry/sn00129-scarlet-noor-necklace-1200.webp 1200w",
    alt: "Scarlet Noor Necklace with graduated pear-shaped red rubies interspersed with brilliant white diamonds"
  },
  {
    id: "SE00102",
    name: "Orbit Halo Studs",
    code: "SE00102",
    category: "Earring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/se00102-orbit-halo-studs.webp",
    srcset: "/assets/jewelry/se00102-orbit-halo-studs-480.webp 480w, /assets/jewelry/se00102-orbit-halo-studs-800.webp 800w, /assets/jewelry/se00102-orbit-halo-studs-1200.webp 1200w",
    alt: "Orbit Halo Studs with brilliant-cut white diamonds surrounded by architectural spiral halos"
  },
  {
    id: "SR00065",
    name: "Coral Bamboo Ring",
    code: "SR00065",
    category: "Ring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sr00065-coral-bamboo-ring.webp",
    srcset: "/assets/jewelry/sr00065-coral-bamboo-ring-480.webp 480w, /assets/jewelry/sr00065-coral-bamboo-ring-800.webp 800w, /assets/jewelry/sr00065-coral-bamboo-ring-1200.webp 1200w",
    alt: "Coral Bamboo Ring featuring warm terracotta coral spheres on a carved yellow gold bamboo band"
  },
  {
    id: "SE00136",
    name: "Rosette Polki Studs",
    code: "SE00136",
    category: "Earring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/se00136-rosette-polki-studs.webp",
    srcset: "/assets/jewelry/se00136-rosette-polki-studs-480.webp 480w, /assets/jewelry/se00136-rosette-polki-studs-800.webp 800w, /assets/jewelry/se00136-rosette-polki-studs-1200.webp 1200w",
    alt: "Rosette Polki Studs featuring flat-cut polki diamond centers framed by undulating pavé petals"
  },
  {
    id: "SBR00040",
    name: "Everleaf Clover Bracelet",
    code: "SBR00040",
    category: "Bracelet",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sbr00040-everleaf-clover-bracelet.webp",
    srcset: "/assets/jewelry/sbr00040-everleaf-clover-bracelet-480.webp 480w, /assets/jewelry/sbr00040-everleaf-clover-bracelet-800.webp 800w, /assets/jewelry/sbr00040-everleaf-clover-bracelet-1200.webp 1200w",
    alt: "Everleaf Clover Bracelet in yellow gold chain with malachite, turquoise and diamond clover motifs"
  },
  {
    id: "SR00089",
    name: "Diamond Coil Ring",
    code: "SR00089",
    category: "Ring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sr00089-diamond-coil-ring.webp",
    srcset: "/assets/jewelry/sr00089-diamond-coil-ring-480.webp 480w, /assets/jewelry/sr00089-diamond-coil-ring-800.webp 800w, /assets/jewelry/sr00089-diamond-coil-ring-1200.webp 1200w",
    alt: "Diamond Coil Ring with continuous spirals of polished yellow gold capped by bezel-set white diamonds"
  },
  {
    id: "SE00155",
    name: "The Orchard Earrings",
    code: "SE00155",
    category: "Earring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/se00155-the-orchard-earrings.webp",
    srcset: "/assets/jewelry/se00155-the-orchard-earrings-480.webp 480w, /assets/jewelry/se00155-the-orchard-earrings-800.webp 800w, /assets/jewelry/se00155-the-orchard-earrings-1200.webp 1200w",
    alt: "The Orchard Earrings with cascading emerald cabochons, rich purple enamel and brilliant diamond halos"
  },
  {
    id: "SR00147",
    name: "Zenith Sapphire Ring",
    code: "SR00147",
    category: "Ring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/sr00147-zenith-sapphire-ring.webp",
    srcset: "/assets/jewelry/sr00147-zenith-sapphire-ring-480.webp 480w, /assets/jewelry/sr00147-zenith-sapphire-ring-800.webp 800w, /assets/jewelry/sr00147-zenith-sapphire-ring-1200.webp 1200w",
    alt: "Zenith Sapphire Ring with an oval deep blue sapphire enveloped in an explosion of baguette and marquise diamonds"
  },
  {
    id: "SE00088",
    name: "Peekaboo Earrings",
    code: "SE00088",
    category: "Earring",
    desc: "A considered expression of form, material and craftsmanship.",
    image: "/assets/jewelry/se00088-peekaboo-earrings.webp",
    srcset: "/assets/jewelry/se00088-peekaboo-earrings-480.webp 480w, /assets/jewelry/se00088-peekaboo-earrings-800.webp 800w, /assets/jewelry/se00088-peekaboo-earrings-1200.webp 1200w",
    alt: "Peekaboo Earrings with ribbed yellow gold and white diamond pavé curving to a hidden gemstone tip"
  }
];

export const ACCENT_COLOR = "#E0A030";
