import React from 'react';
import L from 'leaflet';

class MapLayer extends React.Component {
    componentDidMount() {
        L.gridLayer.googleMutant({
            styles: [
                {featureType: 'water', stylers: [{color: '#7f7f7f'}]},
                {featureType: 'landscape', stylers: [{color: '#eeeeee'}]},
                {featureType: 'poi', stylers: [{visibility: 'off'}]},
                {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#dddddd'}]}
            ],
            type: 'roadmap'
        }).addTo(this.props.map);
    }

    render() {
        return (null);
    }
}

export default MapLayer;