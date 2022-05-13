import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import 'font-awesome/css/font-awesome.min.css';
import '../styles/App.css';

import Header from './Header';
import About from './about/About';
import Map from './jobs/Map';
import Detail from './jobs/Detail';

const App = () => {
    return (
        <Jobs />
    );
};
const Jobs = () => {    
    const [jobs, setJobs] = useState([]);
    const [bounds, setBounds] = useState(null);
    const [searching, setSearching] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        search();
    }, []);

    const search = (v) => {
        let url = `/api/jobs`;
        if (v) {
            url += `?search=${v}`;
        }

        setSearching(true);
        setJobs([]);
        setError(null);

        return fetch(url)
            .then(r => r.json())
            .then((jobs) => {
                setSearching(false);
                if (jobs.error) {
                    console.error(jobs.message);
                    setError('An error occurred.');
                    setJobs([]);
                } else {
                    setError(null);
                    setJobs(jobs);
                }
            });
    };

    return (
        <Router>
            <Header search={search} searching={searching} />
            <Routes>
                <Route exact path="/" element={ 
                    <Map searching={searching}
                        setBounds={setBounds} 
                        bounds={bounds}
                        jobs={jobs}
                        setJobs={setJobs}
                        error={error} />
                }/>
                
                <Route path="/about" element={<About />} />

                <Route path="/job/:jobId" element={
                    <Detail 
                        searching={searching} 
                        jobs={jobs}
                    />
                }/>
            </Routes>
        </Router>
    );
};

export default App;
