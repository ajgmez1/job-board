import { useEffect } from 'react';
import L from 'leaflet';

const MapLayer = (props) => {
    useEffect(() => {
        L.gridLayer.googleMutant({
            styles: [
                {featureType: 'water', stylers: [{color: '#7f7f7f'}]},
                {featureType: 'landscape', stylers: [{color: '#eeeeee'}]},
                {featureType: 'poi', stylers: [{visibility: 'off'}]},
                {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#dddddd'}]}
            ],
            type: 'roadmap'
        }).addTo(props.map);
    }, []);

    return (null);
}

export default MapLayer;