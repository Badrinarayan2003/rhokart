import React, { useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { mockApiResponse } from "../../../constants/data";




const UpdateOnPortal = () => {
    const [rowData, setRowData] = useState(mockApiResponse);

    const columnDefs = [
        { headerName: "Image", field: "image", sortable: true, filter: true, cellRenderer: (params) => <img src={params.value} alt="Product" style={{ width: "45px", height: "45px" }} /> },
        { headerName: "Category L1", field: "categoryL1", sortable: true, filter: true },
        { headerName: "Category L2", field: "categoryL2", sortable: true, filter: true },
        { headerName: "Category L3", field: "categoryL3", sortable: true, filter: true },
        { headerName: "Listing Name", field: "listingName", sortable: true, filter: true },
        { headerName: "SKU Name", field: "skuName", sortable: true, filter: true },
        { headerName: "Qty Stock", field: "qtyStock", sortable: true, filter: true },
        { headerName: "Price Per Unit", field: "pricePerUnit", sortable: true, filter: true },
        { headerName: "GST Rate", field: "gstRate", sortable: true, filter: true, editable: true },
        { headerName: "GST Amount", field: "gstAmount", sortable: true, filter: true, editable: true },
        { headerName: "HSN Code", field: "hsnCode", sortable: true, filter: true },
    ];

    const onCellValueChanged = useCallback((params) => {
        const updatedData = rowData.map((row) => (row.listingID === params.data.listingID ? params.data : row));
        setRowData(updatedData);
    }, [rowData]);


    return (
        <div className="update-on-portal">
            {/* Categories and Search Section */}
            <div className="row mb-2 mt-3">
                <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
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
                <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
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
                <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
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
                            pagination={true}
                            paginationPageSize={9}
                            paginationPageSizeSelector={[9, 20, 50, 100]}
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