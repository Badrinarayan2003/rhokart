import './payments.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { BASE_URL } from '../../../config/urls';
import Loader from '../../../components/loader/Loader';
import ExcelJS from 'exceljs';
import { FaFileDownload } from "react-icons/fa";


const Payments = () => {


    const sellerId = useSelector((state) => state.auth?.sellerId);
    console.log(sellerId);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Payment overview states
    const [paymentData, setPaymentData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedDays, setSelectedDays] = useState('7days');
    const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);






    const exportToExcel = async () => {
        if (paymentData.length === 0) {
            alert('No data to export');
            return;
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Payments');

        // Define columns
        worksheet.columns = [
            { header: 'Order ID', key: 'orderId', width: 15 },
            { header: 'Order date', key: 'orderDate', width: 20 },
            { header: 'Order pack date', key: 'orderPackedDate', width: 15 },
            { header: 'Order delivered date', key: 'orderDeliveredDate', width: 20 },
            { header: 'Payable amount (INR)', key: 'payableAmount', width: 20 },
            { header: 'Paid amount (INR)', key: 'paidAmount', width: 20 },
            { header: 'Payment date', key: 'paymentDate', width: 20 },
            { header: 'Payment mode', key: 'paymentMode', width: 20 },
            { header: 'Transaction ID', key: 'transactionId', width: 20 },
            { header: 'Transaction amount', key: 'transactionAmount', width: 20 },
        ];

        // Style the header row
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' } // Blue background
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' } // White text
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Add data rows
        paymentData.forEach(payment => {
            worksheet.addRow({
                orderDate: payment.orderDate,
                orderId: payment.orderId,
                orderDeliveredDate: payment.orderDeliveredDate,
                orderPackedDate: payment.orderPackedDate,
                paidAmount: payment.paidAmount,
                payableAmount: payment.payableAmount,
                paymentMode: payment.paymentMode,
                transactionAmount: payment.transactionAmount,
                transactionId: payment.transactionId,
            });
        });

        // Style all data rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            }
        });

        // Generate file buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create download link
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Payments_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();

        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(url);
            link.remove();
        }, 100);
    };




    // Fetch payment data when dates change
    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setLoading(true);

                let actualFromDate = fromDate;
                let actualToDate = toDate;

                console.log(actualFromDate, "this is actual from");
                console.log(actualToDate, "this is actual to");


                // If custom dates are not selected, calculate based on selected days
                if (!isCustomDateSelected) {
                    const today = new Date();
                    actualToDate = today.toISOString().split('T')[0];
                    console.log(actualToDate, "this is actual to date");

                    const fromDateObj = new Date(today);

                    switch (selectedDays) {
                        case '7days':
                            fromDateObj.setDate(today.getDate() - 7);
                            break;
                        case '30days':
                            fromDateObj.setDate(today.getDate() - 30);
                            break;
                        case '6month':
                            fromDateObj.setMonth(today.getMonth() - 6);
                            break;
                        case '1yr':
                            fromDateObj.setFullYear(today.getFullYear() - 1);
                            break;
                        default:
                            fromDateObj.setDate(today.getDate() - 7);
                    }

                    actualFromDate = fromDateObj.toISOString().split('T')[0];
                    console.log(actualFromDate, "this is actual from date");
                }

                const response = await axios.get(`https://sellerapi.rhoselect.com/report/paymentdetails`, {
                    params: {
                        sellerId: sellerId,
                        fromDate: actualFromDate,
                        toDate: actualToDate
                    }
                });
                console.log(response, "payment response");

                const data = response.data;

                if (data.rcode === 0) {
                    setPaymentData(data.coreData.responseData.paymentReports || []);

                    // Calculate total amount
                    const total = data.coreData.responseData.paymentReports.reduce(
                        (sum, payment) => sum + (payment.paidAmount || 0), 0
                    );
                    setTotalAmount(total);
                } else {
                    setError(data.rmessage || 'Failed to fetch payment data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (sellerId) {
            fetchPaymentData();
        }
    }, [sellerId, fromDate, toDate, selectedDays, isCustomDateSelected]);

    // Handle date changes
    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
        setIsCustomDateSelected(true);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
        setIsCustomDateSelected(true);
    };

    const handleDaysChange = (e) => {
        setSelectedDays(e.target.value);
        setIsCustomDateSelected(false);
    };

    // AG-Grid configuration
    const [columnDefs] = useState([
        {
            headerName: "Order ID",
            field: 'orderId',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 190
        },
        {
            headerName: "Order date",
            field: 'orderDate',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 150
        },
        {
            headerName: "Order pack date",
            field: 'orderPackedDate',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 240
        },
        {
            headerName: 'Order delivered date',
            field: 'orderDeliveredDate',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 230
        },
        {
            headerName: 'Payable amount (INR)',
            field: 'payableAmount',
            filter: true,
            sortable: true,
            width: 180
        },
        {
            headerName: 'Paid amount (INR)',
            field: 'paidAmount',
            filter: true,
            sortable: true,
        },
        {
            headerName: 'Payment date',
            field: 'paymentDate',
            filter: true,
            sortable: true,
        },
        {
            headerName: 'Payment mode',
            field: 'paymentMode',
            filter: true,
            sortable: true,
        },
        {
            headerName: 'Transaction ID',
            field: 'transactionId',
            filter: true,
            sortable: true,
        },
        {
            headerName: 'Transaction amount',
            field: 'transactionAmount',
            filter: true,
            sortable: true,
        },
    ]);


    return (
        < >
            {loading && <Loader message="Loading..." />}

            <div className="row">
                <div className='col-12'>
                    <h5 className='text-dark fw-bold mt-2'>Payment Overview</h5>
                    <div className="pay-over-table-filter-container mb-3">
                        <div className='pay-over-table-filter-box d-flex flex-column'>
                            <label className='text-dark'>From</label>
                            <input
                                type='date'
                                value={fromDate}
                                onChange={handleFromDateChange}
                            />
                        </div>
                        <div className='pay-over-table-filter-box d-flex flex-column'>
                            <label className='text-dark'>To</label>
                            <input
                                type='date'
                                value={toDate}
                                onChange={handleToDateChange}
                            />
                        </div>
                        <div className='pay-over-table-filter-box'>
                            <select
                                name="days"
                                id="days"
                                className={`pay-over-table-filter-select-btn ${isCustomDateSelected ? "home-select-disable" : ""}`}
                                value={selectedDays}
                                onChange={handleDaysChange}
                                disabled={isCustomDateSelected}
                            >
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="6month">Last 6 Months</option>
                                <option value="1yr">Last Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="p-text-color fw-bold mb-0">
                            Total Amount Received (as per filter data range): {totalAmount.toFixed(2)} (INR)
                        </p>
                        <button
                            onClick={exportToExcel}
                            className="btn d-flex align-items-center text-light"
                            id='download-to-excel-btn'
                            disabled={paymentData.length === 0}
                        >
                            <span className='d-flex'>
                                <FaFileDownload color='#fff' size={16} />
                            </span>
                            Download to excel
                        </button>
                    </div>

                    <div className="home-table ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                        <AgGridReact
                            rowData={paymentData}
                            columnDefs={columnDefs}
                            suppressCellFocus={true}
                            defaultColDef={{
                                resizable: true,
                                sortable: true,
                                filter: true
                            }}
                            animateRows={true}
                            suppressScrollOnNewData={true}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Payments;