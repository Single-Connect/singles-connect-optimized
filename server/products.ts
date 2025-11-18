export const COIN_PRODUCTS = [
  {
    id: "starter",
    name: "Starter Pack",
    coins: 500,
    price: 499, // in cents
    priceId: "price_starter", // Will be created in Stripe
    description: "500 Coins für den Einstieg",
  },
  {
    id: "popular",
    name: "Beliebtes Paket",
    coins: 1000,
    bonus: 100,
    price: 999,
    priceId: "price_popular",
    description: "1000 Coins + 100 Bonus",
  },
  {
    id: "best_value",
    name: "Bestes Angebot",
    coins: 2500,
    bonus: 500,
    price: 1999,
    priceId: "price_best_value",
    description: "2500 Coins + 500 Bonus",
  },
  {
    id: "premium",
    name: "Premium Pack",
    coins: 5000,
    bonus: 1500,
    price: 3999,
    priceId: "price_premium",
    description: "5000 Coins + 1500 Bonus",
  },
];

export function getProductById(id: string) {
  return COIN_PRODUCTS.find(p => p.id === id);
}
