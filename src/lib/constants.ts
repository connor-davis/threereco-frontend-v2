export const PRODUCTS = [
  {
    name: "PET Mixed",
    gwCode: "GW 561",
    carbonFactor: "0.54",
  },
  {
    name: "PET Clear",
    gwCode: "GW 562",
    carbonFactor: "0.45",
  },
  {
    name: "Mixed LD Plastic",
    gwCode: "GW 563",
    carbonFactor: "0.85",
  },
  {
    name: "HD/HDPE",
    gwCode: "GW 564",
    carbonFactor: "0.35",
  },
  {
    name: "Polyprop",
    gwCode: "GW 565",
    carbonFactor: "0.60",
  },
  {
    name: "Mixed Recycling",
    gwCode: "GW 571",
    carbonFactor: "0.30",
  },
  {
    name: "K4 - Cardboard",
    gwCode: "GW 530",
    carbonFactor: "0.15",
  },
  {
    name: "HL1 - White Paper",
    gwCode: "GW 531",
    carbonFactor: "0.10",
  },
  {
    name: "Newspaper &amp; Magazine",
    gwCode: "GW 532",
    carbonFactor: "0.13",
  },
  {
    name: "Cans",
    gwCode: "GW 541",
    carbonFactor: "0.85",
  },
  {
    name: "Glass",
    gwCode: "GW 550",
    carbonFactor: "0.12",
  },
  {
    name: "Unrecyclable",
    gwCode: "--",
    carbonFactor: "--",
  },
  {
    name: "Upcycled",
    gwCode: "--",
    carbonFactor: "--",
  },
  {
    name: "Reused",
    gwCode: "--",
    carbonFactor: "--",
  },
  {
    name: "Tetrapak",
    gwCode: "--",
    carbonFactor: "--",
  },
  {
    name: "Aluminium Cans",
    gwCode: "--",
    carbonFactor: "--",
  },
  {
    name: "Other",
    gwCode: "GW 580",
    carbonFactor: "Varies",
  },
].sort((a, b) => {
  if (a.name > b.name) return -1;
  if (a.name < b.name) return 1;

  return 0;
});
