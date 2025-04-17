import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Loader from "../../../components/loader/Loader";
import { BASE_URL } from "../../../config/urls";

import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { IoClose } from "react-icons/io5";

const UpdateOnPortal = () => {
    const [loading, setLoading] = useState(false); // Loading state


    const sellerId = useSelector((state) => state.auth?.sellerId);
    const sellerName = useSelector((state) => state.auth?.sellerName);

    console.log("this is seller id", sellerId)


    const transformInventoryData = (inventoryDetails) => {
        return inventoryDetails.map((item) => ({
            image: item.image,
            listingName: item.lstName,
            childSku: item.childSku,
            listingId: item.lstId.trim(),
            skuId: item.skuId.trim(),
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


    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [rowData, setRowData] = useState([]);

    // Fetch Typeahead Suggestions
    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            try {
                const res = await axios.get(`https://x9ra65bgf8.execute-api.ap-south-1.amazonaws.com/test/search/typeahead?query=${query}`);
                console.log(res, "this is search response")
                const products = res.data?.success?.coreData?.responseData?.productList || [];
                setSuggestions(products);
            } catch (error) {
                console.log("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };


    // Fetch Inventory Data when user selects a product
    const fetchInventoryData = async (listingId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${BASE_URL}/test/inventory/list?lstId=${listingId}&sellerId=${sellerId}`
            );
            console.log(response, "response from search suggestion ")
            if (response.data?.response?.rcode === 0) {
                const inventoryDetails = response.data?.response?.coreData?.responseData?.inventoryDetails || [];
                console.log(inventoryDetails, "response from search suggestion actual row data")

                const transformedData = transformInventoryData(inventoryDetails);
                setRowData(transformedData);
            } else {
                setRowData([]);
                console.log(response.data?.response?.rcode, "this is error r code");
                console.log(response.data?.response?.rmessage, "this is error r message");
                // toast.error(response.data?.response?.rmessage || "No Result Found");
            }

        } catch (error) {
            console.log("Error when fetching inventory data:", error);
            setRowData([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle selection of a product
    const handleSelectProduct = (listingId) => {
        setSearchQuery("");
        setSuggestions([]);
        fetchInventoryData(listingId);
    };



    // --------------------




    const [l1Categories, setL1Categories] = useState([]);
    const [l2Categories, setL2Categories] = useState([]);
    const [l3Categories, setL3Categories] = useState([]);

    const [selectedL1, setSelectedL1] = useState("");
    const [selectedL2, setSelectedL2] = useState("");
    const [selectedL3, setSelectedL3] = useState("");

    useEffect(() => {
        const fetchL1Categories = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/test/inventory/category?level=L1`
                );
                console.log(response, "fetch cat 1")
                setL1Categories(response.data);
            } catch (error) {
                console.log("Error fetching L1 categories:", error);
            }
        };

        fetchL1Categories();
    }, []);

    useEffect(() => {
        const fetchL2Categories = async () => {
            if (!selectedL1) {
                setL2Categories([]);
                setSelectedL2("");
                return;
            }

            try {
                const response = await axios.get(
                    `${BASE_URL}/test/inventory/category?l1Value=${encodeURIComponent(selectedL1)}&level=L2`
                );
                console.log(response, "fetch cat 2")
                setL2Categories(response.data);
            } catch (error) {
                console.log("Error fetching L2 categories:", error);
            }
        };

        fetchL2Categories();
    }, [selectedL1]);

    useEffect(() => {
        const fetchL3Categories = async () => {
            if (!selectedL2) {
                setL3Categories([]);
                setSelectedL3("");
                return;
            }

            try {
                const response = await axios.get(
                    `${BASE_URL}/test/inventory/category?l1Value=${encodeURIComponent(selectedL1)}&l2Value=${encodeURIComponent(selectedL2)}&level=L3`
                );
                console.log(response, "fetch cat 3")
                setL3Categories(response.data);
            } catch (error) {
                console.log("Error fetching L3 categories:", error);
            }
        };

        fetchL3Categories();
    }, [selectedL2]);

    const handleFilter = async () => {
        if (!selectedL1 || !selectedL2 || !selectedL3) {
            console.error("Please select all categories before filtering.");
            return;
        }

        console.log("seller id when filter", sellerId)
        const requestBody = {
            sellerId: sellerId,
            l1: selectedL1,
            l2: selectedL2,
            l3: selectedL3,
        };
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/test/inventory/filter`,
                requestBody
            );
            console.log("Filter Response:", response?.data);
            console.log("Filter Response r code :", response?.data?.response?.rcode);
            if (response?.data?.response?.rcode === 0) {
                const inventoryDetails = response?.data?.response?.coreData?.responseData?.inventoryDetails;
                console.log(inventoryDetails, "filter respones array in rcode")
                console.log(inventoryDetails.length, "filter respones array length")
                const transformedData = transformInventoryData(inventoryDetails);
                setRowData(transformedData);
            } else {
                setRowData([]);
                console.log(response.data?.response?.rcode, "this is error r code");
                console.log(response.data?.response?.rmessage, "this is error r message");
                toast.error(response.data?.response?.rmessage || "No Result Found");
            }


        } catch (error) {
            console.log("Error when filtering:", error);
            setRowData([]);
        } finally {
            setLoading(false);
        }
    };






    // -----------------

    // Custom cell renderer to display an edit icon
    const cellRendererWithEditIcon = (params) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <span style={{ color: '#181d1f' }}>{params.value}</span>
                <FaEdit style={{ color: "rgb(120 188 102)" }} /> {/* Edit icon */}
            </div>
        );
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [productDetails, setProductDetails] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Custom cell renderer for image with click handler
    const imageCellRenderer = (params) => {
        const handleImageClick = async () => {
            setSelectedImage(params.value);
            setModalLoading(true);
            setShowModal(true);

            try {
                // Get listingId from the row data
                const listingId = params.data.listingId.trim();

                // Fetch additional product details
                const response = await axios.get(
                    `${BASE_URL}/test/inventory/popup/image?listingId=${listingId}`
                );
                console.log(response, "product details response")
                if (response.data?.response?.rcode === 0) {
                    setProductDetails(response?.data?.response?.coreData?.responseData);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Failed to load product details");
            } finally {
                setModalLoading(false);
            }
        };

        return (
            <img
                src={params.value}
                alt="Product"
                style={{ width: "45px", height: "45px", cursor: "pointer" }}
                onClick={handleImageClick}
            />
        );
    };

    const columnDefs = [
        {
            headerName: "Image",
            field: "image",
            sortable: true,
            filter: true,
            //  cellRenderer: (params) => <img src={params.value} alt="Product" style={{ width: "45px", height: "45px" }} /> 
            cellRenderer: imageCellRenderer
        },
        { headerName: "Listing Name", field: "listingName", sortable: true, filter: true },
        { headerName: "Child SKU", field: "childSku", sortable: true, filter: true },
        {
            headerName: "HSN Code", field: "hsnCode", sortable: false, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon,
            //  cellStyle: { backgroundColor: "rgb(224 249 217)" }, 
            cellStyle: (params) => {
                const isEdited = params.data.lastEdited && params.data.lastEditedFields?.includes('hsnCode');
                return {
                    backgroundColor: isEdited ? "rgba(255, 255, 0, 0.3)" : "rgb(224 249 217)",
                    border: isEdited ? "2px solid orange" : "none"
                };
            }
        },
        {
            headerName: "Qty in stock (available inventory)", field: "qtyInStock", sortable: false, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon,
            // cellStyle: { backgroundColor: "rgb(224 249 217)" },
            cellStyle: (params) => {
                const isEdited = params.data.lastEdited && params.data.lastEditedFields?.includes('qtyInStock');
                return {
                    backgroundColor: isEdited ? "rgba(255, 255, 0, 0.3)" : "rgb(224 249 217)",
                    border: isEdited ? "2px solid orange" : "none"
                };
            }
        },
        {
            headerName: "Unit price (INR, without GST)", field: "unitPriceWithoutGst", sortable: false, filter: true, editable: true, cellRenderer: cellRendererWithEditIcon,
            //  cellStyle: { backgroundColor: "rgb(224 249 217)" }, 
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
            // cellStyle: { backgroundColor: "rgb(224 249 217)" },
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
            valueFormatter: params => params.value.toFixed(2),
        },
        {
            headerName: "Unit price (INR, including GST)",
            field: "unitPriceIncludingGst",
            sortable: true,
            filter: true,
            valueFormatter: params => params.value.toFixed(2),
        },
        { headerName: "Listing ID", field: "listingId", sortable: true, filter: true },
        { headerName: "SKU ID", field: "skuId", sortable: true, filter: true },
        { headerName: "Listing Unit Qty", field: "listingUnitQty", sortable: true, filter: true },
    ];


    const [editHistory, setEditHistory] = useState([]); // Array of all edits

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

                // Store EVERY edit in history
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



    const handleSubmit = async () => {
        try {
            // Transform rowData to match API requirements
            const updateInventoryList = rowData
                .filter(row => row.lastEdited) // Only include edited rows
                .map(row => ({
                    skuId: row.skuId,
                    hsnCode: parseInt(row.hsnCode) || 0, // Convert to number
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
            console.log(updateInventoryList, "api ready row data")
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

            // Clear edit history after successful submission
            setRowData(prev => prev.map(row => {
                const { lastEdited, lastEditedFields, ...rest } = row;
                return rest;
            }));

        } catch (error) {
            console.error("Error submitting inventory:", error);
            toast.error("Failed to update inventory");
        }
    };



    return (
        <>
            {loading && <Loader message="Fetching..." />}
            {/* Custom Modal for Image Preview */}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content px-2 bg-white" onClick={(e) => e.stopPropagation()} >
                        <div className="modal-header bg-white text-black">
                            <h3>Product Details</h3>
                            <button className="close-button" onClick={() => setShowModal(false)}>
                                <IoClose color="black" />
                            </button>
                        </div>
                        <div className="modal-body">
                            {modalLoading ? (
                                <Loader message="Loading product details..." />
                            ) : (
                                <div className="row">
                                    <div className="col-12 d-flex justify-content-center align-items-center">

                                        <img
                                            src={selectedImage}
                                            alt="Product Preview"
                                            className="modal-image"
                                        />
                                    </div>
                                    <div className="col-12 bg-white">

                                        {productDetails && (
                                            <>
                                                <h4 className="text-black mt-2">{productDetails?.listingName}</h4>
                                                <p className="text-black"><strong>Brand:</strong> {productDetails?.brandName}</p>

                                                <div className="mt-3">
                                                    <h5 className="text-black">Product Description</h5>
                                                    <p className="text-black">{productDetails?.productDescription?.productDetails}</p>
                                                    {productDetails?.productDescription?.features && (
                                                        <ul>
                                                            {productDetails?.productDescription?.features.map((feature, index) => (
                                                                <li className="text-black" key={index}>{feature}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>

                                                <div className="mt-3">
                                                    <h5 className="text-black">Specifications</h5>
                                                    <table className="table table-bordered">
                                                        <tbody>
                                                            {productDetails?.productSpecifications.map((spec, index) => (
                                                                <tr key={index}>
                                                                    <td><strong>{spec?.name}</strong></td>
                                                                    <td>{spec?.value}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="update-on-portal">
                {/* Categories and Search Section */}
                <div className="row mb-2 mt-3">
                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                        <div className="update-portal-box d-flex flex-column align-items-start">
                            <label className="me-2">Category L1</label>
                            <select value={selectedL1} onChange={(e) => setSelectedL1(e.target.value)}>
                                <option value="">Select</option>
                                {l1Categories.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                        <div className="update-portal-box d-flex flex-column align-items-start">
                            <label className="me-2">Category L2</label>
                            <select value={selectedL2} onChange={(e) => setSelectedL2(e.target.value)} disabled={!selectedL1}>
                                <option value="">Select</option>
                                {l2Categories.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                        <div className="update-portal-box d-flex flex-column align-items-start">
                            <label className="me-2">Category L3</label>
                            <select value={selectedL3} onChange={(e) => setSelectedL3(e.target.value)} disabled={!selectedL2}>
                                <option value="">Select</option>
                                {l3Categories.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-3 d-flex align-items-end filter-btn-box">
                        <button className="update-portal-btn update-btns-submit" onClick={handleFilter} disabled={!selectedL1 || !selectedL2 || !selectedL3}>
                            Filter
                        </button>
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-12">
                        <p className="or-text-update-portal mb-0 text-center">
                            -----------Or you can search-----------
                        </p>
                    </div>
                </div>

                <div className="row mb-4 position-relative">
                    <div className="col-12">
                        <div className="update-portal-search-box d-flex flex-column">
                            <label>Search by category</label>
                            <input type="text"
                                placeholder="Search Here..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    {suggestions.length > 0 && (
                        <div className="col-12" id="search-suggest-box">
                            <ul className="list-group mt-2">
                                {suggestions.map((item, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelectProduct(item.listingId)}
                                        style={{ cursor: "pointer", borderBottom: '1.5px solid #1F8505' }}
                                    >
                                        {item.listingName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

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
                            {/* <button className="update-portal-btn update-btns-save">Save</button> */}
                            <button className="update-portal-btn update-btns-submit" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
};

export default UpdateOnPortal;