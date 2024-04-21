"use client";

export function FormattedDate({ date }: { date: Date }) {
  return (
    <>
      {date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  );
}
