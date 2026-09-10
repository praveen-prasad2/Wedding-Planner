import {
  Building2,
  UtensilsCrossed,
  Flower2,
  Shirt,
  Gem,
  ShoppingBag,
  Flower,
  Sparkles,
  Footprints,
  Car,
  Gift,
  Music,
  Camera,
  Home,
  Tag,
  type LucideIcon,
} from "lucide-react";

export const ICON_OPTIONS = [
  "Building2",
  "UtensilsCrossed",
  "Flower2",
  "Shirt",
  "Gem",
  "ShoppingBag",
  "Flower",
  "Sparkles",
  "Footprints",
  "Car",
  "Gift",
  "Music",
  "Camera",
  "Home",
  "Tag",
] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  UtensilsCrossed,
  Flower2,
  Shirt,
  Gem,
  ShoppingBag,
  Flower,
  Sparkles,
  Footprints,
  Car,
  Gift,
  Music,
  Camera,
  Home,
  Tag,
};

export function CategoryIcon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? Sparkles;
  return <Icon size={size} className={className} />;
}
