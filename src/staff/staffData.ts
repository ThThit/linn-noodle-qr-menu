// Dish keys used for translated dish names on the owner dashboard.
// (Live orders now come from src/shared/orderStore.ts.)

export type DishKey =
  | "shanNoodle"
  | "mohinga"
  | "friedRice"
  | "tofuFritters"
  | "teaLeafSalad"
  | "milkTea"
  | "limeJuice"

export const drinkDishes: ReadonlySet<DishKey> = new Set<DishKey>([
  "milkTea",
  "limeJuice",
])

/** Quick kitchen notes, translated in staffCopy.noteNames. */
export type NoteKey = "lessSpicy" | "noPeanuts" | "extraSoup" | "noIce"
