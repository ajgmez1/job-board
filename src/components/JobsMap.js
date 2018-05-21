import React from 'react';
import L from 'leaflet';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant.js';
import 'leaflet/dist/leaflet.css';

import Header from './Header';
import JobsMessage from './JobsMessage';
import MapLayer from './MapLayer';
import JobsControl from './JobsControl';
import MapMarker from './MapMarker';
import JobsSidebar from './JobsSidebar';

class JobsMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            header: 'hidden', 
            aside: {
                display: '',
                icon: 'left'   
            }, 
            map: null };
        this.group = L.markerClusterGroup();
    }

    headerControl = () => {
        this.setState(prevState => ({
            header: prevState.header ? '' : 'hidden'
        }));
    }

    asideControl = () => {
        this.setState(prevState => ({
            aside: prevState.aside.display ? {
                display: '',
                icon: 'left'
            } : {
                display: 'fixed',
                icon: 'right'
            }
        }));
    }

    onSidebarClick = (markerData) => {
        let markers = this.group.getLayers(),
            marker = markers.find((m) => m.options.id === markerData.id);

        if (marker) {
            this.centerMap(marker.__parent.getBounds(), () => {
                this.recursiveZoomOrSpiderfy(marker);
            });
        }

        if (this.state.aside.display) {
            this.asideControl();
        }
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
        this.setState({
            map: L.map('map', {
                center: [0, 0],
                zoom: 2,
                maxZoom: 14
            })
        }, () => {
            this.group.addTo(this.state.map);

            if (this.props.jobs.length) {
                this.centerMap(this.group.getBounds());
            }
        });
    }
    
    render() {
        return (
            <React.Fragment>

                <Header className="jb-job-header" 
                    nav="hidden" 
                    display={this.state.header} 
                    onSearch={this.props.onSearch}
                    formSearch={this.props.formSearch} 
                    searching={this.props.searching} />

                <main className="jb-main jb-fill jb-row">
                    {(this.props.searching || this.props.error) && <JobsMessage error={this.props.error}/>}
                    <div className="jb-controls">
                        <JobsControl icon="search" control={this.headerControl} />
                        <JobsControl icon={`angle-double-${this.state.aside.icon}`} control={this.asideControl} />
                    </div>
                    <section className="jb-fill jb-column">
                        <div className="jb-fill" id="map">
                        </div>
                        {this.state.map && 
                            <React.Fragment>
                                <MapLayer map={this.state.map} />
                                {this.props.jobs.map((m) => 
                                    <MapMarker {...m} group={this.group} key={m.id} /> 
                                )}
                            </React.Fragment>
                        }
                    </section>
                    <JobsSidebar jobs={this.props.jobs} onClick={this.onSidebarClick} display={this.state.aside.display} />
                </main>

            </React.Fragment>
        );
    }
} 

export default JobsMap;
