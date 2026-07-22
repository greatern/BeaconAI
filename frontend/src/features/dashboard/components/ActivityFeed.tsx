const data=[

"Power outage reported in Sandton",

"Flood warning updated",

"Road closure reported",

"Traffic congestion detected",

"Community alert issued"

]

export default function ActivityFeed(){

return(

<div className="bg-white rounded-3xl p-8">

<h2 className="text-2xl font-bold">

Recent Activity

</h2>

<div className="space-y-5 mt-8">

{data.map(item=>(

<div key={item}>

{item}

</div>

))}

</div>

</div>

)

}