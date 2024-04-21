"use client";

import { Fragment } from "react";

export function FormattedDate({ date }: { date: Date }) {
  return (
    <Fragment>
      {date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </Fragment>
  );
}
