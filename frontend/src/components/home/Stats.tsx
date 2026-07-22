const stats = [

    {

        number: "250K+",

        label: "Community Reports"

    },

    {

        number: "92%",

        label: "Prediction Accuracy"

    },

    {

        number: "1M+",

        label: "Citizens Protected"

    },

    {

        number: "24/7",

        label: "AI Monitoring"

    }

];

export default function Stats() {

    return (

        <section className="max-w-7xl mx-auto px-8 py-20">

            <div className="grid md:grid-cols-4 gap-8">

                {

                    stats.map(stat => (

                        <div

                            key={stat.label}

                            className="bg-white rounded-3xl p-10 shadow-sm"

                        >

                            <h2 className="text-5xl font-bold text-primary">

                                {stat.number}

                            </h2>

                            <p className="mt-4">

                                {stat.label}

                            </p>

                        </div>

                    ))

                }

            </div>

        </section>

    )

}