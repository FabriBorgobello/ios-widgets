import { CloudRain, MapPin, Umbrella, Cloud, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// Types
interface WeatherForecast {
  time: string;
  rainProbability: number;
}

// API Constants
const BARCELONA_COORDS = {
  latitude: "41.3888",
  longitude: "2.159",
} as const;

const API_PARAMS = {
  ...BARCELONA_COORDS,
  timezone: "Europe/Berlin",
  hourly: "precipitation_probability",
  forecast_days: "3",
} as const;

// Utility Functions
function getRainProbabilityColor(probability: number): string {
  if (probability < 30) return "text-emerald-500";
  if (probability < 60) return "text-amber-500";
  return "text-rose-500";
}

function getBgColor(probability: number): string {
  if (probability < 30) return "bg-emerald-500";
  if (probability < 60) return "bg-amber-500";
  return "bg-rose-500";
}

// Weather Icon Component
function WeatherIcon({
  probability,
  className,
}: {
  probability: number;
  className?: string;
}) {
  if (probability < 30) return <Cloud className={cn("h-5 w-5", className)} />;
  if (probability < 60)
    return <Droplets className={cn("h-5 w-5", className)} />;
  return <CloudRain className={cn("h-5 w-5", className)} />;
}

// Rain Probability Display Component
function RainProbability({ probability }: { probability: number }) {
  return (
    <div className="flex items-center gap-2">
      <Umbrella
        className={cn("h-4 w-4", getRainProbabilityColor(probability))}
      />
      <div className="flex items-center gap-1">
        <span
          className={cn(
            "text-sm font-medium",
            getRainProbabilityColor(probability),
          )}
        >
          {probability}%
        </span>
        <span className="text-muted-foreground text-xs">chance of rain</span>
      </div>
    </div>
  );
}

// Compact Hourly Forecast Component
function CompactHourlyForecast({ forecast }: { forecast: WeatherForecast }) {
  const hour = new Date(forecast.time).getHours();
  const formattedHour = hour.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <span className="text-muted-foreground mb-1 text-xs font-medium">
        {formattedHour}h
      </span>
      <div
        className={cn(
          "mb-1 h-1.5 w-full rounded-full",
          getBgColor(forecast.rainProbability),
        )}
        style={{ opacity: forecast.rainProbability / 100 }}
      />
      <span
        className={cn(
          "text-xs font-medium",
          getRainProbabilityColor(forecast.rainProbability),
        )}
      >
        {forecast.rainProbability}%
      </span>
    </div>
  );
}

// Daily Forecast Component
function DailyForecast({ forecast }: { forecast: WeatherForecast }) {
  const day = new Date(forecast.time).toLocaleDateString([], {
    weekday: "short",
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <WeatherIcon
          probability={forecast.rainProbability}
          className={getRainProbabilityColor(forecast.rainProbability)}
        />
        <span className="text-sm font-medium">{day}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-secondary h-2 w-16 overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full",
              getBgColor(forecast.rainProbability),
            )}
            style={{ width: `${forecast.rainProbability}%` }}
          />
        </div>
        <span
          className={cn(
            "text-xs font-bold",
            getRainProbabilityColor(forecast.rainProbability),
          )}
        >
          {forecast.rainProbability}%
        </span>
      </div>
    </div>
  );
}

// Data Fetching
async function fetchBarcelonaWeather(): Promise<WeatherForecast[]> {
  const params = new URLSearchParams(API_PARAMS);
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } }); // Cache for 30 minutes
    if (!response.ok) throw new Error("Failed to fetch weather data");

    const data = await response.json();

    // Map API response to WeatherForecast objects
    const forecasts = data.hourly.time.map((time: string, i: number) => ({
      time,
      rainProbability: data.hourly.precipitation_probability[i],
    }));

    // Get forecasts from current hour onwards
    const now = new Date();
    const currentHourIndex = forecasts.findIndex(
      (forecast: WeatherForecast) => {
        const forecastDate = new Date(forecast.time);
        return (
          forecastDate.getHours() >= now.getHours() &&
          forecastDate.getDate() === now.getDate()
        );
      },
    );

    return currentHourIndex >= 0
      ? forecasts.slice(currentHourIndex)
      : forecasts;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
}

// Main Widget Component
export default async function WeatherWidget() {
  const forecasts = await fetchBarcelonaWeather();
  const currentForecast = forecasts[0];

  // Get tomorrow and the day after tomorrow at 12:00
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0);

  const dailyForecasts = forecasts.filter((f) => {
    const forecastDate = new Date(f.time);
    return forecastDate >= tomorrow && forecastDate.getHours() === 12;
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="flex h-[320px] w-[640px] flex-col overflow-hidden border-none shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-800 to-violet-950 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <h2 className="text-xl font-bold">Barcelona</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <WeatherIcon probability={currentForecast.rainProbability} />
              <span className="text-sm font-medium">Now</span>
            </div>
          </div>
          <div className="mt-2">
            <RainProbability probability={currentForecast.rainProbability} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-card flex flex-1 flex-col p-4">
          {/* Hourly Forecasts - Redesigned for small viewports */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-foreground/80 text-sm font-semibold">
                Rain probability (next hours)
              </h3>
              <span className="text-muted-foreground text-xs">
                {new Date().toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {forecasts.slice(0, 6).map((forecast) => (
                <CompactHourlyForecast
                  key={forecast.time}
                  forecast={forecast}
                />
              ))}
            </div>
          </div>

          {/* Daily Forecasts - More compact layout */}
          <div>
            <h3 className="text-foreground/80 mb-2 text-sm font-semibold">
              Next days forecast
            </h3>
            <div className="space-y-3">
              {dailyForecasts.slice(0, 2).map((forecast) => (
                <DailyForecast key={forecast.time} forecast={forecast} />
              ))}
            </div>
          </div>

          {/* Current conditions summary */}
          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center gap-2">
              <WeatherIcon
                probability={currentForecast.rainProbability}
                className={getRainProbabilityColor(
                  currentForecast.rainProbability,
                )}
              />
              <span className="text-sm">
                {currentForecast.rainProbability < 30
                  ? "Clear conditions"
                  : currentForecast.rainProbability < 60
                    ? "Light rain possible"
                    : "Heavy rain likely"}
              </span>
            </div>
            <span className="text-muted-foreground text-xs">
              Updated{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
