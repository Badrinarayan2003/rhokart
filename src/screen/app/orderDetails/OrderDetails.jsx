import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { toast } from "react-toastify";
import './orderDetails.css';
import Loader from "../../../components/loader/Loader";
import { FaEdit, FaPlus, FaSync } from "react-icons/fa";
import { BASE_URL } from "../../../config/urls";

const OrderDetails = () => {
    const location = useLocation();
    const { orderId, status } = location.state || {};
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shipments, setShipments] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState("");
    const [totalPackedQuantity, setTotalPackedQuantity] = useState(0);
    const [totalOrderUnits, setTotalOrderUnits] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showShipmentDetails, setShowShipmentDetails] = useState(false);
    const [hasPackedQuantityChanges, setHasPackedQuantityChanges] = useState(false);

    // Function to add new shipment box
    const addNewShipmentBox = () => {
        const nextBoxNo = shipments.length > 0 ?
            Math.max(...shipments.map(box => box.boxNo)) + 1 : 1;

        const newShipment = {
            boxNo: nextBoxNo,
            boxLength: null,
            boxBreadth: null,
            boxHeight: null,
            boxWeight: null
        };

        setShipments([...shipments, newShipment]);
    };

    // Custom cell renderer with edit icon
    const cellRendererWithEditIcon = (params) => {
        const [isActive, setIsActive] = useState(false);

        const handleClick = (e) => {
            if (showShipmentDetails) return; // Disable editing when shipment details are visible

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
                    cursor: showShipmentDetails ? 'default' : 'pointer',
                    padding: '0 8px',
                    backgroundColor: isActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent'
                }}
            >
                <span>{params.value}</span>
                {!showShipmentDetails && <FaEdit className="text-primary" style={{ opacity: 0.7, fontSize: '14px' }} />}
            </div>
        );
    };

    // Fetch order details
    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/order/info?orderId=${orderId}`);
            if (response?.data?.rcode === 0) {
                const data = response.data.coreData.responseData;
                const details = data.orderDataDetails || [];
                console.log(response, "order details response")
                // Set order details with packed units
                setOrderDetails(details.map(item => ({
                    ...item,
                    lastEditedFields: []
                })));

                // Calculate totals
                const totalPacked = details.reduce((sum, item) => sum + (item.packedUnits || 0), 0);
                // const totalOrder = details.reduce((sum, item) => sum + (item.orderUnits || 0), 0);

                setTotalPackedQuantity(totalPacked);
                setTotalOrderUnits(data.totalUnits);
                setTotalPrice(data.totalPrice || 0);

                // Transform shipments data if exists
                const apiShipments = data.shipments || [];
                const transformedShipments = apiShipments.map(shipment => ({
                    boxNo: shipment.boxNo,
                    boxLength: shipment.length,
                    boxBreadth: shipment.breadth,
                    boxHeight: shipment.height,
                    boxWeight: shipment.weight,
                    shipId: shipment.shipId
                }));

                setShipments(transformedShipments);
                // setInvoiceNo(data.invoiceId || "");

                // Hide shipment details initially
                setShowShipmentDetails(false);
                setHasPackedQuantityChanges(false);
            } else {
                toast.error(response?.data?.rmessage || "Failed to load order details");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Error loading order details");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!orderId) {
            console.error("No orderId found in location state");
            setLoading(false);
            return;
        }
        fetchOrderDetails();
    }, [orderId]);

    const handlePackedUnitsChange = (params) => {
        // Validate that packed units don't exceed order units
        if (params.newValue > params.data.orderUnits) {
            toast.warning("Packed quantity cannot exceed order quantity");
            return false; // Prevent the change
        }

        // Show warning when changing from non-zero to zero
        if (params.value > 0 && params.newValue === 0) {
            toast.warning("Setting packed quantity to zero will cancel this order item");
        }

        const updatedDetails = orderDetails.map(item => {
            if (item.dtlId === params.data.dtlId) {
                return {
                    ...item,
                    packedUnits: params.newValue,
                    lastEditedFields: [...new Set([...item.lastEditedFields, 'packedUnits'])]
                };
            }
            return item;
        });

        setOrderDetails(updatedDetails);
        setHasPackedQuantityChanges(true);

        // Update total packed quantity
        // const totalPacked = updatedDetails.reduce((sum, item) => sum + (item.packedUnits || 0), 0);
        // setTotalPackedQuantity(totalPacked);
    };

    const handleShipmentChange = (index, field, value) => {
        const updatedShipments = [...shipments];
        updatedShipments[index][field] = parseFloat(value) || 0;
        setShipments(updatedShipments);
    };

    const handleSaveOrderDetails = async () => {
        setLoading(true);
        try {

            // First calculate what the new total packed quantity would be
            const newTotalPacked = orderDetails.reduce((sum, item) => sum + (item.packedUnits || 0), 0);

            // Prepare the order updates payload
            const orderUpdates = orderDetails.map(item => ({
                dtlId: item.dtlId,
                skuId: item.skuId,
                orderUnits: item.orderUnits,
                packedUnits: item.packedUnits || 0
            }));

            // Call the order update API
            const response = await axios.post(
                `${BASE_URL}/order/orderupdate`,
                {
                    orderId: orderId,
                    status: status,
                    orderUpdates: orderUpdates
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response?.data?.rcode === 0) {
                // Only update the total packed quantity after successful save
                setTotalPackedQuantity(newTotalPacked);
                toast.success(response?.data?.coreData?.responseData?.message || "Order details updated successfully!");
                setShowShipmentDetails(true);
                setHasPackedQuantityChanges(false);
                console.log(totalPackedQuantity, "this totalPackedQuantity in rcode zero")
                // If no shipments exist but we have packed items, add a default box
                if (shipments.length === 0 && newTotalPacked > 0) {
                    addNewShipmentBox();
                }
            } else {
                toast.error(response?.data?.rmessage || "Failed to update order details");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error saving order details:", error);
            toast.error("Failed to save order details");
            setLoading(false);
        }
    };

    const handleShipmentUpdate = async () => {
        setLoading(true);
        try {
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

            const response = await axios.post(
                `${BASE_URL}/order/shipmentupdate`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(response, "shipment update api response")
            if (response?.data?.rcode === 0) {
                toast.success(response?.data?.coreData?.responseData?.message || "Shipment updated successfully!");
                // Refresh the data
                // fetchOrderDetails();
            } else {
                toast.error(response?.data?.rmessage || "Failed to update shipment");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error updating shipment:", error);
            toast.error("Error updating shipment. Please try again.");
            setLoading(false);
        }
    };

    const refreshPage = () => {
        fetchOrderDetails();
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
            headerName: "Unit Price (₹) incl. gst",
            field: "unitPrice",
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: params => params.value.toFixed(2),
            width: 190
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
            editable: !showShipmentDetails, // Make editable only when shipment details are not shown
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
                return {
                    backgroundColor: 'rgb(224 249 217)',
                    pointerEvents: showShipmentDetails ? 'none' : 'auto'
                };
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

    return (
        <>
            {loading && <Loader message="Loading" />}
            <div className="container mt-1">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-2 text-dark">Order ID: {orderId}</h4>
                    <div className="text-end">
                        <h5 className="text-dark">Total Price: ₹{totalPrice.toFixed(2)}</h5>
                    </div>
                </div>

                <div className={`mb-4 ${showShipmentDetails ? 'opacity-50' : ''}`}>
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
                            stopEditingWhenCellsLoseFocus={true}
                        />
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-2">
                        <h6 className="text-dark">Total Order Units: {totalOrderUnits}</h6>
                        <h6 className="text-dark">Total Packed Quantity: {totalPackedQuantity}</h6>
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-3">
                        <button
                            className={`save-change-btn ${!hasPackedQuantityChanges ? 'disabled-save-btn' : ''}`}
                            onClick={handleSaveOrderDetails}
                            disabled={!hasPackedQuantityChanges || showShipmentDetails}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {showShipmentDetails && (
                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold color-headline m-0">Shipment Details (for pickup & logistics)</h5>
                            {/* <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={refreshPage}
                            >
                                <FaSync className="me-1" /> Refresh
                            </button> */}
                        </div>
                        <div className="row mb-3">
                            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
                                <label className="form-label">Enter the invoice no. for this shipment</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter the invoice number of your own system, if any"
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
                                                value={shipment.boxLength || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxLength', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Breadth (cm), B</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={shipment.boxBreadth || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxBreadth', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Height (cm), H</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={shipment.boxHeight || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxHeight', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Weight (kg), Wt</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={shipment.boxWeight || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxWeight', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            className="save-change-btn mb-3"
                            onClick={addNewShipmentBox}
                        >
                            <FaPlus className="me-1" /> Add more boxes for this order
                        </button>

                        <div className="d-flex justify-content-end">
                            <button
                                className="save-change-btn me-3"
                                onClick={refreshPage}
                            >
                                <FaSync className="me-1" /> Back to update
                            </button>
                            <button
                                className="save-change-btn"
                                onClick={handleShipmentUpdate}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrderDetails;


































// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import axios from "axios";
// import { toast } from "react-toastify";
// import './orderDetails.css';
// import Loader from "../../../components/loader/Loader";
// import { FaEdit, FaPlus } from "react-icons/fa";
// import { BASE_URL } from "../../../config/urls";

// const OrderDetails = () => {
//     const location = useLocation();
//     const { orderId, status } = location.state || {};
//     const [orderDetails, setOrderDetails] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [shipments, setShipments] = useState([]);
//     const [invoiceNo, setInvoiceNo] = useState("");
//     const [totalPackedQuantity, setTotalPackedQuantity] = useState(0);
//     const [orderDetailsSaved, setOrderDetailsSaved] = useState(false);
//     const [hasPackedQuantityChanges, setHasPackedQuantityChanges] = useState(false);

//     console.log(orderId, status, "orderId , status, from orders component")
//     // Function to add new shipment box
//     const addNewShipmentBox = () => {

//         // if (!orderDetailsSaved) {
//         //     toast.warning("Please save order details first before adding boxes");
//         //     return;
//         // }

//         // if (totalPackedQuantity <= 0) {
//         //     toast.warning("Cannot add boxes when total packed quantity is zero");
//         //     return;
//         // }

//         // Calculate next box number
//         const nextBoxNo = shipments.length > 0 ?
//             Math.max(...shipments.map(box => box.boxNo)) + 1 : 1;

//         const newShipment = {
//             boxNo: nextBoxNo,
//             boxLength: null,
//             boxBreadth: null,
//             boxHeight: null,
//             boxWeight: null
//         };

//         setShipments([...shipments, newShipment]);
//     };

//     // Initialize with empty box if no shipments from API
//     useEffect(() => {
//         if (!loading && shipments.length === 0) {
//             addNewShipmentBox();
//         }
//     }, [loading, shipments.length]);

//     // Custom cell renderer with edit icon
//     const cellRendererWithEditIcon = (params) => {
//         const [isActive, setIsActive] = useState(false);

//         const handleClick = (e) => {
//             setIsActive(true);
//             setTimeout(() => {
//                 params.api.startEditingCell({
//                     rowIndex: params.rowIndex,
//                     colKey: params.column.getId()
//                 });
//             }, 50);
//             const stopEditingHandler = () => {
//                 setIsActive(false);
//                 params.api.removeEventListener('cellEditingStopped', stopEditingHandler);
//             };
//             params.api.addEventListener('cellEditingStopped', stopEditingHandler);
//         };

//         return (
//             <div
//                 className="d-flex align-items-center justify-content-between w-100 h-100"
//                 onClick={handleClick}
//                 style={{
//                     cursor: 'pointer',
//                     padding: '0 8px',
//                     backgroundColor: isActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent'
//                 }}
//             >
//                 <span>{params.value}</span>
//                 <FaEdit className="text-primary" style={{ opacity: 0.7, fontSize: '14px' }} />
//             </div>
//         );
//     };

//     console.log(orderDetailsSaved, "orderDetailsSaved")
//     console.log(totalPackedQuantity, "totalPackedQuantity")
//     // And in your useEffect for initial data:
//     useEffect(() => {
//         if (!orderId) {
//             console.error("No orderId found in location state");
//             setLoading(false);
//             return;
//         }

//         const fetchOrderDetails = async () => {
//             try {
//                 const response = await axios.get(`${BASE_URL}/order/info?orderId=${orderId}`);
//                 if (response?.data?.rcode === 0) {
//                     console.log(response, "api response for order detail")
//                     const details = response?.data?.coreData?.responseData?.orderDataDetails || [];
//                     const detailsWithEditTracking = details.map(item => ({
//                         ...item,
//                         lastEditedFields: [],
//                         packedUnits: item?.packedUnits
//                     }));
//                     setOrderDetails(detailsWithEditTracking);
//                     // Calculate total packed quantity
//                     const totalPacked = detailsWithEditTracking.reduce(
//                         (sum, item) => sum + (item.packedUnits || 0),
//                         0
//                     );
//                     setTotalPackedQuantity(totalPacked);
//                     // Transform API data
//                     const apiShipments = response?.data?.coreData?.responseData?.shipments || [];
//                     const transformedShipments = apiShipments.map(shipment => ({
//                         boxNo: shipment.boxNo,
//                         boxLength: shipment.length,
//                         boxBreadth: shipment.breadth,
//                         boxHeight: shipment.height,
//                         boxWeight: shipment.weight,
//                         shipId: shipment.shipId // Keep shipId from API
//                     }));

//                     // setShipments(transformedShipments.length > 0 ? transformedShipments : [{
//                     //     boxNo: 1,
//                     //     boxLength: null,
//                     //     boxBreadth: null,
//                     //     boxHeight: null,
//                     //     boxWeight: null
//                     //     // No shipId for initial empty box
//                     // }]);
//                     setShipments(transformedShipments.length > 0 ? transformedShipments : []);
//                     // setOrderDetailsSaved(transformedShipments.length > 0); // If we have shipments, consider details saved
//                     const hasPackedItems = detailsWithEditTracking.some(item => item.packedUnits > 0);
//                     setOrderDetailsSaved(transformedShipments.length > 0 || hasPackedItems);
//                     setHasPackedQuantityChanges(false); // Reset changes flag when loading new data
//                 } else {
//                     toast.error(response?.data?.rmessage || "Failed to load order details");
//                     console.error("order details failed:", response?.data);
//                 }
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching order details:", error);
//                 setLoading(false);
//             }
//         };

//         fetchOrderDetails();
//     }, [orderId]);

//     // Add this useEffect to log shipments after state updates
//     useEffect(() => {
//         console.log("Current shipments state:", shipments);
//     }, [shipments]);


//     // useEffect(() => {
//     //     const total = orderDetails.reduce((sum, item) => sum + (item.packedUnits || 0), 0);
//     //     setTotalPackedQuantity(total);
//     // }, [orderDetails]);


//     const handlePackedUnitsChange = (params) => {
//         const updatedDetails = orderDetails.map(item => {
//             if (item.dtlId === params.data.dtlId) {
//                 return {
//                     ...item,
//                     packedUnits: params.newValue,
//                     lastEdited: new Date(),
//                     lastEditedFields: [...new Set([...item.lastEditedFields, 'packedUnits'])]
//                 };
//             }
//             return item;
//         });
//         setOrderDetails(updatedDetails);
//         setHasPackedQuantityChanges(true); // Set changes flag when packed units are modified
//     };

//     const handleShipmentChange = (index, field, value) => {

//         if (!orderDetailsSaved) {
//             toast.warning("Please save order details first before modifying shipment details");
//             return;
//         }

//         if (totalPackedQuantity <= 0) {
//             toast.warning("Cannot modify shipment details when total packed quantity is zero");
//             return;
//         }

//         const updatedShipments = [...shipments];
//         updatedShipments[index][field] = parseFloat(value) || 0;
//         setShipments(updatedShipments);
//     };

//     // const handleSaveOrderDetails = async () => {
//     //     try {
//     //         const total = orderDetails.reduce((sum, item) => sum + (item.packedUnits || 0), 0);
//     //         setTotalPackedQuantity(total);
//     //         setOrderDetailsSaved(true);
//     //         setHasPackedQuantityChanges(false); // Reset changes flag after saving
//     //         toast.success("Order details saved. You can now edit shipment details.");
//     //         console.log("Updated order details:", orderDetails);

//     //         if (shipments.length === 0 && totalPackedQuantity > 0) {
//     //             addNewShipmentBox();
//     //         }
//     //     } catch (error) {
//     //         console.error("Error saving order details:", error);
//     //         toast.error("Failed to save order details");
//     //     }
//     // };



//     const handleSaveOrderDetails = async () => {
//         try {
//             // First validate packed quantities don't exceed order quantities
//             const hasInvalidQuantities = orderDetails.some(item =>
//                 item.packedUnits > item.orderUnits
//             );

//             if (hasInvalidQuantities) {
//                 toast.error("Packed quantities cannot exceed order quantities");
//                 return;
//             }

//             const total = orderDetails.reduce((sum, item) => sum + (item.packedUnits || 0), 0);
//             setTotalPackedQuantity(total);

//             // Prepare the order updates payload
//             const orderUpdates = orderDetails.map(item => ({
//                 dtlId: item.dtlId,
//                 skuId: item.skuId,
//                 orderUnits: item.orderUnits,
//                 packedUnits: item.packedUnits || 0
//             }));

//             // Call the order update API
//             const response = await axios.post(
//                 `${BASE_URL}/order/orderupdate`,
//                 {
//                     orderId: orderId,
//                     status: status,
//                     orderUpdates: orderUpdates
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (response?.data?.rcode === 0) {
//                 setOrderDetailsSaved(true);
//                 setHasPackedQuantityChanges(false);
//                 toast.success(response?.data?.coreData?.responseData?.message || "Order details updated successfully!");

//                 if (shipments.length === 0 && totalPackedQuantity > 0) {
//                     addNewShipmentBox();
//                 }
//             } else {
//                 toast.error(response?.data?.rmessage || "Failed to update order details");
//             }
//         } catch (error) {
//             console.error("Error saving order details:", error);
//             toast.error("Failed to save order details");
//         }
//     };


//     const [columnDefs] = useState([
//         {
//             headerName: "SL No.",
//             valueGetter: (params) => params.node.rowIndex + 1,
//             width: 90
//         },
//         {
//             headerName: "Parent Listing",
//             field: "parentListingName",
//             sortable: true,
//             filter: true,
//             width: 260
//         },
//         {
//             headerName: "Child Listing/item",
//             field: "childListingName",
//             sortable: true,
//             filter: true,
//             width: 420
//         },
//         {
//             headerName: "Unit Price (₹) incl. gst",
//             field: "unitPrice",
//             sortable: true,
//             filter: 'agNumberColumnFilter',
//             valueFormatter: params => params.value.toFixed(2),
//             width: 190
//         },
//         {
//             headerName: "Order Qty (units)",
//             field: "orderUnits",
//             sortable: true,
//             filter: 'agNumberColumnFilter',
//             width: 120
//         },
//         {
//             headerName: "Packed Qty (units)",
//             field: "packedUnits",
//             editable: true,
//             sortable: true,
//             filter: 'agNumberColumnFilter',
//             width: 150,
//             cellRenderer: cellRendererWithEditIcon,
//             cellStyle: (params) => {
//                 const isEdited = params.data.lastEditedFields?.includes('packedUnits');
//                 const exceedsOrder = params.value > params.data.orderUnits;

//                 if (exceedsOrder) {
//                     return {
//                         backgroundColor: 'rgba(255, 0, 0, 0.3)',
//                         border: '2px solid red'
//                     };
//                 }
//                 if (isEdited) {
//                     return {
//                         backgroundColor: 'rgba(255, 255, 0, 0.3)',
//                         border: '2px solid orange'
//                     };
//                 }
//                 return { backgroundColor: 'rgb(224 249 217)' };
//             },
//             singleClickEdit: true,
//         },
//     ]);

//     if (!orderId) {
//         return (
//             <div className="container mt-4">
//                 <div className="alert alert-warning text-center">
//                     No order selected. Please go back and select an order.
//                 </div>
//             </div>
//         );
//     }



//     const handleShipmentUpdate = async () => {
//         try {
//             // Validate invoice number
//             if (!invoiceNo) {
//                 toast.warning("Please enter an invoice number");
//                 return;
//             }

//             // Prepare the request payload
//             const payload = {
//                 orderId: orderId,
//                 status: status,
//                 invoiceNo: invoiceNo,
//                 shipmentUpdates: shipments.map(shipment => ({
//                     boxNo: shipment.boxNo,
//                     boxLength: shipment.boxLength,
//                     boxBreadth: shipment.boxBreadth,
//                     boxHeight: shipment.boxHeight,
//                     boxWeight: shipment.boxWeight
//                 }))
//             };

//             console.log("Sending shipment update:", payload);

//             const response = await axios.post(
//                 `${BASE_URL}/order/shipmentupdate`,
//                 payload,
//                 {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (response?.data?.rcode === 0) {
//                 toast.success(response?.data?.coreData?.responseData?.message || "Shipment updated successfully!");
//                 console.log("Update successful:", response.data);
//             } else {
//                 toast.error(response?.data?.rmessage || "Failed to update shipment");
//                 console.error("Update failed:", response?.data);
//             }
//         } catch (error) {
//             console.error("Error updating shipment:", error);
//             toast.error("Error updating shipment. Please try again.");
//         }
//     };







//     return (
//         <>
//             {loading && <Loader message="Loading order details..." />}
//             <div className="container mt-1">
//                 <div className="mb-4">
//                     <h4 className="mb-2 text-dark">Order ID: {orderId}</h4>
//                     <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
//                         <AgGridReact
//                             rowData={orderDetails}
//                             columnDefs={columnDefs}
//                             onCellValueChanged={handlePackedUnitsChange}
//                             defaultColDef={{
//                                 resizable: true,
//                                 sortable: true,
//                                 filter: true
//                             }}
//                             suppressCellFocus={true}
//                             stopEditingWhenCellsLoseFocus={true} // Add this line
//                         />
//                     </div>
//                     <div className="d-flex justify-content-end mb-4 mt-3">
//                         <button
//                             className={`save-change-btn ${!hasPackedQuantityChanges ? 'disabled-save-btn' : ''}`}
//                             onClick={handleSaveOrderDetails}
//                             disabled={!hasPackedQuantityChanges}
//                         >
//                             Save Changes
//                         </button>
//                     </div>
//                 </div>

//                 <div className="mb-5">
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5 className="fw-bold color-headline m-0">Shipment Details (for pickup & logistics)</h5>
//                     </div>
//                     <div className="row mb-3">
//                         <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
//                             <label className="form-label">Enter the invoice no. for this shipment</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Enter the invoice number of your own system, if any"
//                                 value={invoiceNo}
//                                 onChange={(e) => setInvoiceNo(e.target.value)}
//                                 disabled={!orderDetailsSaved || totalPackedQuantity <= 0}
//                             />
//                         </div>
//                     </div>
//                     {shipments.map((shipment, index) => (
//                         <div key={index} className="card mb-3 p-0" style={{ backgroundColor: "#fff" }}>
//                             <div className="card-body">
//                                 <h5 className="card-title">Box No: {shipment.boxNo}</h5>
//                                 <div className="row g-3">
//                                     <div className="col-md-3">
//                                         <label className="form-label">Length (cm), L</label>
//                                         <input
//                                             type="number"
//                                             className="form-control"
//                                             value={shipment.boxLength}
//                                             onChange={(e) => handleShipmentChange(index, 'boxLength', e.target.value)}
//                                             disabled={!orderDetailsSaved || totalPackedQuantity <= 0}
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label className="form-label">Breadth (cm), B</label>
//                                         <input
//                                             type="number"
//                                             className="form-control"
//                                             value={shipment.boxBreadth}
//                                             onChange={(e) => handleShipmentChange(index, 'boxBreadth', e.target.value)}
//                                             disabled={!orderDetailsSaved || totalPackedQuantity <= 0}
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label className="form-label">Height (cm), H</label>
//                                         <input
//                                             type="number"
//                                             className="form-control"
//                                             value={shipment.boxHeight}
//                                             onChange={(e) => handleShipmentChange(index, 'boxHeight', e.target.value)}
//                                             disabled={!orderDetailsSaved || totalPackedQuantity <= 0}
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label className="form-label">Weight (kg), Wt</label>
//                                         <input
//                                             type="number"
//                                             className="form-control"
//                                             value={shipment.boxWeight}
//                                             onChange={(e) => handleShipmentChange(index, 'boxWeight', e.target.value)}
//                                             disabled={!orderDetailsSaved || totalPackedQuantity <= 0}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                     <button
//                         className={`save-change-btn ${(!orderDetailsSaved || totalPackedQuantity <= 0) ? 'disabled-save-btn' : ''}`}
//                         onClick={addNewShipmentBox}
//                         disabled={!orderDetailsSaved || totalPackedQuantity <= 0}
//                     >
//                         <FaPlus className="me-1" /> Add more boxes for this order
//                     </button>
//                 </div>

//                 <div className="d-flex justify-content-end mb-4">
//                     <button
//                         className={`save-change-btn ${(!orderDetailsSaved || totalPackedQuantity <= 0) ? 'disabled-save-btn' : ''}`}
//                         onClick={handleShipmentUpdate}
//                         disabled={!orderDetailsSaved || totalPackedQuantity <= 0}
//                     >
//                         Submit
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default OrderDetails;






