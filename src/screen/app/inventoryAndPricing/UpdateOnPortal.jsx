import React, { useState, useCallback } from "react";

import { FaEdit } from "react-icons/fa";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { mockApiResponse } from "../../../constants/data";




const UpdateOnPortal = () => {


    // Transform the initial data
    const transformData = (data) => {

        return data.map((item) => {
            const gstAmount = (item.unitPriceWithoutGst * item.gstRate) / 100;
            const unitPriceIncludingGst = item.unitPriceWithoutGst + gstAmount;
            return {
                ...item,
                listingName: item.listingName,
                childSku: item.childSku,
                listingId: item.listingId,
                skuId: item.skuId,
                listingUnitQty: item.listingUnitQty,
                hsnCode: item.hsnCode,
                qtyInStock: item.qtyInStock,
                unitPriceWithoutGst: item.unitPriceWithoutGst,
                gstRate: item.gstRate,
                gstAmount: gstAmount,
                unitPriceIncludingGst: unitPriceIncludingGst,
            };
        });
    };

    const [rowData, setRowData] = useState(transformData(mockApiResponse));


    // Custom header renderer to display an edit icon
    const headerRendererWithEditIcon = (params) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-around' }}>
                <span style={{ color: '#181d1f' }}>{params.displayName}</span>
                <FaEdit style={{ color: "rgb(120 188 102)" }} /> {/* Edit icon */}
            </div>
        );
    };

    // Custom cell renderer to display an edit icon
    const cellRendererWithEditIcon = (params) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <span style={{ color: '#181d1f' }}>{params.value}</span>
                <FaEdit style={{ color: "rgb(120 188 102)" }} /> {/* Edit icon */}
            </div>
        );
    };



    const columnDefs = [
        { headerName: "Image", field: "image", sortable: true, filter: true, cellRenderer: (params) => <img src={params.value} alt="Product" style={{ width: "45px", height: "45px" }} /> },
        { headerName: "Listing Name", field: "listingName", sortable: true, filter: true },
        { headerName: "Child SKU", field: "childSku", sortable: true, filter: true },
        { headerName: "Listing ID", field: "listingId", sortable: true, filter: true },
        { headerName: "SKU ID", field: "skuId", sortable: true, filter: true },
        { headerName: "Listing Unit Qty", field: "listingUnitQty", sortable: true, filter: true },
        { headerName: "HSN Code", field: "hsnCode", sortable: true, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon, cellStyle: { backgroundColor: "rgb(224 249 217)" }, },
        { headerName: "Qty in stock (available inventory)", field: "qtyInStock", sortable: true, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon, cellStyle: { backgroundColor: "rgb(224 249 217)" }, },
        { headerName: "Unit price (INR, without GST)", field: "unitPriceWithoutGst", sortable: true, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon, cellStyle: { backgroundColor: "rgb(224 249 217)" }, },
        { headerName: "GST Rate", field: "gstRate", sortable: true, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon, cellStyle: { backgroundColor: "rgb(224 249 217)" }, },
        { headerName: "GST Amount(INR)", field: "gstAmount", sortable: true, filter: true },
        { headerName: "Unit price (INR, including GST)", field: "unitPriceIncludingGst", sortable: true, filter: true },
    ];

    const onCellValueChanged = useCallback((params) => {
        const { data } = params;

        // Check if the edited column is unitPriceWithoutGst or gstRate
        if (params.colDef.field === "unitPriceWithoutGst" || params.colDef.field === "gstRate") {
            const { unitPriceWithoutGst, gstRate } = data;

            // Recalculate GST Amount and Unit Price Including GST
            const gstAmount = (unitPriceWithoutGst * gstRate) / 100;
            const unitPriceIncludingGst = unitPriceWithoutGst + gstAmount;

            // Update the specific row
            const updatedData = rowData.map((row) =>
                row.listingId === data.listingId // Use listingId to identify the row
                    ? { ...row, gstAmount, unitPriceIncludingGst }
                    : row
            );

            // Update the state
            setRowData(updatedData);
        }
    }, [rowData]);


    return (
        <div className="update-on-portal">
            {/* Categories and Search Section */}
            <div className="row mb-2 mt-3">
                <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <div className="update-portal-box d-flex flex-wrap align-items-center">
                        <label className="me-2">Category L1</label>
                        <select>
                            <option value="">Select</option>
                            <option value="">Electrical one Category L1</option>
                            <option value="">Electronics two Category L1</option>
                            <option value="">Metrics three Category L1</option>
                            <option value="">Aluminium four Category L1</option>
                        </select>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <div className="update-portal-box d-flex flex-wrap align-items-center">
                        <label className="me-2">Category L2</label>
                        <select>
                            <option value="">Select</option>
                            <option value="">Electrical one Category L2</option>
                            <option value="">Electronics two Category L2</option>
                            <option value="">Metrics three Category L2</option>
                            <option value="">Aluminium four Category L2</option>
                        </select>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <div className="update-portal-box d-flex flex-wrap align-items-center">
                        <label className="me-2">Category L3</label>
                        <select>
                            <option value="">Select</option>
                            <option value="">Electrical one Category L3</option>
                            <option value="">Electronics two Category L3</option>
                            <option value="">Metrics three Category L3</option>
                            <option value="">Aluminium four Category L3</option>
                        </select>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3 d-flex align-items-end filter-btn-box">
                    <button className="update-portal-btn update-btns-submit ">Filter</button>
                </div>

            </div>

            <div className="row mb-2">
                <div className="col-12">
                    <p className="or-text-update-portal mb-0 text-center">
                        -----------Or you can search-----------
                    </p>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-12">
                    <div className="update-portal-search-box d-flex flex-column">
                        <label>Search by category</label>
                        <input type="text" placeholder="Search Here..." />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="row mb-4">
                <div className="col-12">

                    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            // pagination={true}
                            // paginationPageSize={9}
                            // paginationPageSizeSelector={[9, 20, 50, 100]}
                            onCellValueChanged={onCellValueChanged}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="update-portal-btns-box">
                        <button className="update-portal-btn update-btns-clear">Clear</button>
                        <button className="update-portal-btn update-btns-save">Save</button>
                        <button className="update-portal-btn update-btns-submit">Submit</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UpdateOnPortal;