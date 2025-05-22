import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import '../orders.css';
import { FaDownload, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../../../../config/urls";
import Loader from "../../../../components/loader/Loader";

const OrderedTbl = () => {
    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);

    const [loading, setLoading] = useState(false);
    const sellerId = useSelector((state) => state.auth?.sellerId);

    console.log(sellerId, "sellerId in order")

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/order/detail?sellerId=${sellerId}&status=ORDERED`);
                if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.sellerOrders) {
                    console.log(response, "order response")
                    setLoading(false);
                    // Map API data to row data with SL No.
                    const mappedData = response?.data?.coreData?.responseData?.sellerOrders.map((order, index) => ({
                        slNo: index + 1,
                        orderId: order.orderId,
                        buyerName: order.buyerName,
                        buyerState: order.buyerState,
                        buyerDistrict: order.buyerDistrict,
                        buyerPin: order.buyerPin,
                        shippingAddress: order.shippingAddress,
                        units: order.units,
                        totalAmount: order.totalAmount,
                        status: order.status,
                        invoiceNo: order.invoiceNo,
                        // hasDocuments: !!order.invoiceNo, 
                        hasDocuments: order.invoiceNo && order.invoiceNo.trim() !== "",
                        slamId: order.slamId,
                        rtsId: order.shipId
                    }));
                    setRowData(mappedData);
                }
            } catch (error) {
                console.log("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    // Handle download button click
    const handleDownload = (orderId) => {
        console.log(`Downloading documents for order ${orderId}`);
        // Add your download logic here
        // Example: window.open(`/api/documents/${orderId}`, '_blank');
    };


    // Handle details button click
    const handleDetailsClick = (orderId, status) => {
        console.log("Details clicked for order:", orderId, "with status:", status);
        navigate('/order-details', {
            state: {
                orderId: orderId,
                status: status,
            }
        });
    };



    // Column definitions for the orders table
    const [columnDefs] = useState([
        {
            headerName: "S. No.",
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
        // {
        //     headerName: "Buyer Pin",
        //     field: "buyerPin",
        //     sortable: true,
        //     filter: true,
        //     width: 120
        // },
        {
            headerName: "Total Quantity",
            field: "units",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 150
        },
        {
            headerName: "Payable Amount, tentative",
            field: "totalAmount",
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: params => params.value.toFixed(2),
            width: 240
        },
        {
            headerName: "Take Action",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <p
                        className="mb-0 text-danger fw-bold"
                        style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: "700" }}
                        onClick={() => handleDetailsClick(params.data.orderId, params.data.status)}
                    >
                        {
                            params.data.hasDocuments ?
                                "Enter shipment details" : "Order details"
                        }
                    </p>
                </div>
            ),
            width: 150
        },
        {
            headerName: "Shipping Address",
            field: "shippingAddress",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 220
        },

        // {
        //     headerName: "Status",
        //     field: "status",
        //     cellRenderer: (params) => (
        //         <div className="d-flex justify-content-center">
        //             <span className={`status-badge ${params?.value?.toLowerCase().replace(' ', '-')}`}>
        //                 {params.value}
        //             </span>
        //         </div>
        //     ),
        //     width: 150
        // },
        // {
        //     headerName: "Invoice No.",
        //     field: "invoiceNo",
        //     sortable: true,
        //     filter: true,
        //     cellRenderer: (params) => (
        //         <div className="d-flex justify-content-center align-items-center h-100">
        //             {params.value && params.value.trim() ? (
        //                 <span>{params.value}</span>
        //             ) : (
        //                 <span className="text-muted">No Invoice No.</span>
        //             )}
        //         </div>
        //     ),
        //     width: 150
        // },
        {
            headerName: "Invoice",
            headerClass: "justify-content-center",
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
                        <span className="text-muted">invoice available after order packed</span>
                    )}
                </div>
            ),
            width: 300
        },
        // {
        //     headerName: "Shipping Label",
        //     field: "slamId",
        //     sortable: true,
        //     filter: true,
        //     cellRenderer: (params) => (
        //         <div className="d-flex justify-content-center align-items-center h-100">
        //             <button
        //                 style={{ fontSize: "12px", border: "1px solid #1F8505", color: '#1F8505' }}
        //                 className="btn btn-sm"
        //             >
        //                 <FaDownload /> {params.data.slamId}
        //             </button>
        //         </div>
        //     ),
        //     width: 150
        // },
        // {
        //     headerName: "RTS ID",
        //     field: "rtsId",
        //     sortable: true,
        //     filter: true,
        //     width: 150
        // }
    ]);



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
        </>

    )
}

export default OrderedTbl;