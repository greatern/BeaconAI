type Props = {

    title:string

    value:string

    colour:string

}

export default function RiskCard({title,value}:Props){

return(

<div className="bg-white rounded-3xl p-8 shadow-sm">

<p className="text-stone-500">

{title}

</p>

<h2 className="text-5xl font-bold mt-5">

{value}

</h2>

</div>

)

}