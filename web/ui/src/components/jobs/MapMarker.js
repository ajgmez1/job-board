import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';

const MapMarker = (props) => {
    const popup = React.createRef();
    const icon = L.divIcon({ 
        className: 'jb-map-icon',
        html: '<i class="fa fa-map-marker fa-3x"></i>',
        iconSize: [20, 36],
        iconAnchor: [10, 34],
        popupAnchor: [0, -25],
    });

    const onHover = (id = '') => {
        const jobs = props.jobs.map((j) => ({
            ...j,
            selected: j.id === id
        }));
        
        props.setJobs(jobs);
    };

    useEffect(() => {
        let { lat, 
            lng, 
            group,
            id } = props;

        if (lat && lng) {
            let marker = L.marker([lat, lng], {
                id: id,
                icon: icon
            }).bindPopup(popup.current);

            marker.on('mouseover', () => onHover(id));
            marker.on('mouseout', () => {
                if (!marker.isPopupOpen()) {
                    onHover();
                }
            });
            marker.on('popupopen', () => onHover(id));
            marker.on('popupclose', () => onHover());

            group.addLayer(marker);
        }
    }, []);

    return (
        <div className='jb-popup'>
            <div ref={popup}>
                <Link to={`/job/${props.id}`}>{props.title}</Link>
                <p> {props.company} - {props.location} </p>
            </div>
        </div>
    );
}

export default MapMarker;