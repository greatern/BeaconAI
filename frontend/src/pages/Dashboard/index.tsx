import KPIGrid from "../../features/dashboard/components/KPIGrid";
import DailyBrief from "../../features/dashboard/components/DailyBrief";
import AnalyticsChart from "../../features/dashboard/components/AnalyticsChart";
import ActivityFeed from "../../features/dashboard/components/ActivityFeed";
import WeatherCard from "../../features/dashboard/components/WeatherCard";

export default function Dashboard() {
    return (
        <div className="space-y-8">

            <div>

                <h1 className="text-4xl font-bold">
                    Good Morning 👋
                </h1>

                <p className="text-stone-500 mt-2">
                    Here's what's happening around your community today.
                </p>

            </div>

            <KPIGrid />

            <div className="grid lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2">

                    <AnalyticsChart />

                </div>

                <WeatherCard />

            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                <DailyBrief />

                <ActivityFeed />

            </div>

        </div>
    );
}