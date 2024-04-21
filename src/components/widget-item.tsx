"use client";
import { useRouter } from "next/navigation";
import { Widget } from "./widget-list";

export function WidgetItem({ widget }: { widget: Widget }) {
  const router = useRouter();
  return (
    <button
      className="group flex w-full items-start justify-start space-x-4 rounded-lg p-4 text-left transition-colors duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-950"
      onClick={() => router.push(widget.url)}
      aria-label={widget.title}
      role="button"
    >
      <div className="flex-shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-900 p-2 dark:bg-zinc-100">
          {widget.icon}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
          {widget.title}
        </h3>
        <p className="mt-1 text-zinc-500">{widget.description}</p>
      </div>
    </button>
  );
}
