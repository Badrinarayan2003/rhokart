import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { toast } from "react-toastify";
import './orderDetails.css';
import Loader from "../../../components/loader/Loader";
import { FaEdit, FaPlus } from "react-icons/fa";
import { BASE_URL } from "../../../config/urls";

const OrderDetails = () => {
    const location = useLocation();
    const { orderId, status } = location.state || {};
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shipments, setShipments] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState('');

    console.log(orderId, status)
    // Function to add new shipment box
    const addNewShipmentBox = () => {
        // Calculate next box number
        const nextBoxNo = shipments.length > 0 ?
            Math.max(...shipments.map(box => box.boxNo)) + 1 : 1;

        const newShipment = {
            boxNo: nextBoxNo,
            boxLength: 0,
            boxBreadth: 0,
            boxHeight: 0,
            boxWeight: 0
        };

        setShipments([...shipments, newShipment]);
    };

    // Initialize with empty box if no shipments from API
    useEffect(() => {
        if (!loading && shipments.length === 0) {
            addNewShipmentBox();
        }
    }, [loading, shipments.length]);

    // Custom cell renderer with edit icon
    const cellRendererWithEditIcon = (params) => {
        const [isActive, setIsActive] = useState(false);

        const handleClick = (e) => {
            setIsActive(true);
            setTimeout(() => {
                params.api.startEditingCell({
                    rowIndex: params.rowIndex,
                    colKey: params.column.getId()
                });
            }, 50);

            const stopEditingHandler = () => {
                setIsActive(false);
                params.api.removeEventListener('cellEditingStopped', stopEditingHandler);
            };
            params.api.addEventListener('cellEditingStopped', stopEditingHandler);
        };

        return (
            <div
                className="d-flex align-items-center justify-content-between w-100 h-100"
                onClick={handleClick}
                style={{
                    cursor: 'pointer',
                    padding: '0 8px',
                    backgroundColor: isActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent'
                }}
            >
                <span>{params.value}</span>
                <FaEdit className="text-primary" style={{ opacity: 0.7, fontSize: '14px' }} />
            </div>
        );
    };

    // And in your useEffect for initial data:
    useEffect(() => {
        if (!orderId) {
            console.error("No orderId found in location state");
            setLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/order/info?orderId=${orderId}`);
                if (response?.data?.rcode === 0) {
                    console.log(response, "api response for order tail")
                    const details = response?.data?.coreData?.responseData?.orderDataDetails || [];
                    const detailsWithEditTracking = details.map(item => ({
                        ...item,
                        lastEditedFields: []
                    }));
                    setOrderDetails(detailsWithEditTracking);

                    // Transform API data
                    const apiShipments = response?.data?.coreData?.responseData?.shipments || [];
                    const transformedShipments = apiShipments.map(shipment => ({
                        boxNo: shipment.boxNo,
                        boxLength: shipment.length,
                        boxBreadth: shipment.breadth,
                        boxHeight: shipment.height,
                        boxWeight: shipment.weight,
                        shipId: shipment.shipId // Keep shipId from API
                    }));

                    setShipments(transformedShipments.length > 0 ? transformedShipments : [{
                        boxNo: 1,
                        boxLength: 0,
                        boxBreadth: 0,
                        boxHeight: 0,
                        boxWeight: 0
                        // No shipId for initial empty box
                    }]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // Add this useEffect to log shipments after state updates
    useEffect(() => {
        console.log("Current shipments state:", shipments);
    }, [shipments]);



    const handlePackedUnitsChange = (params) => {
        const updatedDetails = orderDetails.map(item => {
            if (item.dtlId === params.data.dtlId) {
                return {
                    ...item,
                    packedUnits: params.newValue,
                    lastEdited: new Date(),
                    lastEditedFields: [...new Set([...item.lastEditedFields, 'packedUnits'])]
                };
            }
            return item;
        });
        setOrderDetails(updatedDetails);
    };

    const handleShipmentChange = (index, field, value) => {
        const updatedShipments = [...shipments];
        updatedShipments[index][field] = parseFloat(value) || 0;
        setShipments(updatedShipments);
    };

    const [columnDefs] = useState([
        {
            headerName: "SL No.",
            valueGetter: (params) => params.node.rowIndex + 1,
            width: 90
        },
        {
            headerName: "Parent Listing",
            field: "parentListingName",
            sortable: true,
            filter: true,
            width: 260
        },
        {
            headerName: "Child Listing/item",
            field: "childListingName",
            sortable: true,
            filter: true,
            width: 420
        },
        {
            headerName: "Unit Price (₹)",
            field: "unitPrice",
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: params => params.value.toFixed(2),
            width: 150
        },
        {
            headerName: "Order Qty (units)",
            field: "orderUnits",
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 120
        },
        {
            headerName: "Packed Qty (units)",
            field: "packedUnits",
            editable: true,
            sortable: true,
            filter: 'agNumberColumnFilter',
            width: 150,
            cellRenderer: cellRendererWithEditIcon,
            cellStyle: (params) => {
                const isEdited = params.data.lastEditedFields?.includes('packedUnits');
                const exceedsOrder = params.value > params.data.orderUnits;

                if (exceedsOrder) {
                    return {
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        border: '2px solid red'
                    };
                }
                if (isEdited) {
                    return {
                        backgroundColor: 'rgba(255, 255, 0, 0.3)',
                        border: '2px solid orange'
                    };
                }
                return { backgroundColor: 'rgb(224 249 217)' };
            },
            singleClickEdit: true,
        },
    ]);

    if (!orderId) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning text-center">
                    No order selected. Please go back and select an order.
                </div>
            </div>
        );
    }



    const handleShipmentUpdate = async () => {
        try {
            // Validate invoice number
            if (!invoiceNo) {
                toast.warning("Please enter an invoice number");
                return;
            }

            // Prepare the request payload
            const payload = {
                orderId: orderId,
                status: status,
                invoiceNo: invoiceNo,
                shipmentUpdates: shipments.map(shipment => ({
                    boxNo: shipment.boxNo,
                    boxLength: shipment.boxLength,
                    boxBreadth: shipment.boxBreadth,
                    boxHeight: shipment.boxHeight,
                    boxWeight: shipment.boxWeight
                }))
            };

            console.log("Sending shipment update:", payload);

            const response = await axios.post(
                `${BASE_URL}/order/shipmentupdate`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response?.data?.rcode === 0) {
                toast.success(response?.data?.coreData?.responseData?.message || "Shipment updated successfully!");
                console.log("Update successful:", response.data);
            } else {
                toast.error(response?.data?.rmessage || "Failed to update shipment");
                console.error("Update failed:", response?.data);
            }
        } catch (error) {
            console.error("Error updating shipment:", error);
            toast.error("Error updating shipment. Please try again.");
        }
    };







    return (
        <>
            {loading && <Loader message="Loading order details..." />}
            <div className="container mt-1">
                <div className="mb-4">
                    <h4 className="mb-2 text-dark">Order ID: {orderId}</h4>
                    <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
                        <AgGridReact
                            rowData={orderDetails}
                            columnDefs={columnDefs}
                            onCellValueChanged={handlePackedUnitsChange}
                            defaultColDef={{
                                resizable: true,
                                sortable: true,
                                filter: true
                            }}
                            suppressCellFocus={true}
                        />
                    </div>
                    <div className="d-flex justify-content-end mb-4 mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                console.log("Updated order details:", orderDetails);
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold color-headline m-0">Shipment Details (for pickup & logistics)</h5>
                    </div>
                    <div className="row mb-3">
                        <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
                            <label className="form-label">Enter the invoice no. for this shipment</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter invoice no."
                                value={invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                            />
                        </div>
                    </div>
                    {shipments.map((shipment, index) => (
                        <div key={index} className="card mb-3 p-0" style={{ backgroundColor: "#fff" }}>
                            <div className="card-body">
                                <h5 className="card-title">Box No: {shipment.boxNo}</h5>
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label">Length (cm), L</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={shipment.boxLength || 0}
                                            onChange={(e) => handleShipmentChange(index, 'boxLength', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Breadth (cm), B</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={shipment.boxBreadth || 0}
                                            onChange={(e) => handleShipmentChange(index, 'boxBreadth', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Height (cm), H</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={shipment.boxHeight || 0}
                                            onChange={(e) => handleShipmentChange(index, 'boxHeight', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Weight (kg), Wt</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={shipment.boxWeight || 0}
                                            onChange={(e) => handleShipmentChange(index, 'boxWeight', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={addNewShipmentBox}
                    >
                        <FaPlus className="me-1" /> Add more boxes for this order
                    </button>
                </div>

                <div className="d-flex justify-content-end mb-4">
                    <button
                        className="btn btn-primary"
                        onClick={handleShipmentUpdate}>
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;