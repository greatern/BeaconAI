type Colour = "blue" | "orange" | "green" | "red";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  colour: Colour;
};

const ACCENT_STYLES: Record<Colour, string> = {
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
};

export default function RiskCard({ title, value, subtitle, colour }: Props) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${ACCENT_STYLES[colour]}`}>
        {title}
      </div>

      <h2 className="text-5xl font-bold">{value}</h2>

      {subtitle && <p className="text-sm text-stone-500 mt-1.5">{subtitle}</p>}
    </div>
  );
}