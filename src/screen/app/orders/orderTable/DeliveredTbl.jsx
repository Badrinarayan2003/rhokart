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
                const response = await axios.get(`https://sellerapi.rhoselect.com/orderprocess/delivered?sellerId=${sellerId}`);
                console.log(response, "delivered tab response")
                if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.deliveryDetails) {
                    const mappedData = response?.data?.coreData?.responseData?.deliveryDetails.map((order, index) => ({
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
                        payDetail: order.payDetail,
                        paymentStatus: order.paymentStatus,
                        deliveryDate: order.deliveryDate,
                        deliveryTime: order.deliveryTime,
                        amount: order.payDetail?.amount,
                        payDate: order.payDetail?.payDate,
                        paymentMode: order.payDetail?.paymentMode,
                        status: order.payDetail?.status,
                        transactionId: order.payDetail?.transactionId,
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


    const handleDownload = (invoiceId) => {
        console.log(`Downloading documents for order ${invoiceId}`);
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
            headerName: "Payment Status",
            // field: "payStatus",
            cellRenderer: (params) => {
                const paymentStatus = params.data.paymentStatus;

                if (paymentStatus === "Paid") {
                    return (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <p
                                // type="button"
                                className="mb-0 fw-bold"
                                style={{ textDecoration: "underline", color: '#1F8505' }}
                                data-bs-toggle="modal"
                                data-bs-target="#paymentDetailModal"
                                onClick={() => setSelectedOrder(params.data)}
                            >
                                {paymentStatus}
                            </p>
                        </div>
                    );
                } else {
                    return (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            {paymentStatus}
                        </div>
                    );
                }
            },
            width: 200
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
            width: 240
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
        },
        {
            headerName: "Delivered date",
            field: "deliveryDate",
            sortable: true,
            filter: true,
            width: 150
        },
        {
            headerName: "Delivered time",
            field: "deliveryTime",
            sortable: true,
            filter: true,
            width: 150
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
                                    <p><strong>Status</strong> <span>{selectedOrder.status || "N/A"}</span></p>
                                    <p><strong>Amount</strong> <span>₹{selectedOrder.amount?.toFixed(2) || "N/A"}</span></p>
                                    <p><strong>Payment Mode</strong> <span>{selectedOrder.paymentMode || "N/A"}</span></p>
                                    <p><strong>Transaction ID</strong> <span>{selectedOrder.transactionId || "N/A"}</span></p>
                                    <p><strong>Payment Date </strong> <span>{selectedOrder.payDate || "N/A"}</span></p>
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