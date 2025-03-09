import React from "react";
import './loader.css';


const Loader = ({ message = "Loading..." }) => {

    return (
        <div className="loader-overlay">
            <div className="loader-box">
                <div className="spinner-border text-primary me-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="fs-5 fw-semibold text-dark">{message}</span>
            </div>
        </div>
    );
};

export default Loader;