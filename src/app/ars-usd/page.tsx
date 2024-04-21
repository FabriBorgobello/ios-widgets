async function fetchUSDValue() {
  const API_URL = "https://dolarhoy.com/i/cotizaciones/dolar-blue";
  const request = await fetch(API_URL);
  const text = await request.text();
  const buy = text.match(/<p>(\d+\.\d+)<span>Compra<\/span><\/p>/)?.[1];
  const sell = text.match(/<p>(\d+\.\d+)<span>Venta<\/span><\/p>/)?.[1];
  return { buy, sell, date: new Date().toLocaleTimeString() };
}

function formatToARS(value: string | number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    compactDisplay: "short",
  }).format(Number(value));
}

export default async function ArsUsd() {
  const { buy, sell, date } = await fetchUSDValue();
  return (
    <div className="flex aspect-square flex-col items-center justify-center gap-2 border border-red-500 bg-zinc-950 p-8 text-zinc-50">
      <h1 className="text-3xl">Dólar Blue</h1>
      <hr className="w-1/2 border border-zinc-400 opacity-30" />
      <p className="flex flex-col items-center">
        <span className="text-zinc-400">Compra</span>
        <span className="text-2xl font-semibold">
          {buy ? formatToARS(buy) : "-"}
        </span>
      </p>
      <p className="flex flex-col items-center">
        <span className="text-zinc-400">Venta</span>
        <span className="text-2xl font-semibold">
          {sell ? formatToARS(sell) : "-"}
        </span>
      </p>
      <time className="mt-3 text-sm font-light text-zinc-400">
        Updated: {date}
      </time>
    </div>
  );
}
