import {
  Activity,
  AlertTriangle,
  Droplets,
  Zap,
  Shield,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <div className="relative w-full">

      <div className="rounded-[34px] bg-white shadow-2xl border border-stone-200 overflow-hidden">

        <div className="bg-[#243447] h-14 px-6 flex items-center justify-between">

          <h3 className="text-white font-semibold">
            Beacon Dashboard
          </h3>

          <div className="flex gap-2">

            <div className="w-3 h-3 rounded-full bg-red-400"/>

            <div className="w-3 h-3 rounded-full bg-yellow-400"/>

            <div className="w-3 h-3 rounded-full bg-green-400"/>

          </div>

        </div>

        <div className="p-8 space-y-6">

          <div className="grid grid-cols-2 gap-5">

            <Card
              title="Community Score"
              value="84"
              icon={<Activity />}
            />

            <Card
              title="Today's Alerts"
              value="12"
              icon={<AlertTriangle />}
            />

            <Card
              title="Power"
              value="Stable"
              icon={<Zap />}
            />

            <Card
              title="Water"
              value="Moderate"
              icon={<Droplets />}
            />

          </div>

          <div className="rounded-2xl bg-stone-100 h-56 flex items-center justify-center">

            🇿🇦 Interactive Map

          </div>

          <div className="rounded-2xl border p-5 flex justify-between">

            <div>

              <p className="text-sm text-stone-500">

                AI Recommendation

              </p>

              <h4 className="text-xl font-semibold mt-2">

                Avoid N1 after 17:30

              </h4>

            </div>

            <ArrowUpRight />

          </div>

        </div>

      </div>

      <div className="absolute -top-10 -right-10 bg-white rounded-3xl p-5 shadow-xl">

        <Shield className="text-primary"/>

        <p className="font-semibold mt-2">

          AI Active

        </p>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-stone-50 p-5">

      <div className="flex justify-between">

        {icon}

        <span className="text-green-600">
          ●
        </span>

      </div>

      <p className="text-sm mt-4">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}