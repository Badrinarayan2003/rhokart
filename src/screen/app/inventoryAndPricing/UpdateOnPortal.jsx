// import './inventoryPricing.css';

// const UpdateOnPortal = () => {
//     return (
//         <div className="update-on-portal">
//             <div className="row mb-2">
//                 <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
//                     <div className="update-portal-box d-flex flex-wrap align-items-center">
//                         <label className="me-2">Category L1</label>
//                         <select>
//                             <option value="">Select</option>
//                             <option value="">Electrical one Category L1</option>
//                             <option value="">Electronics two Category L1</option>
//                             <option value="">Metrics three Category L1</option>
//                             <option value="">Aluminium four Category L1</option>
//                         </select>
//                     </div>
//                 </div>
//                 <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
//                     <div className="update-portal-box d-flex flex-wrap align-items-center">
//                         <label className="me-2">Category L2</label>
//                         <select>
//                             <option value="">Select</option>
//                             <option value="">Electrical one Category L2</option>
//                             <option value="">Electronics two Category L2</option>
//                             <option value="">Metrics three Category L2</option>
//                             <option value="">Aluminium four Category L2</option>
//                         </select>
//                     </div>
//                 </div>
//                 <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 mb-3">
//                     <div className="update-portal-box d-flex flex-wrap align-items-center">
//                         <label className="me-2">Category L3</label>
//                         <select>
//                             <option value="">Select</option>
//                             <option value="">Electrical one Category L3</option>
//                             <option value="">Electronics two Category L3</option>
//                             <option value="">Metrics three Category L3</option>
//                             <option value="">Aluminium four Category L3</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>
//             <div className="row mb-2">
//                 <div className="col-12">
//                     <p className="or-text-update-portal mb-0 text-center">-----------Or you can search-----------</p>
//                 </div>
//             </div>

//             <div className="row mb-2">
//                 <div className="col-12">
//                     <div className="update-portal-search-box d-flex flex-column">
//                         <label>Search by category</label>
//                         <input type="text" placeholder="Search Here..." />
//                     </div>
//                 </div>
//             </div>

//             <div className="row">
//                 <div className="col-12">

//                 </div>
//             </div>


//         </div>
//     )
// }

// export default UpdateOnPortal;









import React, { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import "./inventoryPricing.css";

const data = Array.from({ length: 50 }, (_, i) => ({
    image: `https://placehold.co/50`,
    categoryL1: `Category L1 - ${i + 1}`,
    categoryL2: `Category L2 - ${i + 1}`,
    categoryL3: `Category L3 - ${i + 1}`,
    listingName: `Listing ${i + 1}`,
    skuName: `SKU ${i + 1}`,
    qtyStock: Math.floor(Math.random() * 100),
    pricePerUnit: (Math.random() * 1000).toFixed(2),
    listingID: `LST-${i + 1}`,
    skuID: `SKU-${i + 1}`,
    gstRate: `${Math.floor(Math.random() * 18)}%`,
    hsnCode: `HSN-${1000 + i}`,
}));

const UpdateOnPortal = () => {
    const columns = useMemo(() => [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ getValue }) => <img src={getValue()} alt="Item" width="50" />,
        },
        { accessorKey: "categoryL1", header: "Category L1" },
        { accessorKey: "categoryL2", header: "Category L2" },
        { accessorKey: "categoryL3", header: "Category L3" },
        { accessorKey: "listingName", header: "Listing Name" },
        { accessorKey: "skuName", header: "SKU Name" },
        { accessorKey: "qtyStock", header: "Qty in Stock" },
        { accessorKey: "pricePerUnit", header: "Price per unit (excluding GST)" },
        { accessorKey: "listingID", header: "Listing ID" },
        { accessorKey: "skuID", header: "SKU ID" },
        { accessorKey: "gstRate", header: "GST Rate" },
        { accessorKey: "hsnCode", header: "HSN Code" },
    ], []);

    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 7 });

    const table = useReactTable({
        data,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

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
                    <table className="table table-bordered">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ backgroundColor: "#1F8505", color: "#fff" }}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === "asc" ? " 🔼" : header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination update-portal-page-button-box d-flex justify-content-center gap-2 align-items-center">
                        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>First</button>
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
                        <span>
                            <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
                        </span>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
                        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>Last</button>
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