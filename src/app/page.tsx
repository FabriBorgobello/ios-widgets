import { Footer } from "@/components/footer";
import { WidgetList } from "@/components/widget-list";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="space-y-8">
        <div className="border-b border-zinc-900 pb-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            iOS Web Widgets
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-zinc-500 sm:text-lg md:mt-5 md:text-xl">
            Discover elements designed for{" "}
            <a
              href={"https://apps.apple.com/pe/app/widget-web/id1522169352"}
              className="bg-gradient-to-r from-rose-700 to-blue-700 bg-clip-text text-transparent"
              target="_blank"
              rel="noopener noreferrer"
            >
              Widget Web
            </a>{" "}
            to improve your iOS experience.
          </p>
        </div>
        <WidgetList />
        <Footer />
      </div>
    </main>
  );
}
