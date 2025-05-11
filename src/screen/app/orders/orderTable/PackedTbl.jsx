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

const PackedTbl = () => {
    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);
    const [originalData, setOriginalData] = useState([]); // To store original data for comparison
    const [loading, setLoading] = useState(false);
    const sellerId = useSelector((state) => state.auth?.sellerId);

    console.log(sellerId, "sellerId in order")

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/order/detail?sellerId=${sellerId}&status=PCKD`);
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
                        units: order.units,
                        totalAmount: order.totalAmount,
                        status: order.status,
                        invoiceNo: order.invoiceNo,
                        hasDocuments: order.invoiceNo && order.invoiceNo.trim() !== "",
                        slamId: order.slamId,
                        rtsId: order.shipId,
                        isChanged: false // Flag to track changes
                    }));
                    setRowData(mappedData);
                    setOriginalData(mappedData); // Store original data
                }
            } catch (error) {
                console.log("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Custom status cell editor component
    const StatusCellEditor = ({ value, onValueChange }) => {
        const [isEditing, setIsEditing] = useState(false);

        const handleChange = (newStatus) => {
            onValueChange(newStatus);
            setIsEditing(false);
        };

        return (
            <div className="status-cell-editor">
                {isEditing ? (
                    <div className="status-dropdown">
                        <div
                            className="dropdown-option"
                            onClick={() => handleChange('TRNST')}
                        >
                            Transit (TRNST)
                        </div>
                        <div
                            className="dropdown-option"
                            onClick={() => handleChange('PCKD')}
                        >
                            Packed (PCKD)
                        </div>
                    </div>
                ) : (
                    <div
                        className={`status-badge ${value?.toLowerCase().replace(' ', '-')} editable`}
                        onClick={() => setIsEditing(true)}
                    >
                        {value}
                    </div>
                )}
            </div>
        );
    };

    // Handle status change
    const onStatusChange = (orderId, newStatus) => {
        setRowData(prevData =>
            prevData.map(item =>
                item.orderId === orderId
                    ? { ...item, status: newStatus, isChanged: true }
                    : item
            )
        );
    };

    // Handle download button click
    const handleDownload = (orderId) => {
        console.log(`Downloading documents for order ${orderId}`);
    };

    // Handle details button click
    const handleDetailsClick = (orderId, status, invoiceNo) => {
        navigate('/order-details', {
            state: {
                orderId: orderId,
                status: status,
                oInvoiceNo: invoiceNo
            }
        });
    };

    // Handle submit changes
    const handleSubmitChanges = () => {
        const changedRows = rowData.filter(row => row.isChanged);
        console.log("Changed rows:", changedRows);

        // Here you would typically send the changes to your API
        // For example:
        // changedRows.forEach(row => {
        //     axios.post(`${BASE_URL}/order/update-status`, {
        //         orderId: row.orderId,
        //         newStatus: row.status
        //     });
        // });

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
            headerName: "Buyer Pin",
            field: "buyerPin",
            sortable: true,
            filter: true,
            width: 120
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
                        className="btn btn-sm btn-outline-info"
                        onClick={() => handleDetailsClick(params.data.orderId, params.data.status, params.data.invoiceNo)}
                    >
                        <FaInfoCircle /> Details
                    </button>
                </div>
            ),
            width: 150
        },
        {
            headerName: "Status",
            field: "status",
            cellRenderer: (params) => (
                <StatusCellEditor
                    value={params.value}
                    onValueChange={(newStatus) => onStatusChange(params.data.orderId, newStatus)}
                />
            ),
            width: 150
        },
        {
            headerName: "Invoice No.",
            field: "invoiceNo",
            sortable: true,
            filter: true,
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    {params.value && params.value.trim() ? (
                        <span>{params.value}</span>
                    ) : (
                        <span className="text-muted">No Invoice No.</span>
                    )}
                </div>
            ),
            width: 150
        },
        {
            headerName: "Invoice",
            cellRenderer: (params) => (
                <div className="d-flex justify-content-center align-items-center h-100">
                    {params.data.hasDocuments ? (
                        <button
                            className="btn btn-sm btn-outline-primary"
                            style={{ fontSize: "12px" }}
                            onClick={() => handleDownload(params.data.orderId)}
                        >
                            <FaDownload /> Download
                        </button>
                    ) : (
                        <span className="text-muted">No Invoice</span>
                    )}
                </div>
            ),
            width: 150
        },
        {
            headerName: "SLAM IDs",
            field: "slamId",
            sortable: true,
            filter: true,
            width: 120
        },
        {
            headerName: "RTS ID",
            field: "rtsId",
            sortable: true,
            filter: true,
            width: 150
        }
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

            {/* Submit button for changes */}
            <div className="mt-3 text-end">
                <button
                    className="btn btn-primary"
                    onClick={handleSubmitChanges}
                    disabled={!rowData.some(row => row.isChanged)}
                >
                    Submit
                </button>
            </div>
        </>
    )
}

export default PackedTbl;





































// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import '../orders.css';
// import { FaDownload, FaInfoCircle } from "react-icons/fa";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import { BASE_URL } from "../../../../config/urls";
// import Loader from "../../../../components/loader/Loader";

// const PackedTbl = () => {
//     const navigate = useNavigate();
//     const [rowData, setRowData] = useState([]);

//     const [loading, setLoading] = useState(false);
//     const sellerId = useSelector((state) => state.auth?.sellerId);

//     console.log(sellerId, "sellerId in order")

//     // Fetch data from API
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${BASE_URL}/order/detail?sellerId=${sellerId}&status=PCKD`);
//                 if (response?.data?.rcode === 0 && response?.data?.coreData?.responseData?.sellerOrders) {
//                     console.log(response, "packed orders response")
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
//         {
//             headerName: "Buyer Pin",
//             field: "buyerPin",
//             sortable: true,
//             filter: true,
//             width: 120
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
//         {
//             headerName: "Take Action",
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     <button
//                         className="btn btn-sm btn-outline-info"
//                     // onClick={() => handleDetailsClick(params.data.orderId, params.data.status, params.data.invoiceNo.trim())}
//                     >
//                         <FaInfoCircle /> Details
//                     </button>
//                 </div>
//             ),
//             width: 150
//         },
//         {
//             headerName: "Status",
//             field: "status",
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center">
//                     <span className={`status-badge ${params?.value?.toLowerCase().replace(' ', '-')}`}>
//                         {params.value}
//                     </span>
//                 </div>
//             ),
//             width: 150
//         },
//         {
//             headerName: "Invoice No.",
//             field: "invoiceNo",
//             sortable: true,
//             filter: true,
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     {params.value && params.value.trim() ? (
//                         <span>{params.value}</span>
//                     ) : (
//                         <span className="text-muted">No Invoice No.</span>
//                     )}
//                 </div>
//             ),
//             width: 150
//         },
//         {
//             headerName: "Invoice",
//             cellRenderer: (params) => (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                     {params.data.hasDocuments ? (
//                         <button
//                             className="btn btn-sm btn-outline-primary"
//                             style={{ fontSize: "12px" }}
//                             onClick={() => handleDownload(params.data.orderId)}
//                         >
//                             <FaDownload /> Download
//                         </button>
//                     ) : (
//                         <span className="text-muted">No Invoice</span>
//                     )}
//                 </div>
//             ),
//             width: 150
//         },
//         {
//             headerName: "SLAM IDs",
//             field: "slamId",
//             sortable: true,
//             filter: true,
//             width: 120
//         },
//         {
//             headerName: "RTS ID",
//             field: "rtsId",
//             sortable: true,
//             filter: true,
//             width: 150
//         }
//     ]);



//     return (
//         <>
//             {loading && <Loader message="Loading Orders..." />}
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

// export default PackedTbl;

