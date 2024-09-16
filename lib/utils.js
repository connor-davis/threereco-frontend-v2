import { compareItems, rankItem } from "@tanstack/match-sorter-utils";

import { clsx } from "clsx";
import { sortingFns } from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export function getRandomFillColor() {
  const baseColor = "#206492";

  // Convert hex color to RGB
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // Convert RGB color to HSL
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s, l };
  }

  // Convert HSL to RGB
  function hslToRgb(h, s, l) {
    let r, g, b;
    h /= 360;
    s /= 100;
    l /= 100;
    function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  // Generate a random hue shift and ensure color remains vibrant
  function getRandomHueShift() {
    return 120 * Math.random(); // Random hue shift between 0 and 120 degrees
  }

  // Main function
  const rgbBase = hexToRgb(baseColor);
  const hslBase = rgbToHsl(rgbBase.r, rgbBase.g, rgbBase.b);

  // Adjust lightness and saturation for vibrancy
  const randomHueShift = getRandomHueShift();
  const newHue = (hslBase.h + randomHueShift) % 360;

  // Increase saturation and lightness to avoid dark colors
  const adjustedSaturation = Math.min(1, hslBase.s + Math.random() * 0.3); // Up to +30% saturation
  const adjustedLightness = Math.min(
    0.9,
    Math.max(0.3, hslBase.l + (Math.random() - 0.5) * 0.4)
  ); // Lightness between 0.3 and 0.9

  const adjustedColor = hslToRgb(
    newHue,
    adjustedSaturation * 100,
    adjustedLightness * 100
  );
  return `#${[adjustedColor.r, adjustedColor.g, adjustedColor.b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}
