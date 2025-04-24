// import './orders.css'

// const Orders = () => {
//     return (
//         <div className="order-section-page">
//             <div className='row'>
//                 <div className='col-12 d-flex justify-content-between gap-1'>
//                     <div className='order-status-box position-relative'>
//                         <p className='mb-0'>Order received & waiting for packing</p>
//                         <span className='order-status-indecator'></span>
//                     </div>
//                     <div className='order-status-box position-relative'>
//                         <p className='mb-0'>Order packed & waiting for peakup</p>
//                         <span className='order-status-indecator'></span>
//                     </div>
//                     <div className='order-status-box position-relative'>
//                         <p className='mb-0'>In transit orders</p>
//                         <span className='order-status-indecator'></span>
//                     </div>
//                     <div className='order-status-box position-relative'>
//                         <p className='mb-0'>Delivered</p>
//                         <span className='order-status-indecator'></span>
//                     </div>
//                     <div className='order-status-box position-relative'>
//                         <p className='mb-0'>Cancelled</p>
//                         <span className='order-status-indecator'></span>
//                     </div>
//                 </div>
//             </div>

//             <div className='row'>
//                 <div className='col-12'>

//                 </div>
//             </div>



//         </div>
//     )
// }

// export default Orders;















import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import './orders.css';

const Orders = () => {
    // Sample data for the orders table
    const [rowData] = useState([
        {
            slNo: 1,
            orderId: "ORD-1001",
            buyerName: "John Doe",
            buyerState: "Maharashtra",
            buyerDistrict: "Mumbai",
            itemsCount: 3,
            skuCount: 5,
            totalValue: 2499.00,
            invoiceNo: "INV-2023-1001",
            slamId: "SLAM-001",
            rtsId: "RTS-001"
        },
        {
            slNo: 2,
            orderId: "ORD-1002",
            buyerName: "Jane Smith",
            buyerState: "Karnataka",
            buyerDistrict: "Bangalore",
            itemsCount: 2,
            skuCount: 2,
            totalValue: 1599.00,
            invoiceNo: "INV-2023-1002",
            slamId: "SLAM-002",
            rtsId: "RTS-002"
        },
        {
            slNo: 3,
            orderId: "ORD-1003",
            buyerName: "Robert Johnson",
            buyerState: "Tamil Nadu",
            buyerDistrict: "Chennai",
            itemsCount: 5,
            skuCount: 7,
            totalValue: 5499.00,
            invoiceNo: "INV-2023-1003",
            slamId: "SLAM-003",
            rtsId: "RTS-003"
        },
        {
            slNo: 4,
            orderId: "ORD-1004",
            buyerName: "Emily Davis",
            buyerState: "Delhi",
            buyerDistrict: "New Delhi",
            itemsCount: 1,
            skuCount: 1,
            totalValue: 899.00,
            invoiceNo: "INV-2023-1004",
            slamId: "SLAM-004",
            rtsId: "RTS-004"
        },
        {
            slNo: 5,
            orderId: "ORD-1005",
            buyerName: "Michael Wilson",
            buyerState: "Uttar Pradesh",
            buyerDistrict: "Lucknow",
            itemsCount: 2,
            skuCount: 3,
            totalValue: 1998.00,
            invoiceNo: "INV-2023-1005",
            slamId: "SLAM-005",
            rtsId: "RTS-005"
        }
    ]);

    // Column definitions for the orders table
    const [columnDefs] = useState([
        {
            headerName: "SL No.",
            field: "slNo",
            sortable: true,
            width: 80
        },
        {
            headerName: "Order ID",
            field: "orderId",
            sortable: true,
            filter: true,
            cellStyle: { fontWeight: 'bold' },
            width: 120
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
            headerName: "No. of Items/SKU",
            field: "itemsCount",
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellRenderer: (params) => (
                <div>
                    <span>{params.data.itemsCount} / {params.data.skuCount}</span>
                </div>
            ),
            width: 130
        },
        {
            headerName: "Total Value (₹)",
            field: "totalValue",
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: params => params.value.toFixed(2),
            width: 120
        },
        {
            headerName: "Take Action",
            cellRenderer: (params) => (
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary">Process</button>
                    <button className="btn btn-sm btn-success">Print</button>
                </div>
            ),
            width: 150
        },
        {
            headerName: "Invoice No.",
            field: "invoiceNo",
            sortable: true,
            filter: true,
            width: 120
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
            width: 120
        }
    ]);

    return (
        <div className="order-section-page">
            <div className='row'>
                <div className='col-12 d-flex justify-content-between gap-1'>
                    <div className='order-status-box position-relative'>
                        <p className='mb-0'>Order received & waiting for packing</p>
                        <span className='order-status-indecator'></span>
                    </div>
                    <div className='order-status-box position-relative'>
                        <p className='mb-0'>Order packed & waiting for peakup</p>
                        <span className='order-status-indecator'></span>
                    </div>
                    <div className='order-status-box position-relative'>
                        <p className='mb-0'>In transit orders</p>
                        <span className='order-status-indecator'></span>
                    </div>
                    <div className='order-status-box position-relative'>
                        <p className='mb-0'>Delivered</p>
                        <span className='order-status-indecator'></span>
                    </div>
                    <div className='order-status-box position-relative'>
                        <p className='mb-0'>Cancelled</p>
                        <span className='order-status-indecator'></span>
                    </div>
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col-12'>
                    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
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
                </div>
            </div>
        </div>
    )
}

export default Orders;