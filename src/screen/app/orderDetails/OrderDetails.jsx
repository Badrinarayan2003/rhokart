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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUpload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";


const OrderDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sellerId = useSelector((state) => state.auth?.sellerId);
    console.log(sellerId, "seller id in orderDetails")

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
    const [fileUploads, setFileUploads] = useState({}); // Track uploaded files per box
    const [dimensionProperties, setDimensionProperties] = useState({
        length: { isActive: false, isEditable: false, isMandatory: false },
        breadth: { isActive: false, isEditable: false, isMandatory: false },
        height: { isActive: false, isEditable: false, isMandatory: false },
        weight: { isActive: true, isEditable: true, isMandatory: true }
    });
    const [sampleImage, setSampleImage] = useState("");
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [imgUrlDownload, setImgUrlDownload] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);

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
                const data = response?.data?.coreData?.responseData;
                setSampleImage(data?.sampleImageUrl)
                console.log(data?.sampleImageUrl, "image ");

                setDimensionProperties({
                    length: data.lengthProperty,
                    breadth: data.breadthProperty,
                    height: data.heightProperty,
                    weight: data.weightProperty
                });


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
        const totalPacked = updatedDetails.reduce((sum, item) => sum + (item.packedUnits || 0), 0);
        setTotalPackedQuantity(totalPacked);
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
                    sellerId: sellerId,
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
            console.log(response, "save chhange")
            if (response?.data?.rcode === 0) {
                // Only update the total packed quantity after successful save
                setTotalPackedQuantity(newTotalPacked);
                // toast.success(response?.data?.coreData?.responseData?.message || "Order details updated successfully!");
                setShowShipmentDetails(true);
                setHasPackedQuantityChanges(false);
                setImgUrlDownload(response?.data?.coreData?.responseData?.invoiceUrl)
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
        for (const boxNo in fileUploads) {
            if (!fileUploads[boxNo]) {
                toast.error(`Please upload photo for Box ${boxNo}`);
                return;
            }
        }

        const hasErrors = shipments.some(shipment => {
            // Check file upload
            if (!fileUploads[shipment.boxNo]) return true;

            // Check dimension properties
            if (dimensionProperties.length.isMandatory && !shipment.boxLength) return true;
            if (dimensionProperties.breadth.isMandatory && !shipment.boxBreadth) return true;
            if (dimensionProperties.height.isMandatory && !shipment.boxHeight) return true;
            if (dimensionProperties.weight.isMandatory && !shipment.boxWeight) return true;

            return false;
        });

        if (hasErrors) {
            toast.error("Please fill all mandatory fields for all boxes");
            return;
        }


        setLoading(true);
        try {
            // Prepare the request payload
            const payload = {
                orderId: orderId,
                status: status,
                sellerId: sellerId,
                invoiceNo: invoiceNo,
                shipmentUpdates: shipments.map(shipment => ({
                    boxNo: shipment.boxNo,
                    boxLength: shipment.boxLength,
                    boxBreadth: shipment.boxBreadth,
                    boxHeight: shipment.boxHeight,
                    boxWeight: shipment.boxWeight,
                    boxImageUrl: fileUploads[shipment.boxNo] || null
                }))
            };
            console.log(payload, "this payload");

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
                navigate("/orders");
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

    const handleFileUpload = async (boxNo, file) => {
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
            console.log(response, "uploud res");


            if (response?.data?.response?.rcode === 0) {
                const fileUrl = response?.data?.response?.coreData?.responseData?.uploadedFiles[0].url;
                setFileUploads(prev => ({
                    ...prev,
                    [boxNo]: fileUrl
                }));
                console.log(fileUrl);

                // toast.success("File uploaded successfully!");
            } else {
                toast.error("Failed to upload file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file");
        } finally {
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

    const handleDeleteBox = (boxNo) => {
        // Filter out the box with the given boxNo
        const updatedShipments = shipments.filter(box => box.boxNo !== boxNo);

        // Also remove any associated file upload for this box
        const updatedFileUploads = { ...fileUploads };
        delete updatedFileUploads[boxNo];

        setShipments(updatedShipments);
        setFileUploads(updatedFileUploads);

        toast.success(`Box ${boxNo} removed`);
    };

    return (
        <>
            {loading && <Loader message="Loading" />}
            <div className="container mt-1">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-2 text-dark">Order ID: {orderId}</h4>
                    <div className="text-end">
                        <h5 className="" style={{ color: "#1F8505" }}>Total Price: ₹{totalPrice.toFixed(2)}</h5>
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
                            onClick={() => setShowSaveModal(true)}
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
                        <div className="row mb-4">
                            <div className="col-6 col-md-6 d-flex flex-column">
                                <label className="form-label text-dark">Rhokart invoice printout to be pasted on all the packing boxes</label>
                                <div className="mt-2">
                                    <a className="down-btn" href={imgUrlDownload}>
                                        Download RHOKART invoice for shipment
                                    </a>
                                </div>
                            </div>
                            <div className="col-6 col-md-6">
                                <label className="form-label text-dark">Do you want to record your own system invoice for easy reconciliation?</label>
                                <div>
                                    <input
                                        style={{ width: "84%" }}
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter the invoice number of your own system, if any"
                                        value={invoiceNo}
                                        onChange={(e) => setInvoiceNo(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {shipments.map((shipment, index) => (
                            <div key={index} className="card mb-3 p-0" style={{ backgroundColor: "#fff" }}>
                                <div className="card-body position-relative">
                                    <h5 className="card-title d-flex align-items-center">Box No: {shipment.boxNo} <span className="text-danger" style={{ fontSize: "14px" }}> (Attach the photograph of this box packing. RHOKART invoice should be clearly visible in the box picture.)</span></h5>
                                    <span
                                        className="text-danger delete-box-icon"
                                        onClick={() => handleDeleteBox(shipment.boxNo)}
                                    ><MdDeleteForever size={25} /></span>
                                    <div className="row g-3">
                                        <div className="col-md-2">
                                            <label className="form-label box-lebel">Length (cm), L
                                                {dimensionProperties.length.isMandatory && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={shipment.boxLength || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxLength', e.target.value)}
                                                disabled={!dimensionProperties.length.isEditable}
                                                required={dimensionProperties.length.isMandatory}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label box-lebel">
                                                Breadth (cm), B
                                                {dimensionProperties.breadth.isMandatory && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={shipment.boxBreadth || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxBreadth', e.target.value)}
                                                disabled={!dimensionProperties.breadth.isEditable}
                                                required={dimensionProperties.breadth.isMandatory}
                                            />
                                        </div>

                                        <div className="col-md-2 ">
                                            <label className="form-label box-lebel">Height (cm), H
                                                {dimensionProperties.height.isMandatory && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={shipment.boxHeight || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxHeight', e.target.value)}
                                                disabled={!dimensionProperties.height.isEditable}
                                                required={dimensionProperties.height.isMandatory}
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <label className="form-label box-lebel">Weight (kg), Wt
                                                {dimensionProperties.weight.isMandatory && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={shipment.boxWeight || ''}
                                                onChange={(e) => handleShipmentChange(index, 'boxWeight', e.target.value)}
                                                disabled={!dimensionProperties.weight.isEditable}
                                                required={dimensionProperties.weight.isMandatory}
                                            />
                                        </div>
                                        {/* File upload field (always mandatory) */}

                                        <div className="col-md-2">
                                            <label className="form-label box-lebel">
                                                Attach box photo <span className="text-danger">*</span>
                                            </label>

                                            {/* Hidden file input */}
                                            <input
                                                type="file"
                                                id={`file-upload-${shipment.boxNo}`}
                                                className="d-none"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(shipment.boxNo, e.target.files[0])}
                                                required
                                            />
                                            {/* Custom styled upload button */}
                                            <button
                                                type="button"
                                                className="btn w-100 d-flex align-items-center justify-content-center"
                                                style={{ background: "#1F8505", color: '#fff' }}
                                                onClick={() => document.getElementById(`file-upload-${shipment.boxNo}`).click()}
                                            >
                                                <FaUpload className="me-1" />
                                                {/* {fileUploads[shipment.boxNo] ?
                                                    (() => {
                                                        // Extract filename after last underscore if URL exists
                                                        const url = fileUploads[shipment.boxNo];
                                                        const filename = url.substring(url.lastIndexOf('_') + 1);
                                                        return filename || 'File Uploaded';
                                                    })()
                                                    : 'Upload'
                                                } */}
                                                Upload
                                            </button>
                                            {/* Display file name below the button */}
                                            {fileUploads[shipment.boxNo] && (
                                                <div className="mt-1 text-center small">
                                                    {(() => {
                                                        const url = fileUploads[shipment.boxNo];
                                                        const filename = url.substring(url.lastIndexOf('_') + 1);
                                                        return filename || 'File Uploaded';
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                        {/* <div className="col-md-2">
                                            {sampleImage && (
                                                <img
                                                    src={sampleImage}
                                                    alt="Sample Box"
                                                    className="img-thumbnail w-auto h-100"
                                                    style={{ maxHeight: '100px' }}
                                                />
                                            )}
                                        </div> */}

                                        <div className="col-md-2">
                                            {sampleImage && (
                                                <div
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setShowImageModal(true)}
                                                >
                                                    <img
                                                        src={sampleImage}
                                                        alt="Sample Box"
                                                        className="img-thumbnail w-auto h-100"
                                                        style={{ maxHeight: '100px' }}
                                                    />
                                                </div>
                                            )}
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
                                className="save-change-btn mrg-in bg-secondary"
                                onClick={refreshPage}
                            >
                                <FaSync className="me-1" /> Back to update
                            </button>
                            <button
                                className="save-change-btn"
                                onClick={handleShipmentUpdate}
                                style={{
                                    cursor: shipments.length === 0 ? 'not-allowed' : 'pointer'
                                }}
                                disabled={shipments.length === 0}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            <div className={`modal fade ${showImageModal ? 'show' : ''}`} style={{ display: showImageModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sample Box Image</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowImageModal(false)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body text-center">
                            <img
                                src={sampleImage}
                                alt="Sample Box Preview"
                                className="img-fluid"
                                style={{ maxHeight: '70vh' }}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowImageModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showImageModal && <div className="modal-backdrop fade show"></div>}



            {/* Confirmation Modal */}
            <div className={`modal fade ${showSaveModal ? 'show' : ''}`} style={{ display: showSaveModal ? 'block' : 'none' }} >
                {/* ... rest of modal JSX ... */}
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header justify-content-center">
                            <h5 className="modal-title text-dark" style={{ fontWeight: '500', fontSize: '14px' }}>Have you packed these products in the quantity that you mentioned for each SKU?</h5>
                        </div>

                        <div className="modal-footer gap-5 d-flex justify-content-center">
                            <button
                                type="button"
                                className="go-back-btn"
                                onClick={() => setShowSaveModal(false)}
                            >
                                Go back & edit
                            </button>
                            <button
                                type="button"
                                className="gen-invc-btn"
                                onClick={() => {
                                    setShowSaveModal(false);
                                    handleSaveOrderDetails();
                                }}
                            >
                                Yes, generate invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showSaveModal && (
                <div className="modal-backdrop fade show"></div>
            )}
        </>
    );
};

export default OrderDetails;