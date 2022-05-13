import React from 'react';

const Icon = (props) => {
    return (
        <div className="jb-icon jb-center">
            <i className={`fa fa-${props.type} fa-5x`}></i>        
            <h4> {props.children} </h4>
        </div> 
    );
}

export default Icon;