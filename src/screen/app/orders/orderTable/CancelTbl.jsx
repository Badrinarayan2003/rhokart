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

const CancelTbl = () => {
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
                const response = await axios.get(`https://sellerapi.rhoselect.com/orderprocess/cancel?sellerId=${sellerId}`);
                console.log(response, "CANCEL tab response")
                if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.cancelDetails) {
                    const mappedData = response?.data?.coreData?.responseData?.cancelDetails.map((order, index) => ({
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
                        cancelDate: order.cancelDate,
                        cancelReason: order.cancelReason,
                        cancelTime: order.cancelTime,
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
            // valueFormatter: params => params.value.toFixed(2),
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
            headerName: "Cancel date",
            field: "cancelDate",
            sortable: true,
            filter: true,
            width: 150
        },
        {
            headerName: "Cancel time",
            field: "cancelTime",
            sortable: true,
            filter: true,
            width: 150
        },
        {
            headerName: "Cancel Reason",
            field: "cancelReason",
            sortable: true,
            filter: true,
            width: 250
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
        </>
    );
};

export default CancelTbl;