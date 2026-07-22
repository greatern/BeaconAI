const steps = [
  {
    number: "01",
    title: "Community reports an incident",
  },
  {
    number: "02",
    title: "Beacon AI analyses reports and images",
  },
  {
    number: "03",
    title: "Risk models generate predictions",
  },
  {
    number: "04",
    title: "Citizens receive actionable insights",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#243447] py-28">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl text-white font-bold">
          How Beacon Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mt-20">

          {steps.map((step) => (
            <div key={step.number}>

              <p className="text-6xl text-[#D6A54B] font-bold">
                {step.number}
              </p>

              <h3 className="text-white text-2xl mt-6">
                {step.title}
              </h3>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}