// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import '../orders.css';
// import { FaDownload, FaInfoCircle, FaTimes, FaUpload } from "react-icons/fa";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import { BASE_URL } from "../../../../config/urls";
// import Loader from "../../../../components/loader/Loader";

// const TransitTbl = () => {
//     const navigate = useNavigate();

//     const [rowData, setRowData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [otp, setOtp] = useState("");
//     const [files, setFiles] = useState([]);
//     const sellerId = useSelector((state) => state.auth?.sellerId);

//     console.log(sellerId, "sellerId in order")

//     // Fetch data from API
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${BASE_URL}/order/detail?sellerId=${sellerId}&status=PCKD`);
//                 if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.sellerOrders) {
//                     console.log(response, "transit response")
//                     setLoading(false);
//                     // Map API data to row data with SL No.
//                     const mappedData = response?.data?.coreData?.responseData?.sellerOrders.map((order, index) => ({
//                         slNo: index + 1,
//                         orderId: order.orderId,
//                         buyerName: order.buyerName,
//                         buyerState: order.buyerState,
//                         buyerDistrict: order.buyerDistrict,
//                         buyerPin: order.buyerPin,
//                         units: order.units,
//                         totalAmount: order.totalAmount,
//                         status: order.status,
//                         invoiceNo: order.invoiceNo,
//                         // hasDocuments: !!order.invoiceNo, 
//                         hasDocuments: order.invoiceNo && order.invoiceNo.trim() !== "",
//                         slamId: order.slamId,
//                         rtsId: order.shipId
//                     }));
//                     setRowData(mappedData);
//                 }
//             } catch (error) {
//                 console.log("Error fetching data:", error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const handleConfirmDeliveryClick = (orderData) => {
//         setSelectedOrder(orderData);
//         setShowModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//         setSelectedOrder(null);
//         setOtp("");
//         setFiles([]);
//     };

//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         setFiles(selectedFiles);
//     };

//     const removeFile = (index) => {
//         const newFiles = [...files];
//         newFiles.splice(index, 1);
//         setFiles(newFiles);
//     };

//     const handleSubmitDelivery = () => {
//         if (!otp) {
//             alert("Please enter OTP");
//             return;
//         }

//         console.log("All modal data:", {
//             orderDetails: selectedOrder,
//             otp: otp,
//             files: files.map(f => ({
//                 name: f.name,
//                 size: f.size,
//                 type: f.type
//             })),
//             sellerId: sellerId
//         });
//     };


//     // Handle download button click
//     const handleDownload = (orderId) => {
//         console.log(`Downloading documents for order ${orderId}`);
//         // Add your download logic here
//         // Example: window.open(`/api/documents/${orderId}`, '_blank');
//     };


//     // Handle details button click
//     const handleDetailsClick = (orderId, status, invoiceNo) => {
//         console.log("Details clicked for order:", orderId, "with status:", status, "with invoiceNo", invoiceNo);
//         navigate('/order-details', {
//             state: {
//                 orderId: orderId,
//                 status: status,
//                 oInvoiceNo: invoiceNo
//             }
//         });
//     };



//     // Column definitions for the orders table
//     const [columnDefs] = useState([
//         {
//             headerName: "SL No.",
//             field: "slNo",
//             sortable: true,
//             width: 90
//         },
//         {
//             headerName: "Order ID",
//             field: "orderId",
//             sortable: true,
//             filter: true,
//             cellStyle: { fontWeight: 'bold' },
//             width: 150
//         },
//         {
//             headerName: "Buyer Name",
//             field: "buyerName",
//             sortable: true,
//             filter: true,
//             width: 150
//         },
//         {
//             headerName: "Buyer State",
//             field: "buyerState",
//             sortable: true,
//             filter: true,
//             width: 140
//         },
//         {
//             headerName: "Buyer District",
//             field: "buyerDistrict",
//             sortable: true,
//             filter: true,
//             width: 140
//         },
//         // {
//         //     headerName: "Buyer Pin",
//         //     field: "buyerPin",
//         //     sortable: true,
//         //     filter: true,
//         //     width: 120
//         // },
//         {
//             headerName: "No. of Items/sku",
//             field: "units",
//             sortable: true,
//             filter: 'agNumberColumnFilter',
//             width: 150
//         },
//         {
//             headerName: "Total Amount (₹)",
//             field: "totalAmount",
//             sortable: true,
//             filter: 'agNumberColumnFilter',
//             valueFormatter: params => params.value.toFixed(2),
//             width: 150
//         },
//         {
//             headerName: "Take Action",
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     <button
//                         className="btn btn-sm"
//                         style={{ background: "#1F8505", color: "#fff" }}
//                         onClick={() => handleConfirmDeliveryClick(params.data)}
//                     >
//                         Confirm delivery
//                     </button>
//                 </div>
//             ),
//             width: 150
//         },
//         // {
//         //     headerName: "Status",
//         //     field: "status",
//         //     cellRenderer: (params) => (
//         //         <div className="d-flex justify-content-center">
//         //             <span className={`status-badge ${params?.value?.toLowerCase().replace(' ', '-')}`}>
//         //                 {params.value}
//         //             </span>
//         //         </div>
//         //     ),
//         //     width: 150
//         // },
//         // {
//         //     headerName: "Invoice No.",
//         //     field: "invoiceNo",
//         //     sortable: true,
//         //     filter: true,
//         //     cellRenderer: (params) => (
//         //         <div className="d-flex justify-content-center align-items-center h-100">
//         //             {params.value && params.value.trim() ? (
//         //                 <span>{params.value}</span>
//         //             ) : (
//         //                 <span className="text-muted">No Invoice No.</span>
//         //             )}
//         //         </div>
//         //     ),
//         //     width: 150
//         // },
//         {
//             headerName: "Invoice",
//             headerClass: "badri",
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     {params.data.hasDocuments ? (
//                         <button
//                             className="btn btn-sm"
//                             style={{ fontSize: "12px", border: "1px solid #1F8505", color: '#1F8505' }}
//                             onClick={() => handleDownload(params.data.orderId)}
//                         >
//                             <FaDownload /> {params.data.invoiceNo}
//                         </button>
//                     ) : (
//                         <span className="text-muted">No Invoice</span>
//                     )}
//                 </div>
//             ),
//             width: 300
//         },
//         {
//             headerName: "Shipping Label",
//             field: "slamId",
//             sortable: true,
//             filter: true,
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     <button
//                         style={{ border: "1px solid #1F8505", color: '#1F8505' }}
//                         className="btn btn-sm"
//                     >
//                         <FaDownload /> {params.data.slamId}
//                     </button>
//                 </div>
//             ),
//             width: 150
//         },
//         {
//             headerName: "Ready To Ship (RTS) ID",
//             field: "rtsId",
//             sortable: true,
//             filter: true,
//             width: 150
//         }
//     ]);



//     return (
//         <>
//             {loading && <Loader message="Loading Orders..." />}


//             {/* Delivery Confirmation Modal */}
//             <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header justify-content-center">
//                             <h5 className="modal-title">Delivery Confirmation</h5>
//                         </div>
//                         <div className="modal-body">
//                             {selectedOrder && (
//                                 <div className="row">
//                                     <div className="col-md-6 mb-3">
//                                         <h5>Order Details</h5>
//                                         <div className="order-details-container">
//                                             <div className="detail-item">
//                                                 <span className="detail-label">Buyer Id:</span>
//                                                 <span className="detail-value"> {selectedOrder?.orderId}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <span className="detail-label">Buyer Name:</span>
//                                                 <span className="detail-value"> {selectedOrder.buyerName}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <span className="detail-label">Buyer State:</span>
//                                                 <span className="detail-value"> {selectedOrder.buyerState}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <span className="detail-label">Buyer District:</span>
//                                                 <span className="detail-value"> {selectedOrder.buyerDistrict}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <span className="detail-label">Buyer PIN:</span>
//                                                 <span className="detail-value"> {selectedOrder.buyerPin}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <span className="detail-label">Total qty:</span>
//                                                 <span className="detail-value"> {selectedOrder.units}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <span className="detail-label">Total Amount (incl. GST):</span>
//                                                 <span className="detail-value"> ₹ {selectedOrder.totalAmount.toFixed(2)}</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-6">
//                                         <div className="form-group mb-3">
//                                             <label htmlFor="otpInput" className="form-label">
//                                                 Delivery Confirmation OTP <span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 id="otpInput"
//                                                 value={otp}
//                                                 onChange={(e) => setOtp(e.target.value)}
//                                                 placeholder="Enter OTP received from buyer"
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="form-group mb-3">
//                                             <label className="form-label">Upload Invoice (Signed by the buyer)</label>
//                                             <div className="upload-container">
//                                                 <input
//                                                     type="file"
//                                                     id="fileUpload"
//                                                     onChange={handleFileChange}
//                                                     multiple
//                                                     style={{ display: 'none' }}
//                                                 />
//                                                 <label htmlFor="fileUpload" className="btn" id="my-button">
//                                                     <FaUpload /> Uploud
//                                                 </label>
//                                             </div>
//                                             {/* <small className="text-muted">You can upload multiple files (e.g., POD, signature, photos)</small> */}

//                                             {files.length > 0 && (
//                                                 <div className="mt-2">
//                                                     <h6>Selected Files:</h6>
//                                                     <div className="file-list">
//                                                         {files.map((file, index) => (
//                                                             <div key={index} className="file-item">
//                                                                 <span className="file-name">{file.name}</span>
//                                                                 <button
//                                                                     className="btn btn-sm btn-remove"
//                                                                     onClick={() => removeFile(index)}
//                                                                 >
//                                                                     <FaTimes />
//                                                                 </button>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
//                                 Close
//                             </button>
//                             <button
//                                 type="button"
//                                 className="btn"
//                                 id="my-button"
//                                 onClick={handleSubmitDelivery}
//                             >
//                                 Submit
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {showModal && <div className="modal-backdrop fade show"></div>}

//             <div className="ag-theme-alpine mt-4" style={{ height: '500px', width: '100%' }}>
//                 <AgGridReact
//                     rowData={rowData}
//                     columnDefs={columnDefs}
//                     suppressCellFocus={true}
//                     defaultColDef={{
//                         resizable: true,
//                         sortable: true,
//                         filter: true
//                     }}
//                 />
//             </div>
//         </>

//     )
// }

// export default TransitTbl;















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

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/order/detail?sellerId=${sellerId}&status=TRNST`);
                if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.sellerOrders) {
                    const mappedData = response?.data?.coreData?.responseData?.sellerOrders.map((order, index) => ({
                        slNo: index + 1,
                        orderId: order.orderId,
                        buyerName: order.buyerName,
                        buyerState: order.buyerState,
                        buyerDistrict: order.buyerDistrict,
                        buyerPin: order.buyerPin,
                        units: order.units,
                        totalAmount: order.totalAmount,
                        status: order.status,
                        invoiceNo: order.invoiceNo,
                        hasDocuments: order.invoiceNo && order.invoiceNo.trim() !== "",
                        slamId: order.slamId,
                        rtsId: order.shipId
                    }));
                    setRowData(mappedData);
                    setLoading(false);
                }
            } catch (error) {
                console.log("Error fetching data:", error);
                setLoading(false);
            }
        };

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
                alert("Failed to upload file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file");
        } finally {
            setLoading(false);
            e.target.value = ''; // Reset file input
        }
    };

    // const handleSubmitDelivery = () => {
    //     if (!otp) {
    //         alert("Please enter OTP");
    //         return;
    //     }

    //     if (uploadedFiles.length === 0) {
    //         alert("Please upload at least one file");
    //         return;
    //     }

    //     console.log("Delivery Confirmation Data:", {
    //         orderId: selectedOrder.orderId,
    //         otp: otp,
    //         uploadedFiles: uploadedFiles,
    //         sellerId: sellerId
    //     });

    //     // Here you would typically make an API call to confirm delivery
    //     // For now, we'll just log the data and close the modal
    //     // handleCloseModal();
    // };



    const handleSubmitDelivery = async () => {
        if (!otp) {
            alert("Please enter OTP");
            return;
        }

        if (uploadedFiles.length === 0) {
            alert("Please upload at least one file");
            return;
        }

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
                // Success case
                alert(response.data.coreData?.responseData?.message || "Delivery confirmed successfully!");

                // Close the modal and reset form
                // handleCloseModal();

                // Optionally, refresh the order data
                // You might want to add a refresh function here
            } else {
                // Handle API error
                alert(response.data?.rmessage || "Failed to confirm delivery");
            }
        } catch (error) {
            console.error("Error confirming delivery:", error);
            alert("An error occurred while confirming delivery");
        } finally {
            setLoading(false);
        }
    };



    const handleDownload = (orderId) => {
        console.log(`Downloading documents for order ${orderId}`);
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
            headerName: "Buyer Name",
            field: "buyerName",
            sortable: true,
            filter: true,
            width: 150
        },
        {
            headerName: "Buyer State",
            field: "buyerState",
            sortable: true,
            filter: true,
            width: 140
        },
        {
            headerName: "Buyer District",
            field: "buyerDistrict",
            sortable: true,
            filter: true,
            width: 140
        },
        {
            headerName: "No. of Items/sku",
            field: "units",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 150
        },
        {
            headerName: "Total Amount (₹)",
            field: "totalAmount",
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: params => params.value.toFixed(2),
            width: 150
        },
        {
            headerName: "Take Action",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <button
                        className="btn btn-sm"
                        style={{ background: "#1F8505", color: "#fff" }}
                        onClick={() => handleConfirmDeliveryClick(params.data)}
                    >
                        Confirm delivery
                    </button>
                </div>
            ),
            width: 150
        },
        {
            headerName: "Invoice",
            headerClass: "badri",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    {params.data.hasDocuments ? (
                        <button
                            className="btn btn-sm"
                            style={{ fontSize: "12px", border: "1px solid #1F8505", color: '#1F8505' }}
                            onClick={() => handleDownload(params.data.orderId)}
                        >
                            <FaDownload /> {params.data.invoiceNo}
                        </button>
                    ) : (
                        <span className="text-muted">No Invoice</span>
                    )}
                </div>
            ),
            width: 300
        },
        {
            headerName: "Shipping Label",
            field: "slamId",
            sortable: true,
            filter: true,
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <button
                        style={{ border: "1px solid #1F8505", color: '#1F8505' }}
                        className="btn btn-sm"
                    >
                        <FaDownload /> {params.data.slamId}
                    </button>
                </div>
            ),
            width: 150
        },
        {
            headerName: "Ready To Ship (RTS) ID",
            field: "rtsId",
            sortable: true,
            filter: true,
            width: 150
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
                                    <div className="col-md-6 mb-3">
                                        <h5 className="text-dark fw-bold">Order Details</h5>
                                        <div className="order-details-container">
                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark fw-bold">Order Id:</span>
                                                <span className="detail-value"> {selectedOrder?.orderId}</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark fw-bold">Buyer Name:</span>
                                                <span className="detail-value"> {selectedOrder.buyerName}</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark fw-bold">Buyer State:</span>
                                                <span className="detail-value"> {selectedOrder.buyerState}</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark fw-bold">Buyer District:</span>
                                                <span className="detail-value"> {selectedOrder.buyerDistrict}</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark fw-bold">Buyer PIN:</span>
                                                <span className="detail-value"> {selectedOrder.buyerPin}</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark fw-bold">Total qty:</span>
                                                <span className="detail-value"> {selectedOrder.units}</span>
                                            </div>
                                            <div className="detail-item mb-1">
                                                <span className="detail-label text-dark fw-bold">Total Amount (incl. GST):</span>
                                                <span className="detail-value"> ₹ {selectedOrder.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="otpInput" className="form-label">
                                                Delivery Confirmation OTP <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="otpInput"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter OTP received from buyer"
                                                required
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="form-label">Upload Invoice (Signed by the buyer)</label>
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
                />
            </div>
        </>
    );
};

export default TransitTbl;
