export default function WeatherCard(){

return(

<div className="rounded-3xl bg-[#243447] text-white p-8">

<h2 className="text-2xl">

Today's Weather

</h2>

<h1 className="text-6xl mt-8">

18°

</h1>

<p className="mt-3">

Cloudy

</p>

<div className="mt-10 space-y-3">

<p>Humidity 68%</p>

<p>Wind 17 km/h</p>

<p>Rain 22%</p>

</div>

</div>

)

}