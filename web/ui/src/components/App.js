import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate
} from 'react-router-dom';

import 'font-awesome/css/font-awesome.min.css';
import '../styles/App.css';

import Header from './Header';
import Home from './home/Home';
import Map from './jobs/Map';
import Detail from './jobs/Detail';

const App = () => {    
    const [jobs, setJobs] = useState([]);
    const [bounds, setBounds] = useState(null);
    const [searching, setSearching] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        search();
    }, []);

    const onSearch = (e, searchVal = '') => {
        if (e) e.preventDefault();
        // const navigate  = useNavigate();
        
        setSearching(true);
        setJobs([]);
        setError(null);

        // if (navigate.location.pathname !== '/') {
        //     navigate.push('/');
        // }
        
        search(searchVal);
    };

    const search = (v) => {
        let url = `/api/jobs`;
        if (v) {
            url += `?search=${v}`;
        }

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
            <Header onSearch={onSearch} searching={searching} />
            <Routes>
                <Route exact path="/" element={ 
                    <Map searching={searching}
                        setStateBounds={setBounds} 
                        bounds={bounds}
                        jobs={jobs}
                        error={error} />
                }/>
                
                <Route path="/about" element={<Home/>} />

                <Route path="/job/:jobId" element={
                    <Detail 
                        searching={searching} 
                        jobs={jobs}
                    />
                }/>
            </Routes>
        </Router>
    );
}

export default App;
