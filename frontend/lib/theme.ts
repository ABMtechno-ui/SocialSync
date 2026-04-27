export const colors = {
  yellow:     "#FFD54A",
  yellowDk:   "#F5B800",
  black:      "#111111",
  white:      "#FFFFFF",
  grey1:      "#FFFFFF",
  grey2:      "#F7F3E8",
  grey3:      "#E5E5EA",
  grey4:      "#C7C7CC",
  grey5:      "#6E6E73",
  grey6:      "#3A3A3C",
  iconYellow: "#FFF3BF",
  iconBlue:   "#E0ECFF",
  iconGreen:  "#E0F7EC",
} as const;

export const brutalistShadow = {
  yellow:   "4px 4px 0px #FFD54A",
  yellowDk: "4px 4px 0px #F5B800",
  black:    "4px 4px 0px #111111",
  sm:       "2px 2px 0px #FFD54A",
  none:     "none",
} as const;

export type IconVariant   = "yellow" | "blue" | "green";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type BadgeVariant  = "yellow"  | "blue" | "green" | "grey" | "black";
export type CardShadow    = "none"    | "yellow" | "black" | "soft";

export const iconTileColors: Record<IconVariant, { bg: string; color: string }> = {
  yellow: { bg: "#FFF3BF", color: "#111111" },
  blue:   { bg: "#E0ECFF", color: "#111111" },
  green:  { bg: "#E0F7EC", color: "#111111" },
};
