import React from "react";
import './loader.css';


const Loader = ({ message = "Loading..." }) => {

    return (
        <div className="loader-overlay">
            <div className="loader-box">
                <div className="spinner-border me-3" role="status" style={{color:"#1f8505"}}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="fs-5 fw-semibold text-dark">{message}</span>
            </div>
        </div>
    );
};

export default Loader;