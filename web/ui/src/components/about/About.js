import React from 'react';

import Banner from './Banner';
import Icon from './Icon';
import Footer from '../Footer';

const About = () => (
    <React.Fragment>
        <main>
            <Banner> 
                <Icon type="google">
                    Map tile layer from the Google Maps
                    <a href="https://cloud.google.com/maps-platform/"> Platform</a>.
                </Icon>
                <Icon type="leaf">
                    Using the mobile-friendly interactive Maps library,
                     <a href="https://leafletjs.com/"> Leaflet</a>.
                </Icon>
                <Icon type="github">
                    The best jobs. Random data composed from <a href="https://random-data-api.com/documentation"> here </a> and <a href="https://corpora-api.glitch.me/"> here. </a>
                </Icon>

                <div className="jb-row jb-top">
                    <div className="jb-left">
                        <h1>Job viewing</h1>
                        <h2>on a map.</h2>
                        <br />
                    </div>
                    <div className="jb-right">
                        <i className="fa fa-map-o fa-5x"></i>
                    </div>
                </div>
                
                <div className="jb-row jb-top jb-next">
                    <section className="jb-main jb-content">
                        <div className="jb-about">
                            Unfortunately <a href="https://jobs.github.com/">GitHub Jobs</a> was sunset in August 2021, so I've replaced the API with
                            random data.
                        </div>
                    </section>
                </div>
            </Banner>
            <Footer />
        </main>
    </React.Fragment>
);

export default About;