import { WidthIcon } from "@radix-ui/react-icons";
import { WidgetItem } from "./widget-item";

export interface Widget {
  id: number;
  title: string;
  url: string;
  description: string;
  icon: React.ReactNode;
}

const WIDGETS: Widget[] = [
  {
    id: 1,
    title: "Dólar Blue",
    url: "/dolar-blue",
    description: "Keep track of the latest USD exchange rate in Argentina.",
    icon: <WidthIcon className="h-6 w-6" />,
  },
];

export function WidgetList() {
  return (
    <div className="space-y-4">
      {WIDGETS.map((widget) => (
        <WidgetItem key={widget.id} widget={widget} />
      ))}
    </div>
  );
}
