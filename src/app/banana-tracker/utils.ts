import * as cheerio from "cheerio";

async function getConsumPrice() {
  const URL =
    "https://tienda.consum.es/api/rest/V1.0/catalog/product/code/7243525";
  const request = await fetch(URL, {
    next: { revalidate: 3600 },
    headers: { "Content-Type": "application/json" },
  });
  const response = await request.json();
  const pricePerKg: number = response.priceData.prices[0].value.centUnitAmount;
  return pricePerKg;
}

async function getMercadonaPrice() {
  const URL = "https://tienda.mercadona.es/api/products/3824/?lang=es&wh=bcn1";
  const request = await fetch(URL, {
    next: { revalidate: 3600 },
    headers: { "Content-Type": "application/json" },
  });
  const response = await request.json();
  const pricePerKg: number = Number(response.price_instructions.bulk_price);
  return pricePerKg;
}

async function getLidlPrice() {
  const URL = "https://www.lidl.es/es/banana/p5927";
  const request = await fetch(URL, {
    next: { revalidate: 3600 },
    headers: { "Content-Type": "text/html" },
  });
  const response = await request.text();
  const $ = cheerio.load(response);
  const pricePerKg = $(".price-pill__price").text().trim();
  return parseFloat(pricePerKg);
}

async function getCarrefourPrice() {
  const URL =
    "https://www.carrefour.es/supermercado/banana-a-granel-1-kg-aprox/R-529921745/p";
  const request = await fetch(URL, {
    next: { revalidate: 3600 },
    headers: { "Content-Type": "text/html" },
  });
  const response = await request.text();
  const $ = cheerio.load(response);
  const pricePerKg = $(".buybox__price-per-unit")
    .text()
    .replace(" €/kg", "")
    .replace(",", ".")
    .trim();
  return parseFloat(pricePerKg);
}

export async function getBananaPrices() {
  return Promise.all([
    getConsumPrice(),
    getMercadonaPrice(),
    getLidlPrice(),
    getCarrefourPrice(),
  ]);
}

export const formatToEUR = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
