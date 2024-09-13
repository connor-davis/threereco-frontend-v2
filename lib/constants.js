const PRODUCTS = [
  {
    name: "PET Clear",
  },
  {
    name: "HDPE",
  },
  {
    name: "Polypropylene",
  },
  {
    name: "White Paper",
  },
  {
    name: "HD White",
  },
  {
    name: "Plastic Clear",
  },
  {
    name: "HDPE",
  },
  {
    name: "HD Mixed",
  },
  {
    name: "White Paper",
  },
  {
    name: "Plastic LDPE (Shrink & Mixed)",
  },
  {
    name: "PET Mixed",
  },
  {
    name: "Plastic Mixed",
  },
  {
    name: "Cardboard K4",
  },
  {
    name: "Tetrapak",
  },
  {
    name: "Paper Common",
  },
  {
    name: "Newspaper",
  },
  {
    name: "Mixed paper",
  },
  {
    name: "Glass",
  },
  {
    name: "eWaste",
  },

  {
    name: "Organic/Food waste",
  },
  {
    name: "Construction Ruble",
  },
  {
    name: "Textiles",
  },
].sort((a, b) => {
  if (a.name > b.name) return -1;
  if (a.name < b.name) return 1;

  return 0;
});

export default PRODUCTS;
