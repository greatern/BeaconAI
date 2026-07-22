import RiskCard from "./RiskCard";

export default function KPIGrid() {

    return (

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            <RiskCard title="Community Score" value="84" colour="green"/>

            <RiskCard title="Active Incidents" value="26" colour="orange"/>

            <RiskCard title="AI Confidence" value="94%" colour="blue"/>

            <RiskCard title="Alerts" value="7" colour="red"/>

        </div>

    )

}