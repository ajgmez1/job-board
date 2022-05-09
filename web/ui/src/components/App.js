import React, { Component } from 'react';
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

class App extends Component {
    constructor(props) {
        super(props);
    
        this.state = { 
            jobs: [], 
            bounds: null,
            searching: true, 
            error: null 
        };
    }
    
    componentDidMount() {
        this.search();
    }

    onSearch = (e, searchVal = '') => {
        if (e) e.preventDefault();
        // const navigate  = useNavigate();

        this.setState({
            searching: true,
            jobs: [],
            error: null
        });

        // if (navigate.location.pathname !== '/') {
        //     navigate.push('/');
        // }
        
        this.search(searchVal);
    }

    search(v) {
        let url = `/api/jobs`;
        if (v) {
            url += `?search=${v}`;
        }

        return fetch(url)
            .then(r => r.json())
            .then((jobs) => {
                if (jobs.error) {
                    console.error(jobs.message);
                    this.setState({
                        searching: false,
                        jobs: [],
                        error: 'An error occurred.'
                    });
                } else {
                    this.setState({ 
                        searching: false, 
                        error: null,
                        jobs: jobs
                    });
                }
            });
    }

    setBounds = (bounds) => {
        this.setState({
            bounds: bounds
        });
    }

    render() {
        return (
            <Router>
                <Header onSearch={this.onSearch} searching={this.state.searching} />
                <Routes>
                    <Route exact path="/" element={ 
                        <Map searching={this.state.searching}
                            setStateBounds={this.setBounds} 
                            bounds={this.state.bounds}
                            jobs={this.state.jobs} 
                            error={this.state.error} />
                    }/>
                    
                    <Route path="/about" element={<Home/>} />

                    <Route path="/job/:jobId" element={
                        <Detail 
                            searching={this.state.searching} 
                            jobs={this.state.jobs}
                        />
                    }/>
                </Routes>
            </Router>
        );
    }
}

export default App;
