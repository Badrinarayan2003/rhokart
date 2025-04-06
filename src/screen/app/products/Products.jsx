import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../components/loader/Loader";
import { BASE_URL } from "../../../config/urls";
import './products.css'

import { FaEdit } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Products = () => {
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [editHistory, setEditHistory] = useState([]);

    // Transform inventory data to match our table structure
    const transformInventoryData = (inventoryDetails) => {
        return inventoryDetails.map((item) => ({
            image: item.image,
            listingName: item.lstName,
            childSku: item.childSku,
            listingId: item.lstId?.trim(),
            skuId: item.skuId?.trim(),
            listingUnitQty: item.lstQty,
            hsnCode: item.hsnCode,
            qtyInStock: item.qtyInStock,
            unitPriceWithoutGst: item.unitPriceWoGst,
            gstRate: item.gstRate,
            // gstAmount: (item.unitPriceWoGst * item.gstRate) / 100,
            gstAmount: parseFloat(((item.unitPriceWoGst * item.gstRate) / 100).toFixed(2)),
            // unitPriceIncludingGst: item.unitPriceWoGst + (item.unitPriceWoGst * item.gstRate) / 100,
            unitPriceIncludingGst: parseFloat((item.unitPriceWoGst + (item.unitPriceWoGst * item.gstRate) / 100).toFixed(2)),
        }));
    };

    // Fetch data on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${BASE_URL}/test/inventory/listed/items?sellerId=3`
                );
                console.log(response, "this is my product response")
                if (response.data?.response?.rcode === 0) {
                    const inventoryDetails = response.data?.response?.coreData?.responseData?.inventoryDetails || [];
                    const transformedData = transformInventoryData(inventoryDetails);
                    setRowData(transformedData);
                } else {
                    setRowData([]);
                    toast.error(response.data?.response?.rmessage || "No inventory data found");
                }
            } catch (error) {
                console.log("Error fetching inventory data:", error);
                toast.error("Failed to load inventory data");
                setRowData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Custom cell renderer to display an edit icon
    const cellRendererWithEditIcon = (params) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <span style={{ color: '#181d1f' }}>{params.value}</span>
                <FaEdit style={{ color: "rgb(120 188 102)" }} />
            </div>
        );
    };

    // Column definitions
    const columnDefs = [
        { headerName: "Image", field: "image", sortable: true, filter: true, cellRenderer: (params) => <img src={params.value} alt="Product" style={{ width: "45px", height: "45px" }} /> },
        { headerName: "Listing Name", field: "listingName", sortable: true, filter: true },
        { headerName: "Child SKU", field: "childSku", sortable: true, filter: true },
        {
            headerName: "HSN Code", field: "hsnCode", sortable: false, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon,
            // cellStyle: { backgroundColor: "rgb(224 249 217)" }
            cellStyle: (params) => {
                const isEdited = params.data.lastEdited && params.data.lastEditedFields?.includes('hsnCode');
                return {
                    backgroundColor: isEdited ? "rgba(255, 255, 0, 0.3)" : "rgb(224 249 217)",
                    border: isEdited ? "2px solid orange" : "none"
                };
            }
        },
        {
            headerName: "Qty in stock", field: "qtyInStock", sortable: false, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon,
            // cellStyle: { backgroundColor: "rgb(224 249 217)" }
            cellStyle: (params) => {
                const isEdited = params.data.lastEdited && params.data.lastEditedFields?.includes('qtyInStock');
                return {
                    backgroundColor: isEdited ? "rgba(255, 255, 0, 0.3)" : "rgb(224 249 217)",
                    border: isEdited ? "2px solid orange" : "none"
                };
            }
        },
        {
            headerName: "Unit price (without GST)", field: "unitPriceWithoutGst", sortable: false, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon,
            // cellStyle: { backgroundColor: "rgb(224 249 217)" }
            cellStyle: (params) => {
                const isEdited = params.data.lastEdited && params.data.lastEditedFields?.includes('unitPriceWithoutGst');
                return {
                    backgroundColor: isEdited ? "rgba(255, 255, 0, 0.3)" : "rgb(224 249 217)",
                    border: isEdited ? "2px solid orange" : "none"
                };
            }
        },
        {
            headerName: "GST Rate", field: "gstRate", sortable: false, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon,
            // cellStyle: { backgroundColor: "rgb(224 249 217)" }
            cellStyle: (params) => {
                const isEdited = params.data.lastEdited && params.data.lastEditedFields?.includes('gstRate');
                return {
                    backgroundColor: isEdited ? "rgba(255, 255, 0, 0.3)" : "rgb(224 249 217)",
                    border: isEdited ? "2px solid orange" : "none"
                };
            }
        },
        {
            headerName: "GST Amount(INR)",
            field: "gstAmount",
            sortable: true,
            filter: true,
            valueFormatter: params => params.value.toFixed(2)
        },
        {
            headerName: "Unit price (including GST)",
            field: "unitPriceIncludingGst",
            sortable: true,
            filter: true,
            valueFormatter: params => params.value.toFixed(2)
        },
        { headerName: "Listing ID", field: "listingId", sortable: true, filter: true },
        { headerName: "SKU ID", field: "skuId", sortable: true, filter: true },
        { headerName: "Listing Unit Qty", field: "listingUnitQty", sortable: true, filter: true },
    ];

    // Handle cell edits
    const onCellValueChanged = useCallback((params) => {
        const { data, newValue, colDef } = params;

        setRowData(prevData => prevData.map(row => {
            if (row.listingId === data.listingId && row.skuId === data.skuId) {
                const updatedRow = {
                    ...row,
                    [colDef.field]: newValue,
                    lastEdited: new Date().toISOString(), // Timestamp
                    lastEditedFields: [...(row.lastEditedFields || []), colDef.field]
                };

                // Recalculate GST fields if needed
                if (colDef.field === "unitPriceWithoutGst" || colDef.field === "gstRate") {
                    const price = colDef.field === "unitPriceWithoutGst" ? newValue : row.unitPriceWithoutGst;
                    const rate = colDef.field === "gstRate" ? newValue : row.gstRate;

                    // updatedRow.gstAmount = (price * rate) / 100;
                    // updatedRow.unitPriceIncludingGst = price + updatedRow.gstAmount;
                    updatedRow.gstAmount = parseFloat(((price * rate) / 100).toFixed(2));
                    updatedRow.unitPriceIncludingGst = parseFloat((price + updatedRow.gstAmount).toFixed(2));
                }

                // Store edit in history
                setEditHistory(prev => [...prev, {
                    listingId: data.listingId,
                    skuId: data.skuId,
                    field: colDef.field,
                    oldValue: row[colDef.field],
                    newValue,
                    timestamp: new Date().toISOString()
                }]);

                return updatedRow;
            }
            return row;
        }));
    }, []);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            // Filter only edited rows and transform for API
            const updateInventoryList = rowData
                .filter(row => row.lastEdited)
                .map(row => ({
                    skuId: row.skuId,
                    hsnCode: parseInt(row.hsnCode) || 0,
                    qtyInStock: row.qtyInStock,
                    unitPriceWoGst: row.unitPriceWithoutGst,
                    gstRate: row.gstRate,
                    gstAmount: row.gstAmount,
                    unitPriceWGst: row.unitPriceIncludingGst
                }));

            if (updateInventoryList.length === 0) {
                toast.info("No changes to submit");
                return;
            }

            // Prepare request body
            const requestBody = {
                updateInventoryList
            };

            // Make API call
            const response = await axios.post(
                `${BASE_URL}/test/inventory/submit`,
                requestBody,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("API Response:", response);
            toast.success("Inventory updated successfully!");

            // Clear edit markers after successful submission
            setRowData(prev => prev.map(row => {
                const { lastEdited, lastEditedFields, ...rest } = row;
                return rest;
            }));
            setEditHistory([]);

        } catch (error) {
            console.error("Error submitting inventory:", error);
            toast.error("Failed to update inventory");
        }
    };

    return (
        <>
            {loading && <Loader message="Loading inventory..." />}

            <div className="update-on-portal">
                <div className="row my-4">
                    <div color="col-12">
                        <h3 className="heading-product-dara">My Products</h3>
                    </div>
                </div>
                {/* Table Section */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={columnDefs}
                                onCellValueChanged={onCellValueChanged}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                    <div className="col-12">
                        <div className="update-portal-btns-box">
                            <button className="update-portal-btn update-btns-clear">Clear</button>
                            <button
                                className="update-portal-btn update-btns-submit"
                                onClick={handleSubmit}
                                disabled={editHistory.length === 0}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;