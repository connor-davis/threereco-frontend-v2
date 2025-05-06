export const PRODUCTS = [
  {
    name: "PET Mixed",
    gwCode: "GW 525",
    carbonFactor: "0.54",
  },
  {
    name: "PET Clear",
    gwCode: "GW 526",
    carbonFactor: "0.45",
  },
  {
    name: "Mixed LD Plastic",
    gwCode: "GW 527",
    carbonFactor: "0.85",
  },
  {
    name: "HD/HDPE",
    gwCode: "GW 528",
    carbonFactor: "0.35",
  },
  {
    name: "Polyprop",
    gwCode: "GW 529",
    carbonFactor: "0.6",
  },
  {
    name: "Mixed Recycling",
    gwCode: "GW 530",
    carbonFactor: "0.3",
  },
  {
    name: "K4 - Cardboard",
    gwCode: "GW 531",
    carbonFactor: "0.15",
  },
  {
    name: "HL1 - White Paper",
    gwCode: "GW 532",
    carbonFactor: "0.1",
  },
  {
    name: "Newspaper/Magazine/Commons",
    gwCode: "GW 541",
    carbonFactor: "0.13",
  },
  {
    name: "Cans",
    gwCode: "GW 550",
    carbonFactor: "0.85",
  },
  {
    name: "Glass",
    gwCode: "GW 561",
    carbonFactor: "0.12",
  },
  {
    name: "Unrecyclable",
    gwCode: "GW 562",
    carbonFactor: "0",
  },
  {
    name: "Upcycled",
    gwCode: "GW 563",
    carbonFactor: "0.1",
  },
  {
    name: "Reused",
    gwCode: "GW 564",
    carbonFactor: "0.1",
  },
  {
    name: "Tetrapak",
    gwCode: "GW 565",
    carbonFactor: "0.7",
  },
  {
    name: "Aluminium Cans",
    gwCode: "GW 571",
    carbonFactor: "10",
  },
  {
    name: "Textile",
    gwCode: "GW 572",
    carbonFactor: "0.8",
  },
  {
    name: "Metal",
    gwCode: "GW 572",
    carbonFactor: "0.5",
  },
  {
    name: "Other",
    gwCode: "GW 580",
    carbonFactor: "0.5",
  },
].sort((a, b) => {
  if (a.name > b.name) return -1;
  if (a.name < b.name) return 1;

  return 0;
});
