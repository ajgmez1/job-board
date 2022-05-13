import React, { useState, useEffect, useContext } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import Header from '../Header';
import About from '../about/About';
import Map from './Map';
import Detail from './Detail';
import { JobsContext } from '../../context/JobsContext';


const Jobs = () => {
    const [bounds, setBounds] = useState(null);
    const { 
        setJobs,
        setSearching,
        setError
    } = useContext(JobsContext);

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
            <Header search={search} />
            <Routes>
                <Route exact path="/" element={ 
                    <Map setBounds={setBounds} bounds={bounds} />
                }/>
                <Route path="/about" element={<About />} />
                <Route path="/job/:jobId" element={<Detail />}/>
            </Routes>
        </Router>
    );
};

export default Jobs;