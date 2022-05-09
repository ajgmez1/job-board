import React from 'react';
import { useMatch } from "react-router-dom";
import Message from './Message';

const JobsDetail = (props) => {
    const match = useMatch("/job/:jobId");
    const job = props.jobs.find((j) => j.id === +match.params.jobId); 
    return (
        <main className="jb-fill jb-row">
            {job ? 
                <section className="jb-main jb-content jb-detail">
                    <h1><a>{job.title}</a></h1>
                    <br/>
                    <h4>{job.company} - {job.location} </h4>
                    <br/>
                    <h5> Posted: {job.created_at} - {job.type} </h5>
                    <br/>
                    <div className="jb-html" dangerouslySetInnerHTML={{__html: job.description}} />
                </section>
            : <Message searching={props.searching} error={'Job not found.'} />}
        </main>
)};

export default JobsDetail;