import React, { useContext } from 'react';
import { JobsContext } from '../../context/JobsContext';

const Message = () => {
    const { searching, error } = useContext(JobsContext);
    return (
        <div>
            {searching ? 
                <div className="jb-message">
                    <i className="fa fa-spinner fa-5x"></i>
                </div>
            : error && 
                <div className="jb-message">
                    <h2> <i className="fa fa-exclamation-triangle"></i> {error} </h2>
                </div>
            }
        </div>
    );
};

export default Message;