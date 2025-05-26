import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import '../orders.css';
import { FaDownload, FaInfoCircle, FaTimes, FaUpload } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../../../../config/urls";
import Loader from "../../../../components/loader/Loader";

const TransitTbl = () => {
    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [otp, setOtp] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const sellerId = useSelector((state) => state.auth?.sellerId);

    const [uploadError, setUploadError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [deliveryError, setDeliveryError] = useState("");
    const [deliverySuccess, setDeliverySuccess] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://sellerapi.rhoselect.com/orderprocess/transit?sellerId=${sellerId}`);
            console.log(response, "transit response");
            if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.transitDetails) {

                const mappedData = response?.data?.coreData?.responseData?.transitDetails.map((order, index) => ({
                    slNo: index + 1,
                    orderId: order.order.orderId,
                    buyerName: order.order.buyerName,
                    fillRate: order.order.fillRate,
                    noOfBoxes: order.order.noOfBoxes,
                    orderDate: order.order.orderDate,
                    orderPackedDate: order.order.orderPackedDate,
                    orderPackedTime: order.order.orderPackedTime,
                    orderTime: order.order.orderTime,
                    orderValue: order.order.orderValue,
                    packedValue: order.order.packedValue,
                    rhokartBuyerInvoice: order.order.rhokartBuyerInvoice,
                    rhokartSellerInvoiceNumber: order.order.rhokartSellerInvoiceNumber,
                    rtsTime: order.order.rtsTime,
                    sellerInvoiceNumber: order.order.sellerInvoiceNumber,
                    shippingAddress: order.order.shippingAddress,
                    totalPackedQty: order.order.totalPackedQty,
                    transportMode: order.transportMode,
                    buyerMobileNo: order.buyerMobileNo,
                }));
                setRowData(mappedData);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error fetching data:", error);
            setLoading(false);
        }
    };

    // Fetch data from API
    useEffect(() => {

        fetchData();
    }, [sellerId]);

    const handleConfirmDeliveryClick = (orderData) => {
        setSelectedOrder(orderData);
        setShowModal(true);
        setUploadedFiles([]); // Reset uploaded files when modal opens
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setOtp("");
        setUploadedFiles([]);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setUploadError(""); // Clear previous errors
        try {
            const formData = new FormData();
            formData.append('files', file);

            const response = await axios.post('https://upload.rhoselect.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response, "file uploud response")
            if (response.data?.response?.rcode === 0) {
                const uploadedFile = response.data.response.coreData.responseData.uploadedFiles[0];
                setUploadedFiles(prev => [...prev, uploadedFile]);
            } else {
                // alert("Failed to upload file");
                setUploadError("Failed to upload file. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadError("Error uploading file. Please try again.");
        } finally {
            setLoading(false);
            e.target.value = ''; // Reset file input
        }
    };


    const handleSubmitDelivery = async () => {
        setDeliveryError("");
        setDeliverySuccess("");
        if (!otp) {
            setOtpError("Please enter OTP");
            return;
        } else {
            setOtpError("");
        }

        // if (uploadedFiles.length === 0) {
        //     alert("Please upload at least one file");
        //     return;
        // }

        setLoading(true);

        try {
            // Prepare the payload
            const payload = {
                orderId: selectedOrder.orderId,
                otp: otp,
                invoiceUrl: uploadedFiles.map(file => file.url), // Extract URLs from uploadedFiles
                sellerId: sellerId
            };

            // Make the API call
            const response = await axios.post(
                'https://sellerapi.rhoselect.com/order/deliveryconfirm',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Delivery confirmation response:", response);

            if (response.data?.rcode === 0) {

                setDeliverySuccess(response.data.coreData?.responseData?.message || "Delivery confirmed successfully!");
                setTimeout(() => {
                    handleCloseModal();
                    fetchData();
                    setDeliverySuccess("")
                }, 2000);

            } else {
                // Handle API error
                setDeliveryError(response.data?.rmessage || "Failed to confirm delivery");
            }
        } catch (error) {
            console.error("Error confirming delivery:", error);
            setDeliveryError("An error occurred while confirming delivery");
        } finally {
            setLoading(false);
        }
    };



    const handleDownload = async (invoiceId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://sellerapi.rhoselect.com/order/invoicedownload?invoiceId=${invoiceId}`,
                {
                    headers: {
                        // Add any required headers here
                        // 'Authorization': `Bearer ${yourToken}`
                    }
                }
            );
            console.log(response, "download ")
            if (response.data.rcode === 0 && response.data.coreData.responseData.invoiceUrl) {
                const downloadUrl = response.data.coreData.responseData.invoiceUrl;

                // Create a temporary anchor element to trigger the download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${invoiceId}.pdf`; // This forces the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
            // You might want to show an error message to the user here
        } finally {
            setLoading(false);
        }
    };

    const handleDetailsClick = (orderId, status, invoiceNo) => {
        navigate('/order-details', {
            state: {
                orderId: orderId,
                status: status,
                oInvoiceNo: invoiceNo
            }
        });
    };

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
            width: 150
        },
        {
            headerName: "Order value (INR)",
            field: "orderValue",
            sortable: true,
            filter: true,
            width: 150
        },
        {
            headerName: "Packed value (INR)",
            field: "packedValue",
            sortable: true,
            filter: true,
            width: 140
        },
        {
            headerName: "Fill rate",
            field: "fillRate",
            sortable: true,
            filter: true,
            width: 140
        },
        {
            headerName: "Take Action",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <p
                        className="mb-0 text-danger fw-bold"
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => handleConfirmDeliveryClick(params.data)}
                    >
                        Confirm delivery
                    </p>
                </div>
            ),
            width: 150
        },
        {
            headerName: "Order date",
            field: "orderDate",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 150
        },
        {
            headerName: "Order time",
            field: "orderTime",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 150
        },
        {
            headerName: "Order pack date",
            field: "orderPackedDate",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "Order pack time",
            field: "orderPackedTime",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "RTS time (days)",
            field: "rtsTime",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "Total packed qty",
            field: "totalPackedQty",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "No. of boxes",
            field: "noOfBoxes",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "Rhokart buyer invoice",
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
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "Shipping address",
            field: "shippingAddress",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "Transport mode",
            field: "transportMode",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },
        {
            headerName: "Seller invoice number (if any)",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    {params.data.sellerInvoiceNumber ? (
                        <span className="text-muted">{params.data.sellerInvoiceNumber}</span>
                    ) : (
                        <span className="text-muted">Invoice is not available</span>
                    )}
                </div>
            ),
            sortable: true,
            filter: true,
            width: 250
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
            width: 200
        }
    ]);

    return (
        <>
            {loading && <Loader message="Loading Orders..." />}

            {/* Delivery Confirmation Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header justify-content-center">
                            <h5 className="modal-title fw-bold">Delivery Confirmation</h5>
                        </div>
                        <div className="modal-body">
                            {selectedOrder && (
                                <div className="row w-75 mt-3">
                                    <div className="col-md-12 mb-2">
                                        {/* <h5 className="text-dark fw-bold">Order Details</h5> */}
                                        <div className="order-details-container">
                                            <div className="detail-item mb-1 me-2">
                                                <span className="detail-label text-dark">Order ID:</span>
                                                <span className="detail-value text-dark"> {selectedOrder?.orderId}</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                {/* <span className="detail-label text-dark">Buyer Name:</span> */}
                                                <span className="detail-value text-dark"> {selectedOrder.buyerName},</span>
                                            </div>

                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark">Mobile:</span>
                                                <span className="detail-value text-dark"> {selectedOrder.buyerMobileNo},</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                {/* <span className="detail-label text-dark fw-bold">Buyer State:</span> */}
                                                <span className="detail-label text-dark ">Address:</span>
                                                <span className="detail-value text-dark"> {selectedOrder.shippingAddress},</span>
                                            </div>

                                            {/* <div className="detail-item mb-1">
                                                <span className="detail-value text-dark"> {selectedOrder.buyerDistrict},</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                <span className="detail-value text-dark"> {selectedOrder.buyerPin},</span>
                                            </div> */}

                                            <div className="d-flex flex-wrap">
                                                <div className="detail-item mb-1 me-2">
                                                    <span className="detail-label text-dark">Total Amount (incl. GST):</span>
                                                    <span className="detail-value text-dark"> ₹ {selectedOrder.packedValue} </span>
                                                </div>

                                                <div className="detail-item mb-1">
                                                    <span className="detail-label text-dark">Total qty:</span>
                                                    <span className="detail-value text-dark"> {selectedOrder.totalPackedQty}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-md-6 mt-3">
                                        <div className="form-group mb-3">
                                            <label htmlFor="otpInput" className="form-label fw-bold text-dark">
                                                Delivery Confirmation OTP <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{ width: "55%" }}
                                                id="otpInput"
                                                value={otp}
                                                onChange={(e) => {
                                                    setOtp(e.target.value);
                                                    setOtpError(""); // Clear error when typing
                                                }}
                                                placeholder="Enter 5 digit OTP"
                                                required
                                            />
                                            {otpError && <div className="text-danger">{otpError}</div>}
                                            <small className="signal-msg">
                                                Delivery OTP will be provided by the buyer
                                            </small>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="form-label fw-bold text-dark">Upload Invoice (Signed by the buyer)</label>
                                            <div className="upload-container">
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    onChange={handleFileUpload}
                                                    accept="image/*,.pdf"
                                                    style={{ display: 'none' }}
                                                    disabled={loading}
                                                />
                                                <label htmlFor="fileUpload" className="btn" id="my-button">
                                                    <FaUpload /> {loading ? 'Uploading...' : 'Upload'}
                                                </label>
                                            </div>
                                            {uploadError && (
                                                <div className="text-danger mt-1">{uploadError}</div>
                                            )}

                                            {uploadedFiles.length > 0 && (
                                                <div className="mt-2">
                                                    <h6>Uploaded Files:</h6>
                                                    <div className="file-list">
                                                        {uploadedFiles.map((file, index) => (
                                                            <div key={index} className="file-item">
                                                                <span className="file-name">
                                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                        {/* {file.name} */}
                                                                        {file.name.split('_').pop()}
                                                                    </a>
                                                                </span>
                                                                <button
                                                                    className="btn btn-sm btn-remove"
                                                                    onClick={() => {
                                                                        const newFiles = [...uploadedFiles];
                                                                        newFiles.splice(index, 1);
                                                                        setUploadedFiles(newFiles);
                                                                    }}
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    {deliveryError && (
                                        <div className="col-md-12">
                                            <div className="alert alert-danger">{deliveryError}</div>
                                        </div>
                                    )}
                                    {deliverySuccess && (
                                        <div className="col-md-12">
                                            <div className="alert alert-success">{deliverySuccess}</div>
                                        </div>
                                    )}


                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn"
                                id="my-button"
                                onClick={handleSubmitDelivery}
                                disabled={loading}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}

            <div className="ag-theme-alpine mt-4" style={{ height: '400px', width: '100%' }}>
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
        </>
    );
};

export default TransitTbl;
