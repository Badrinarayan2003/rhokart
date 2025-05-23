import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import '../orders.css';
import { FaDownload, FaInfoCircle, FaTimes, FaUpload } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AWS_MULTIPART_DOC_UPLOAD_URL, BASE_URL } from "../../../../config/urls";
import Loader from "../../../../components/loader/Loader";

const PackedTbl = () => {
    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [transportDetails, setTransportDetails] = useState({
        transportName: '',
        transportMobile: '',
        vehicleNo: '',
        driverMobile: '',
        transportEmail: '',
        challanImageUrl: ''
    });
    const [uploading, setUploading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        transportEmail: '',
        transportMobile: '',
        driverMobile: ''
    });
    const [uploadError, setUploadError] = useState('');
    const [transportError, setTransportError] = useState('');

    const sellerId = useSelector((state) => state.auth?.sellerId);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        // Indian phone number validation (10 digits starting with 6-9)
        const re = /^[6-9]\d{9}$/;
        return re.test(phone);
    };
    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://sellerapi.rhoselect.com/orderprocess/packed?sellerId=${sellerId}`);
                console.log(response, "packed");

                if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.packingDetails) {
                    setLoading(false);
                    const mappedData = response?.data?.coreData?.responseData?.packingDetails.map((order, index) => ({
                        slNo: index + 1,
                        orderId: order.order?.orderId,
                        buyerName: order.order?.buyerName,
                        fillRate: order.order?.fillRate,
                        noOfBoxes: order.order?.noOfBoxes,
                        orderDate: order.order?.orderDate,
                        orderPackedDate: order.order?.orderPackedDate,
                        orderPackedTime: order.order?.orderPackedTime,
                        orderTime: order.order?.orderTime,
                        orderValue: order.order?.orderValue,
                        packedValue: order.order?.packedValue,
                        rhokartBuyerInvoice: order.order?.rhokartBuyerInvoice,
                        rhokartSellerInvoiceNumber: order.order?.rhokartSellerInvoiceNumber,
                        rtsTime: order.order?.rtsTime,
                        sellerInvoiceNumber: order.order?.sellerInvoiceNumber,
                        shippingAddress: order.order?.shippingAddress,
                        totalPackedQty: order.order?.totalPackedQty,
                        transportStatus: order.transportStatus,
                        isChanged: false
                    }));
                    setRowData(mappedData);
                    setOriginalData(mappedData);
                }
            } catch (error) {
                console.log("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle confirm pickup button click
    const handleDetailsClick = (orderId, buyerName, shippingAddress) => {
        setCurrentOrder({
            orderId,
            buyerName,
            shippingAddress
        });
        setTransportDetails({
            transportName: '',
            transportMobile: '',
            vehicleNo: '',
            driverMobile: '',
            transportEmail: '',
            challanImageUrl: ''
        });
        setModalShow(true);
    };

    // Handle input changes for transport details
    const handleTransportChange = (e) => {
        const { name, value } = e.target;
        setTransportDetails(prev => ({
            ...prev,
            [name]: value
        }));
        setTransportError('');
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle file upload button click
    const handleUploadButtonClick = () => {
        setUploadError('');
        setTransportError('');
        document.getElementById('challanUpload').click();
    };

    // Handle file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset any previous error
        setUploadError('');
        setUploading(true);
        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await axios.post(`${AWS_MULTIPART_DOC_UPLOAD_URL}`, formData);
            console.log(response, "of the multipart in packed popup");

            if (response.data?.response?.rcode === 0 && response.data?.response?.coreData?.responseData?.uploadedFiles?.length > 0) {
                const imageUrl = response?.data?.response?.coreData?.responseData?.uploadedFiles[0].url;
                console.log(imageUrl, "this is image url");

                setTransportDetails(prev => ({
                    ...prev,
                    challanImageUrl: imageUrl
                }));
            } else {
                setUploadError(response.data?.response?.rmessage || 'Failed to upload file. Please try again.');
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadError('Failed to upload transport challan. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Handle form submission
    const handleSubmitTransportDetails = async () => {
        console.log("click")
        // First validate all fields
        const errors = {};

        if (!transportDetails.transportName) {
            errors.transportName = 'Transporter Name is required';
        }

        if (!transportDetails.transportMobile) {
            errors.transportMobile = 'Transporter Mobile is required';
        } else if (!validatePhone(transportDetails.transportMobile)) {
            errors.transportMobile = 'Please enter a valid 10-digit mobile number';
        }

        if (!transportDetails.driverMobile) {
            errors.driverMobile = 'Driver Mobile is required';
        } else if (!validatePhone(transportDetails.driverMobile)) {
            errors.driverMobile = 'Please enter a valid 10-digit mobile number';
        }

        if (transportDetails.transportEmail && !validateEmail(transportDetails.transportEmail)) {
            errors.transportEmail = 'Please enter a valid email address';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setSubmitLoading(true);
        try {
            const payload = {
                orderId: currentOrder.orderId,
                sellerId: sellerId,
                transportName: transportDetails.transportName,
                transportMobile: transportDetails.transportMobile,
                vehicleNo: transportDetails.vehicleNo,
                driverMobile: transportDetails.driverMobile,
                transportEmail: transportDetails.transportEmail,
                challanImageUrl: transportDetails.challanImageUrl
            };
            console.log(payload, "payload of  transport");
            const response = await axios.post(`${BASE_URL}/order/transportupdate`, payload);
            if (response.data?.rcode === 0) {
                // alert("Transport details submitted successfully!");
                console.log(response, "submit transport");
                setModalShow(false);
            } else {
                console.log(response.data?.rmessage || "Failed to submit transport details");
                setTransportError(response.data?.rmessage || "Failed to submit transport details")
            }
        } catch (error) {
            console.error("Error submitting transport details:", error);
            setTransportError(error.message || "Error submitting transport details:");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handle download button click
    const handleDownload = (invoiceId) => {
        console.log(`Downloading documents for order ${invoiceId}`);
    };

    // Handle submit changes
    const handleSubmitChanges = () => {
        const changedRows = rowData.filter(row => row.isChanged);
        console.log("Changed rows:", changedRows);
        alert(`${changedRows.length} order(s) updated successfully!`);
    };

    // Column definitions for the orders table
    const [columnDefs] = useState([
        {
            headerName: "SL No.",
            field: "slNo",
            sortable: true,
            width: 90
        },
        {
            headerName: "Order ID",
            field: "orderId",
            sortable: true,
            filter: true,
            cellStyle: { fontWeight: 'bold' },
            width: 180
        },
        {
            headerName: "Order value (INR)",
            field: "orderValue",
            sortable: true,
            filter: true,
            width: 180
        },
        {
            headerName: "Packed value (INR)",
            field: "packedValue",
            sortable: true,
            filter: true,
            width: 180
        },
        {
            headerName: "Fill rate",
            field: "fillRate",
            sortable: true,
            filter: true,
            width: 140
        },
        {
            headerName: "Take action",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <p
                        className="mb-0 text-danger fw-bold"
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => handleDetailsClick(params.data.orderId, params.data.buyerName, params.data.shippingAddress)}
                    >
                        Enter transport Info
                    </p>
                </div>
            ),
            width: 180
        },
        {
            headerName: "Order date",
            field: "orderDate",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 240
        },
        {
            headerName: "Order time",
            field: "orderTime",
            sortable: true,
            filter: 'agNumberColumnFilter',
            // valueFormatter: params => params.value.toFixed(2),
            width: 240
        },
        {
            headerName: "Order pack date",
            field: "orderPackedDate",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 160
        },
        {
            headerName: "Order pack time",
            field: "orderPackedTime",
            width: 150
        },
        {
            headerName: "RTS time (days)",
            field: "rtsTime",
            width: 150
        },
        {
            headerName: "Total packed qty",
            field: "totalPackedQty",
            sortable: true,
            filter: true,
            width: 160
        },
        {
            headerName: "No. of boxes",
            field: "noOfBoxes",
            sortable: true,
            filter: true,
            width: 160
        },
        {
            headerName: "Rhokart buyer invoice",
            sortable: true,
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    {params.data.rhokartBuyerInvoice ? (
                        <button
                            className="btn btn-sm"
                            style={{ fontSize: "12px", border: "1px solid #1F8505", color: '#1F8505' }}
                            onClick={() => handleDownload(params.data.rhokartBuyerInvoice)}
                        >
                            <FaDownload /> {params.data.rhokartBuyerInvoice}
                        </button>
                    ) : (
                        <span className="text-muted">Invoice is not available</span>
                    )}
                </div>
            ),
            filter: true,
            width: 260
        },
        {
            headerName: "Shipping address",
            field: "shippingAddress",
            sortable: true,
            filter: true,
            width: 400
        },
        // {
        //     headerName: "Take action",
        //     cellRenderer: (params) => (
        //         <div className="d-flex justify-content-center align-items-center h-100">
        //             {
        //                 params.data.transportStatus === "Enter transport Info" ?
        //                     <p
        //                         className="mb-0 text-danger fw-bold"
        //                         style={{ textDecoration: 'underline', cursor: 'pointer' }}
        //                         onClick={() => handleDetailsClick(params.data.orderId, params.data.buyerName, params.data.shippingAddress)}
        //                     >
        //                         {params.data.transportStatus}
        //                     </p>
        //                     :
        //                     <p className="transport-status-info mb-0 text-danger">{params.data.transportStatus}</p>
        //             }

        //         </div>
        //     ),
        //     width: 180
        // },
        {
            headerName: "Seller invoice number (if any)",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    {params.data.sellerInvoiceNumber ? (
                        <button
                            className="btn btn-sm"
                            style={{ fontSize: "12px", border: "1px solid #1F8505", color: '#1F8505' }}
                            onClick={() => handleDownload(params.data.sellerInvoiceNumber)}
                        >
                            <FaDownload /> {params.data.sellerInvoiceNumber}
                        </button>
                    ) : (
                        <span className="text-muted">Invoice is not available</span>
                    )}
                </div>
            ),
            sortable: true,
            filter: true,
            width: 180
        },
        {
            headerName: "Rhokart seller invoice",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    {params.data.rhokartSellerInvoiceNumber ? (
                        <button
                            className="btn btn-sm"
                            style={{ fontSize: "12px", border: "1px solid #1F8505", color: '#1F8505' }}
                            onClick={() => handleDownload(params.data.rhokartSellerInvoiceNumber)}
                        >
                            <FaDownload /> {params.data.rhokartSellerInvoiceNumber}
                        </button>
                    ) : (
                        <span className="text-muted">Invoice is not available</span>
                    )}
                </div>
            ),
            sortable: true,
            filter: true,
            width: 180
        },


    ]);

    // Check if submit button should be disabled
    const isSubmitDisabled = !transportDetails.transportName ||
        !transportDetails.transportMobile ||
        !transportDetails.driverMobile ||
        submitLoading ||
        uploading; // Added uploading state to disable during upload

    return (
        <>
            {loading && <Loader message="Loading Orders..." />}
            <div className="ag-theme-alpine mt-4" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    suppressCellFocus={true}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: true
                    }}
                    suppressScrollOnNewData={true}
                />
            </div>

            {/* Submit button for changes */}
            {/* <div className="mt-3 text-end">
                <button
                    className="btn btn-primary"
                    onClick={handleSubmitChanges}
                    disabled={!rowData.some(row => row.isChanged)}
                >
                    Submit
                </button>
            </div> */}

            {/* Transport Details Modal */}
            <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header justify-content-center bg-light">
                            <h5 className="modal-title text-center fw-bold">Transport Details</h5>
                        </div>
                        <div className="modal-body d-flex flex-column">
                            {/* Order Information Section */}
                            <div className="mt-5 mb-2 row border rounded">
                                <div className="col-12">
                                    <p className="mb-1"><strong>Order Number:</strong> {currentOrder?.orderId}</p>
                                </div>
                                <div className="col-12">
                                    <p><strong>Buyer Name:</strong> {currentOrder?.buyerName}</p>
                                </div>
                                <div className="col-12">
                                    <p><strong>Shipping Address:</strong> {currentOrder?.shippingAddress}</p>
                                </div>
                            </div>

                            {/* Transport Details Form */}
                            <div className="row border mt-2 rounded">
                                <div className="col-12">


                                    <h6 className="fw-bold">Transport Details</h6>
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <label className="form-label text-dark fw-bold">Transporter Name <span className="text-danger">*</span></label>

                                            <input
                                                type="text"
                                                className="form-control transport-input"
                                                placeholder="Enter transporter name"
                                                name="transportName"
                                                value={transportDetails.transportName}
                                                onChange={handleTransportChange}
                                                disabled={uploading}
                                                required
                                            />
                                            {validationErrors.transportName && (
                                                <small className="text-danger">{validationErrors.transportName}</small>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-dark fw-bold">Transporter Mobile No. <span className="text-danger">*</span></label>

                                            <input
                                                type="number"
                                                className="form-control transport-input"
                                                placeholder="Enter transporter mobile no."
                                                name="transportMobile"
                                                value={transportDetails.transportMobile}
                                                onChange={handleTransportChange}
                                                disabled={uploading}
                                                required
                                            />
                                            {validationErrors.transportMobile && (
                                                <small className=" text-danger">{validationErrors.transportMobile}</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <label className="form-label text-dark fw-bold">Vehicle No.</label>
                                            <input
                                                type="text"
                                                className="form-control transport-input"
                                                placeholder="Enter vehicle no."
                                                name="vehicleNo"
                                                value={transportDetails.vehicleNo}
                                                onChange={handleTransportChange}
                                                disabled={uploading}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-dark fw-bold">Driver Mobile No. <span className="text-danger">*</span></label>

                                            <input
                                                type="number"
                                                placeholder="Enter driver mobile no."
                                                className="form-control transport-input"
                                                name="driverMobile"
                                                value={transportDetails.driverMobile}
                                                onChange={handleTransportChange}
                                                disabled={uploading}
                                                required
                                            />
                                            {validationErrors.driverMobile && (
                                                <small className="text-danger">{validationErrors.driverMobile}</small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-12 mb-2 d-flex align-items-center">
                                            <div className="row">
                                                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-12">
                                                    <label className="form-label text-dark fw-bold">Transport Challan Photo</label>
                                                    <div className="d-flex align-items-start flex-column">
                                                        <input
                                                            type="file"
                                                            id="challanUpload"
                                                            accept="image/*"
                                                            onChange={handleFileUpload}
                                                            className="d-none"
                                                            disabled={uploading}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn me-2 d-flex align-items-center"
                                                            style={{ background: "rgb(31, 133, 5)", color: "rgb(255, 255, 255)" }}
                                                            onClick={handleUploadButtonClick}
                                                            disabled={uploading}
                                                        >
                                                            <FaUpload className="me-1" />
                                                            {uploading ? 'Uploading...' : 'Choose File'}
                                                        </button>
                                                        {transportDetails.challanImageUrl && (
                                                            <span className="text-success">{transportDetails.challanImageUrl.split('_').pop()}</span>
                                                        )}
                                                        {uploadError && (
                                                            <small className="text-danger">{uploadError}</small>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-12 d-flex align-items-center">
                                                    <p className="text-danger mb-0 fw-bold">Attach the photograph of this box packing. RHOKART invoice should be clearly visible in the box picture</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-dark fw-bold">Transporter Email</label>

                                            <input
                                                type="email"
                                                className="form-control transport-input"
                                                placeholder="Enter transporter email"
                                                name="transportEmail"
                                                value={transportDetails.transportEmail}
                                                onChange={handleTransportChange}
                                                disabled={uploading}
                                            />
                                            {validationErrors.transportEmail && (
                                                <small className="text-danger">{validationErrors.transportEmail}</small>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer flex-column align-items-end">
                            <div className="">
                                {
                                    transportError && (
                                        <small className="text-danger">{transportError}</small>
                                    )
                                }
                            </div>
                            <div className="gap-3 d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setModalShow(false)}
                                    disabled={submitLoading || uploading}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmitTransportDetails}
                                    disabled={isSubmitDisabled}
                                    style={{
                                        cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                                        background: "rgb(31, 133, 5)",
                                        color: "rgb(255, 255, 255)"
                                    }}
                                >
                                    {submitLoading ? (
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalShow && <div className="modal-backdrop fade show"></div>}
        </>
    )
}

export default PackedTbl;