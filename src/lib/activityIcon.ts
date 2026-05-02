import {
  Heart, Sparkles, Bike, Users, Music, Code, Camera, Book, Dumbbell, Gamepad2,
  Palette, Mic, Trophy, Utensils, Plane, Mountain, Coffee, Film, Brush, Globe,
  Briefcase, GraduationCap, HandHeart, Leaf, Megaphone, type LucideIcon,
} from "lucide-react";
// Lucide includes a soccer ball as `Volleyball`/`CircleDot`; use a custom label match
import { Goal } from "lucide-react";

const map: Array<{ keys: string[]; Icon: LucideIcon }> = [
  { keys: ["futsal", "soccer", "bola", "football"], Icon: Goal },
  { keys: ["coding", "code", "programming", "developer", "tech"], Icon: Code },
  { keys: ["music", "musik", "band", "song"], Icon: Music },
  { keys: ["photo", "foto", "camera", "fotografi"], Icon: Camera },
  { keys: ["book", "baca", "literasi", "buku"], Icon: Book },
  { keys: ["gym", "fitness", "workout", "olahraga"], Icon: Dumbbell },
  { keys: ["game", "esport", "gaming"], Icon: Gamepad2 },
  { keys: ["art", "lukis", "design", "seni"], Icon: Palette },
  { keys: ["talk", "podcast", "speak", "speech"], Icon: Mic },
  { keys: ["sport", "tournament", "lomba", "kompetisi"], Icon: Trophy },
  { keys: ["food", "kuliner", "masak"], Icon: Utensils },
  { keys: ["travel", "trip", "jalan"], Icon: Plane },
  { keys: ["hiking", "gunung", "alam", "nature", "outdoor"], Icon: Mountain },
  { keys: ["coffee", "ngopi", "cafe"], Icon: Coffee },
  { keys: ["film", "movie", "nonton"], Icon: Film },
  { keys: ["craft", "kreatif"], Icon: Brush },
  { keys: ["sosial", "social", "community"], Icon: Globe },
  { keys: ["bisnis", "business", "career"], Icon: Briefcase },
  { keys: ["belajar", "kelas", "kursus", "edukasi", "study"], Icon: GraduationCap },
  { keys: ["volunteer", "bakti", "donasi", "amal", "charity"], Icon: HandHeart },
  { keys: ["lingkungan", "environment", "green"], Icon: Leaf },
  { keys: ["promo", "kampanye", "campaign"], Icon: Megaphone },
  { keys: ["bike", "sepeda", "cycling", "gowes"], Icon: Bike },
  { keys: ["love", "kasih"], Icon: Heart },
  { keys: ["people", "member"], Icon: Users },
];

export function getActivityIcon(...candidates: Array<string | null | undefined>): LucideIcon {
  const text = candidates.filter(Boolean).join(" ").toLowerCase();
  for (const { keys, Icon } of map) {
    if (keys.some((k) => text.includes(k))) return Icon;
  }
  return Sparkles;
}
