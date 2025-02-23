import React, { useState } from 'react';


import './brandsDetails.css';
import RegistrationHeader from "../../../components/registrationHeader/RegistrationHeader";
import RegistrationProgress from "../../../components/registrationProgress/RegistrationProgress";

import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

import { useNavigate } from 'react-router-dom';

const BrandsDetails = () => {

    const navigate=useNavigate();

    const brands = [
        "Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5",
        "Brand 6", "Brand 7", "Brand 8", "Brand 9", "Brand 10",
        "Brand 11", "Brand 12", "Brand 13", "Brand 14", "Brand 15",
    ];

    const categories = [
        { id: "1", name: "Trader / Wholesaler (No document required)" },
        { id: "2", name: "Authorized Dealer / Distributor (Attach brand certificate)" },
        { id: "3", name: "Brand owner (Attach brand ownership / trademark certificate)" },
    ];


    // State for 6 groups
    const [groups, setGroups] = useState([
        { brand: "", category: "", file: null },
        { brand: "", category: "", file: null },
        { brand: "", category: "", file: null },
        { brand: "", category: "", file: null },
        { brand: "", category: "", file: null },
        { brand: "", category: "", file: null },
    ]);

    // Handle brand selection
    const handleBrandChange = (index, value) => {
        const newGroups = [...groups];
        newGroups[index].brand = value;
        setGroups(newGroups);
    };

    // Handle category selection
    const handleCategoryChange = (index, value) => {
        const newGroups = [...groups];
        newGroups[index].category = value;
        newGroups[index].file = null; // Reset file when category changes
        setGroups(newGroups);
    };

    // Handle file selection
    const handleFileChange = (index, event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile && uploadedFile.type === "application/pdf") {
            const newGroups = [...groups];
            newGroups[index].file = uploadedFile;
            setGroups(newGroups);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    // Handle Save button click
    const handleSave = () => {
        // Check if all required fields are filled
        for (const group of groups) {
            if (group.category === "2" || group.category === "3") {
                if (!group.file) {
                    alert("Please upload a PDF file for all required categories.");
                    return;
                }
            }
        }

        // Debugging output (Replace this with API logic)
        console.log("Saving Data:", groups);
        alert("Data saved successfully!");
    };




    return (
        <div className="brand-details-section overflow-y-auto overflow-x-hidden vh-100">
            <div className="registration-header overflow-hidden">
                <RegistrationHeader />
            </div>
            <div className="registration-progress">
                <RegistrationProgress color="#1F8505" active="#fff" step={5} />
            </div>
            <div className="brand-details-main-section mt-5">

                <div className="row mb-3">
                    <div className="col-12 d-flex position-relative brand-details-top-heading-box">
                        <p className="brand-details-text">Select the brands that you would like to sell here:</p>
                        <p className="brand-details-skip">Skip <span><MdKeyboardArrowRight size={20} color='#1F8505' /></span></p>
                    </div>
                </div>
                <div className="brand-details-container">

                    <div className="row">
                        <div className='col-lg-2 col-md-1'></div>
                        <div className="col-lg-2 col-md-2 col-sm-3 col-3">
                            <p className="brand-detail-headers">Brand:</p>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-5">
                            <p className="brand-detail-headers">Type of association with the brand:</p>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-3 col-4">
                            <p className="brand-detail-headers">Upload required document:</p>
                        </div>
                        <div className="col-lg-1 col-md-1"></div>
                    </div>

                    {groups.map((group, index) => {
                        const isUploadAllowed = group.category === "2" || group.category === "3";

                        return (
                            <div key={index} className="row mt-2">
                                <div className="col-lg-2 col-md-1"></div>
                                {/* Brand Selection */}
                                <div className="col-lg-2 col-md-2 col-sm-3 col-3">
                                    <div className="brand-custom-select">
                                        <select value={group.brand} onChange={(e) => handleBrandChange(index, e.target.value)}>
                                            <option value="">Brand</option>
                                            {brands.map((brand, i) => (
                                                <option key={i} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Category Selection */}
                                <div className="col-lg-3 col-md-4 col-sm-6 col-5">
                                    <div className="brand-custom-select">
                                        <select value={group.category} className="w-100" onChange={(e) => handleCategoryChange(index, e.target.value)}>
                                            <option value="" >Choose Type of association</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Custom Upload Button */}
                                <div className="col-lg-4 col-md-4 col-sm-3 col-4 d-flex gap-4">
                                    <button
                                        onClick={() => document.getElementById(`fileInput-${index}`).click()}
                                        disabled={!isUploadAllowed}
                                        style={{
                                            backgroundColor: isUploadAllowed ? "#40444C" : "#ccc",
                                            color: "white",
                                            padding: "8px",
                                            border: "none",
                                            cursor: isUploadAllowed ? "pointer" : "not-allowed",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Uploud
                                    </button>

                                    {/* Display Selected File Name */}
                                    <div style={{ marginTop: "10px" }}>
                                        {group.file && <p className="mb-0">{group.file.name}</p>}
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    id={`fileInput-${index}`}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileChange(index, e)}
                                    disabled={!isUploadAllowed}
                                />
                                <div className="col-lg-1 col-md-1"></div>

                            </div>
                        );
                    })}

                    <div className="row my-3">
                        <div className='col-2'></div>
                        <div className="col-10 d-flex justify-content-start">
                            <button className="brand-pickup-btn ms-3">
                                <span><IoIosAddCircleOutline size={19} color='#fff' /></span>
                                Add more brands </button>
                        </div>
                    </div>


                    <div className="row my-4">
                        <div className="col-lg-12 col-md-12 col-12 d-flex justify-content-evenly">
                            <button className="back-btn">Back</button>
                            <button className="save-btn">Save</button>
                            <button className="next-btn" onClick={()=>navigate("/review-status")}>Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BrandsDetails;