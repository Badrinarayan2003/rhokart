import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import '../orders.css';
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../../../../config/urls";
import Loader from "../../../../components/loader/Loader";

const DeliveredTbl = () => {
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
                const response = await axios.get(`${BASE_URL}/order/deliverorder?sellerId=${sellerId}`);
                console.log(response, "delivered tab response")
                if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.deliverOrders) {
                    const mappedData = response?.data?.coreData?.responseData?.deliverOrders.map((order, index) => ({
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
                        rtsId: order.shipId,
                        payStatus: order.payStatus,
                        payDetail: order.payDetail,
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
        // {
        //     headerName: "Take Action",
        //     cellRenderer: (params) => (
        //         <div className="d-flex justify-content-center align-items-center h-100">
        //             <button
        //                 className="btn btn-sm"
        //                 style={{ background: "#1F8505", color: "#fff" }}
        //             >
        //                 Confirm delivery
        //             </button>
        //         </div>
        //     ),
        //     width: 150
        // },
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
        },
        {
            headerName: "Payment Status",
            field: "payStatus",
            cellRenderer: (params) => {
                const payStatus = params.data.payStatus;
                const payDetail = params.data.payDetail;

                if (payStatus === "Paid") {
                    return (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                data-bs-toggle="modal"
                                data-bs-target="#paymentDetailModal"
                                onClick={() => setSelectedOrder(payDetail)}
                            >
                                {payStatus}
                            </button>
                        </div>
                    );
                } else {
                    return (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            {payStatus}
                        </div>
                    );
                }
            },
            width: 200
        }

    ]);

    return (
        <>
            {loading && <Loader message="Loading Orders..." />}

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

            <div
                className="modal fade"
                id="paymentDetailModal"
                tabIndex="-1"
                aria-labelledby="paymentDetailModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="paymentDetailModalLabel">
                                Payment Details
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {selectedOrder ? (
                                <>
                                    <p><strong>Status:</strong> {selectedOrder.status || "N/A"}</p>
                                    <p><strong>Amount:</strong> ₹{selectedOrder.amount?.toFixed(2) || "N/A"}</p>
                                    <p><strong>Payment Mode:</strong> {selectedOrder.paymentMode || "N/A"}</p>
                                    <p><strong>Transaction ID:</strong> {selectedOrder.transId || "N/A"}</p>
                                    <p><strong>Payment Date:</strong> {selectedOrder.payDate || "N/A"}</p>
                                </>
                            ) : (
                                <p>No details available.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default DeliveredTbl;




















// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import '../orders.css';
// import { FaDownload } from "react-icons/fa";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import { BASE_URL } from "../../../../config/urls";
// import Loader from "../../../../components/loader/Loader";

// const DeliveredTbl = () => {
//     const navigate = useNavigate();
//     const [rowData, setRowData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [otp, setOtp] = useState("");
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const sellerId = useSelector((state) => state.auth?.sellerId);

//     // Fetch data from API
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${BASE_URL}/order/deliverorder?sellerId=2`);
//                 console.log(response, "delivered tab response")
//                 if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.sellerOrders) {
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
//                         hasDocuments: order.invoiceNo && order.invoiceNo.trim() !== "",
//                         slamId: order.slamId,
//                         rtsId: order.shipId,
//                         payStatus: order.payStatus
//                     }));
//                     setRowData(mappedData);
//                     setLoading(false);
//                 }
//             } catch (error) {
//                 console.log("Error fetching data:", error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [sellerId]);


//     const handleDownload = (orderId) => {
//         console.log(`Downloading documents for order ${orderId}`);
//     };

//     const handleDetailsClick = (orderId, status, invoiceNo) => {
//         navigate('/order-details', {
//             state: {
//                 orderId: orderId,
//                 status: status,
//                 oInvoiceNo: invoiceNo
//             }
//         });
//     };

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
//         // {
//         //     headerName: "Take Action",
//         //     cellRenderer: (params) => (
//         //         <div className="d-flex justify-content-center align-items-center h-100">
//         //             <button
//         //                 className="btn btn-sm"
//         //                 style={{ background: "#1F8505", color: "#fff" }}
//         //             >
//         //                 Confirm delivery
//         //             </button>
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
//         },
//         {
//             headerName: "Payment Status",
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     <button
//                         className="btn btn-sm"
//                         style={{ background: "#1F8505", color: "#fff" }}
//                     >
//                         Verification pending
//                     </button>
//                 </div>
//             ),
//             width: 150
//         },
//     ]);

//     return (
//         <>
//             {loading && <Loader message="Loading Orders..." />}

//             <div className="ag-theme-alpine mt-4" style={{ height: '400px', width: '100%' }}>
//                 <AgGridReact
//                     rowData={rowData}
//                     columnDefs={columnDefs}
//                     suppressCellFocus={true}
//                     defaultColDef={{
//                         resizable: true,
//                         sortable: true,
//                         filter: true
//                     }}
//                     suppressScrollOnNewData={true}
//                 />
//             </div>
//         </>
//     );
// };

// export default DeliveredTbl;