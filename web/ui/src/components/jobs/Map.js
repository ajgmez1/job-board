import React from 'react';
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

class JobsMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            section: {
                hidden: '',
                icon: 'left'   
            },
            refresh: 'hidden',
            map: null,
            jobs: this.props.jobs
        };
        this.group = L.markerClusterGroup();
    }

    asideControl = (cb) => {
        this.setState(prevState => ({
            section: prevState.section.hidden ? {
                hidden: '',
                icon: 'left'
            } : {
                hidden: 'hidden',
                icon: 'right'
            }
        }), () => {
            if (typeof cb === 'function') cb();
        });
    }

    resetControl = () => {
        if (this.state.section.hidden) {
            this.asideControl(() => {
                this.centerMap(this.group.getBounds());
            });
        } else {
            this.centerMap(this.group.getBounds());
        }
    }

    onSidebarClick = (markerData) => {
        let markers = this.group.getLayers(),
            marker = markers.find((m) => m.options.id === markerData.id);

        if (marker) {
            if (this.state.section.hidden) {
                this.asideControl(() => {
                    this.state.map.invalidateSize();
                    this.centerAndOpenPopup(marker);
                });
            } else {
                this.centerAndOpenPopup(marker);
            }
        }
    }

    onMarkerHover = (id) => {
        this.setState((prevState) => {
            const jobs = prevState.jobs.map((j) => ({
                ...j,
                selected: false
            }));

            if (id) {
                jobs.find((j) => j.id === id).selected = true;   
            }
                
            return {
                jobs: jobs
            };
        });
    }

    centerAndOpenPopup(marker) {
        this.centerMap(marker.__parent.getBounds(), () => {
            this.recursiveZoomOrSpiderfy(marker);
        });
    }

    recursiveZoomOrSpiderfy(marker) {
        let parent = marker.__parent,
            group = parent._group;

        if (marker.getElement()) {
            marker.openPopup();
        } else {
            group.once('animationend', () => {
                this.recursiveZoomOrSpiderfy(marker);
            });
            group._zoomOrSpiderfy({layer: parent});
        }
    }

    centerMap(bounds, cb) {
        if (bounds.isValid()) {
            if (cb) this.state.map.once('moveend', cb);
            this.state.map.fitBounds(bounds);
        }
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.searching && !this.props.searching) {
            this.centerMap(this.group.getBounds());
        }

        if (this.props.jobs.length === 0) {
            this.group.clearLayers();
        }
        
        this.state.map.invalidateSize();
    }
    
    componentDidMount() {       
        const map = L.map('map', {
            center: [0, 0],
            zoom: 2,
            maxZoom: 14
        });

        this.setState({
            map: map
        }, () => {
            this.group.addTo(this.state.map);

            map.on('moveend', () => {
                const { x, y } = map.getSize();
                const bounds = {
                    map: map.getBounds(),
                    group: this.group.getBounds()
                };
                if (x && y) {
                    this.setState({ // only show markers that are within the current map bounds
                        jobs: this.props.jobs.filter((j) => j.lat && map.getBounds().contains(L.latLng(j.lat, j.lng))),
                        refresh: bounds.group.lat && map.getBounds().contains(this.group.getBounds()) ? 'hidden' : ''
                    });
                    this.props.setStateBounds(map.getBounds());
                }
            });

            if (this.props.bounds) {
                this.centerMap(this.props.bounds);
            }
        });
    }
    
    render() {
        return (
            <React.Fragment>
                <main className="jb-main jb-fill jb-row">
                    <Message searching={this.props.searching} error={this.props.error} />
                    <div className="jb-controls">
                        <Control icon={`angle-double-${this.state.section.icon}`} control={this.asideControl} className="jb-hide-control" />
                        <Control icon="refresh" control={this.resetControl} className={`jb-${this.state.refresh}`} />
                    </div>
                    <section className={`jb-fill jb-column jb-${this.state.section.hidden}`}>
                        <div className="jb-fill" id="map">
                        </div>
                        {this.state.map && 
                            <React.Fragment>
                                <MapLayer map={this.state.map} />
                                {this.props.jobs.map((m) => 
                                    <MapMarker {...m} group={this.group} key={m.id} onHover={this.onMarkerHover} /> 
                                )}
                            </React.Fragment>
                        }
                    </section>
                    <Sidebar jobs={this.state.jobs} onClick={this.onSidebarClick} />
                </main>
            </React.Fragment>
        );
    }
} 

export default JobsMap;
