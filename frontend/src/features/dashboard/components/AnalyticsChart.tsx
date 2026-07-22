import{
ResponsiveContainer,
AreaChart,
Area,
XAxis,
Tooltip
}from"recharts"

const data=[

{day:"Mon",risk:41},

{day:"Tue",risk:52},

{day:"Wed",risk:38},

{day:"Thu",risk:61},

{day:"Fri",risk:49},

{day:"Sat",risk:68},

{day:"Sun",risk:55}

]

export default function AnalyticsChart(){

return(

<div className="bg-white rounded-3xl p-8 h-[420px]">

<h2 className="text-2xl font-bold mb-8">

Weekly Community Risk

</h2>

<ResponsiveContainer>

<AreaChart data={data}>

<XAxis dataKey="day"/>

<Tooltip/>

<Area dataKey="risk"/>

</AreaChart>

</ResponsiveContainer>

</div>

)

}