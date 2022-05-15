import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { JobsContext } from '../../context/JobsContext';

const MapMarker = (props) => {
    const { jobs, setJobs } = useContext(JobsContext);
    const popup = React.createRef();
    const icon = L.divIcon({ 
        className: 'jb-map-icon',
        html: '<i class="fa fa-map-marker fa-3x"></i>',
        iconSize: [20, 36],
        iconAnchor: [10, 34],
        popupAnchor: [0, -25],
    });

    const onHover = (id = '') => {
        setJobs(jobs.map((j) => ({
            ...j,
            selected: j.id === id
        })));
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

            L.DomEvent.addListener(popup.current, 'mouseover', () => onHover(id));
            marker.on('mouseover', () => onHover(id));
            marker.on('mouseout', () => {
                if (!marker.isPopupOpen()) {
                    onHover();
                }
            });

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