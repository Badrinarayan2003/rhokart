import { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FiDownload, FiUpload } from "react-icons/fi";
import "./inventoryPricing.css";

const BulkUploadOrUpdate = () => {

    const [selectedFiles, setSelectedFiles] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleFileChange = (event, item) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles((prev) => ({
                ...prev,
                [item]: file.name,
            }));
        }
    };

    return (
        <div className="bulkupload-update-page">
            <div className="row mb-2 mt-3">
                <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
                    <div className="update-portal-box d-flex flex-wrap align-items-center">
                        <label className="me-2">Category L1</label>
                        <select>
                            <option value="">Select</option>
                            <option value="">Electrical one Category L1</option>
                            <option value="">Electronics two Category L1</option>
                            <option value="">Metrics three Category L1</option>
                            <option value="">Aluminium four Category L1</option>
                        </select>
                    </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
                    <div className="update-portal-box d-flex flex-wrap align-items-center">
                        <label className="me-2">Category L2</label>
                        <select>
                            <option value="">Select</option>
                            <option value="">Electrical one Category L2</option>
                            <option value="">Electronics two Category L2</option>
                            <option value="">Metrics three Category L2</option>
                            <option value="">Aluminium four Category L2</option>
                        </select>
                    </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
                    <div className="update-portal-box d-flex flex-wrap align-items-center">
                        <label className="me-2">Category L3</label>
                        <select>
                            <option value="">Select</option>
                            <option value="">Electrical one Category L3</option>
                            <option value="">Electronics two Category L3</option>
                            <option value="">Metrics three Category L3</option>
                            <option value="">Aluminium four Category L3</option>
                        </select>
                    </div>
                </div>
            </div>



            <div className="row">
                <div className="col-12">
                    <p
                        className="toggle-btn bulk-uploud-item-name"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        Wires and Cables
                        {isCollapsed ? <FaCaretUp size={22} /> : <FaCaretDown size={22} />}

                    </p>

                    {/* Collapsible Section */}
                    {isCollapsed && (
                        <div className="card card-body" style={{ padding: "15px", border: "1px solid #000", borderRadius: "5px" }}>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="row d-flex align-items-center justify-content-around mb-2" style={{ borderBottom: "1px solid #000", paddingBottom: "10px" }}>
                                    {/* File Name Display */}
                                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 mb-2">
                                        <span className="bulk-up-file-name d-flex">Single & Twin core wire SKUs {item}</span>
                                    </div>

                                    {/* Download Button */}
                                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 mb-2">
                                        <a href="#" className="bulk-uploud-download-btn d-flex">
                                            Download available SKUs list template <span> <FiDownload color="#fff" size={19} /></span>
                                        </a>
                                    </div>

                                    {/* Upload Button */}
                                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 mb-2">
                                        <label className="bulk-uploud-upload-btn">
                                            {selectedFiles[item] || "Upload inventory and pricing of your items"}<span> <FiUpload color="#fff" size={18} /></span>
                                            <input
                                                type="file"
                                                accept=".pdf, .xls, .xlsx"
                                                hidden
                                                onChange={(e) => handleFileChange(e, item)}
                                            />
                                        </label>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="row" style={{ marginTop: '4rem' }}>
                <div className="col-12">
                    <div className="update-portal-btns-box d-flex justify-content-start flex-wrap">
                        <button className="update-portal-btn update-btns-clear">Download all Templates <span> <FiDownload color="#fff" size={19} /></span></button>
                        <button className="update-portal-btn update-btns-submit">Submit</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BulkUploadOrUpdate;