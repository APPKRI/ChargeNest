import { MapContainer, TileLayer } from 'react-leaflet';

function MiniMap() {

return(

<MapContainer

center={[22.9734,78.6569]}

zoom={5}

style={{

height:"300px",

width:"100%",

borderRadius:"15px"

}}

>

<TileLayer

url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>

</MapContainer>

)

}

export default MiniMap;