import { formatToEUR, getBananaPrices } from "./utils";

export default async function BananaTracker() {
  const [consum, mercadona, lidl, carrefour] = await getBananaPrices();

  const PRICES = [
    { name: "Consum", price: consum },
    { name: "Mercadona", price: mercadona },
    { name: "Lidl", price: lidl },
    { name: "Carrefour", price: carrefour },
  ];

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-800">
      <div className="flex h-80 w-80 flex-col items-center justify-center gap-4 bg-zinc-50 p-8 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍌</span>
          <h1 className="text-xl font-semibold">Banana Tracker</h1>
          <span className="text-3xl">🍌</span>
        </div>
        <hr className="w-full border border-zinc-400 opacity-30 dark:border-zinc-400" />
        <ul className="grid w-full grid-cols-2 gap-4">
          {PRICES.map(({ name, price }) => (
            <li
              key={name}
              className="flex flex-col items-center justify-center"
            >
              <span className=" text-zinc-800 dark:text-zinc-400">{name}</span>
              <span className="text-3xl font-semibold">
                {price ? formatToEUR(price) : "-"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
