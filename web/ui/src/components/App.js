import React from 'react';

import 'font-awesome/css/font-awesome.min.css';
import '../styles/App.css';

import Jobs from './jobs/Jobs';
import { JobsProvider } from '../context/JobsContext';

const App = () => {
    return (
        <JobsProvider>
            <Jobs />
        </JobsProvider>
    );
};


export default App;
