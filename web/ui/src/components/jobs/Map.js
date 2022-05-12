import React, { useEffect, useState } from 'react';
import L from 'leaflet';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant.js';
import 'leaflet/dist/leaflet.css';

import Message from './Message';
import MapLayer from './MapLayer';
import Control from './Control';
import MapMarker from './MapMarker';
import Sidebar from './Sidebar';

const JobsMap = (props) => {
    const [section, setSection] = useState({ hidden: '', icon: 'left' });
    const [refresh, setRefresh] = useState('hidden');
    const [map, setMap] = useState(null);
    const [group, setGroup] = useState(L.markerClusterGroup());

    const asideControl = (cb) => {
        setSection(section.hidden ? 
            { hidden: '', icon: 'left' } : 
            { hidden: 'hidden', icon: 'right' }
        );
        if (typeof cb === 'function') cb();
    };

    const resetControl = () => {
        if (section.hidden) {
            asideControl(() => {
                centerMap(group.getBounds());
            });
        } else {
            centerMap(group.getBounds());
        }
    };

    const centerMap = (bounds, cb) => {
        if (bounds.isValid() && map) {
            if (cb) map.once('moveend', cb);
            map.fitBounds(bounds);
        }
    };
    
    useEffect(() => {       
        const map = L.map('map', {
            center: [0, 0],
            zoom: 2,
            maxZoom: 14
        });
        
        group.addTo(map);

        map.on('moveend', () => {
            const { x, y } = map.getSize();
            const bounds = {
                map: map.getBounds(),
                group: group.getBounds()
            };

            if (x && y) {
                setRefresh(bounds.group.lat && bounds.map.contains(bounds.group) ? 'hidden' : '')
                props.setStateBounds(bounds.map);
            }
        });
        
        setGroup(group);
        setMap(map);

        if (props.bounds) {
            centerMap(props.bounds);
        }
    }, []);

    useEffect((prevProps) => {
        // if (prevProps.searching && !props.searching) {
        //     centerMap(group.getBounds());
        // }

        if (props.jobs.length === 0 && group) {
            group.clearLayers();
        }
        
        if (map) {
            map.invalidateSize();
        }
    });

    return (
        <React.Fragment>
            <main className="jb-main jb-fill jb-row">
                <Message searching={props.searching} error={props.error} />
                <div className="jb-controls">
                    <Control icon={`angle-double-${section.icon}`} control={asideControl} className="jb-hide-control" />
                    <Control icon="refresh" control={resetControl} className={`jb-${refresh}`} />
                </div>
                <section className={`jb-fill jb-column jb-${section.hidden}`}>
                    <div className="jb-fill" id="map">
                    </div>
                    {map && 
                        <React.Fragment>
                            <MapLayer map={map} />
                            {props.jobs.map((m) => 
                                <MapMarker {...m} group={group} key={m.id} jobs={props.jobs} setJobs={props.setJobs} /> 
                            )}
                        </React.Fragment>
                    }
                </section>
                <Sidebar jobs={props.jobs} map={map} group={group} section={section}
                    centerMap={centerMap}
                    asideControl={asideControl}
                 />
            </main>
        </React.Fragment>
    );
} 

export default JobsMap;
