import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


interface LiveTrackingMapProps {
  location: {
    lat: number;
    lng: number;
  };
  busInfo: {
    id: string;
    name: "BUS-001" | "BUS-002" | "BUS-003";
  };
}

const LiveTrackingMap = ({ location, busInfo }: LiveTrackingMapProps) => {
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">Waiting for location data...</p>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[location.lat, location.lng]} 
      zoom={15} 
      scrollWheelZoom={false} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lng]}>
        <Popup>
          <b>{busInfo.name}</b> is currently here. <br /> Last updated: {new Date().toLocaleTimeString()}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LiveTrackingMap;