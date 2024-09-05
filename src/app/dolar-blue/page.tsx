async function fetchUSDValue() {
  const API_URL = "https://dolarhoy.com/i/cotizaciones/dolar-blue";
  const request = await fetch(API_URL, {
    next: { revalidate: 3600 },
    headers: { "Content-Type": "text/html" },
  });
  const text = await request.text();
  const buy = text.match(/<p>(\d+\,\d+)<span>Compra<\/span><\/p>/)?.[1];
  const sell = text.match(/<p>(\d+\,\d+)<span>Venta<\/span><\/p>/)?.[1];
  return {
    buy,
    sell,
  };
}

function formatToARS(value: string | number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    compactDisplay: "short",
  }).format(Number(value));
}

export default async function ArsUsd() {
  const { buy, sell } = await fetchUSDValue();
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-800">
      <div className="flex aspect-square w-80 flex-col items-center justify-center gap-4 bg-zinc-50 p-8 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🇦🇷</span>
          <h1 className="text-xl font-semibold">Dólar Blue</h1>
          <span className="text-3xl">💵</span>
        </div>
        <hr className="w-full border border-zinc-400 opacity-30 dark:border-zinc-400" />
        <p className="flex flex-col items-center">
          <span className="text-zinc-800 dark:text-zinc-400">Compra</span>
          <span className="text-2xl font-semibold">
            {buy ? formatToARS(buy) : "-"}
          </span>
        </p>
        <p className="flex flex-col items-center">
          <span className="text-zinc-800 dark:text-zinc-400">Venta</span>
          <span className="text-2xl font-semibold">
            {sell ? formatToARS(sell) : "-"}
          </span>
        </p>
      </div>
    </div>
  );
}
