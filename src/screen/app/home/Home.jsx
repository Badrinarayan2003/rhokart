import './home.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { BASE_URL } from '../../../config/urls';
import Loader from '../../../components/loader/Loader';
import { FaDownload, FaUpload } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();


    const sellerId = useSelector((state) => state.auth?.sellerId);
    console.log(sellerId);

    // State for order status counts
    const [orderStatus, setOrderStatus] = useState({
        ORDERED: 0,
        TRNST: 0,
        DLVRD: 0,
        CANCEL: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Payment overview states
    const [paymentData, setPaymentData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedDays, setSelectedDays] = useState('7days');
    const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);

    const [downloadUrl, setDownloadUrl] = useState('');
    const [errMsg, setErrMsg] = useState("");
    const [upErrMsg, setupErrMsg] = useState("");


    useEffect(() => {
        const fetchDownloadUrl = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/pincode/download?sellerId=${sellerId}`);
                const data = response.data;

                if (data.rcode === 0) {
                    setDownloadUrl(data.coreData.responseData.fileRequest.url);
                } else {
                    setErrMsg(data.rmessage || 'Failed to fetch download URL');
                    console.log("error not 0");
                }
            } catch (err) {
                setErrMsg(err.message);
                console.log("error");
            }
        };

        if (sellerId) {
            fetchDownloadUrl();
        }
    }, [sellerId]);


    const handleWhitelistSubmit = async () => {
        if (!whitelistFile) {
            alert('Please select a file to upload');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', whitelistFile);

            const response = await axios.post(
                `https://upload.rhoselect.com/pincode/upload?sellerId=${sellerId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const data = response.data;
            if (data.rcode === 0) {
                alert('File uploaded successfully!');
               console.log(data);
            } else {
                setupErrMsg(data.rmessage || 'Failed to upload file');
                console.log(data.rmessage);
            }
        } catch (err) {
            setupErrMsg(err.message);
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };



    // Fetch order status data using Axios
    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/order/groupbyseller?sellerId=${sellerId}`);
                const data = response.data;

                if (data.rcode === 0) {
                    const statusCounts = data.coreData.responseData.orderGroups.reduce((acc, group) => {
                        acc[group.status] = group.counts;
                        return acc;
                    }, {});

                    setOrderStatus(prev => ({
                        ...prev,
                        ...statusCounts
                    }));
                } else {
                    setError(data.rmessage || 'Failed to fetch order status');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatus();
    }, []);

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

                const response = await axios.get(`${BASE_URL}/report/payment`, {
                    params: {
                        sellerId: sellerId,
                        fromDate: actualFromDate,
                        toDate: actualToDate
                    }
                });
                console.log(response, "payment response");

                const data = response.data;

                if (data.rcode === 0) {
                    setPaymentData(data.coreData.responseData.sellerPayments || []);

                    // Calculate total amount
                    const total = data.coreData.responseData.sellerPayments.reduce(
                        (sum, payment) => sum + (payment.amount || 0), 0
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

    // Handle status box click
    const handleStatusClick = (status) => {
        // Map the status from Home to Orders component's tab names
        const tabMap = {
            'ORDERED': 'ORDERED',
            'TRNST': 'TRANSIT',
            'DLVRD': 'DELIVERED',
            'CANCEL': 'CANCEL'
        };

        navigate('/orders', { state: { activeTab: tabMap[status] } });
    };

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
            headerName: "Date",
            field: 'payDate',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 130
        },
        {
            headerName: "Order ID",
            field: 'orderId',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 150
        },
        {
            headerName: "Status",
            field: 'status',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 190
        },
        {
            headerName: 'Received Amount (INR)',
            field: 'amount',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 180,
            valueFormatter: params => params.value ? params.value.toFixed(2) : '0.00'
        },
        {
            headerName: 'Payment Mode',
            field: 'paymentMode',
            filter: true,
            sortable: true,
            width: 180
        },
        {
            headerName: 'Transaction ID',
            field: 'transId',
            filter: true,
            sortable: true,
        },
    ]);

    // File upload state
    const [whitelistFile, setWhitelistFile] = useState(null);

    const handleWhitelistFileChange = (e) => {
        if (e.target.files.length > 0) {
            setWhitelistFile(e.target.files[0]);
        }
    };

    // const [blacklistFile, setBlacklistFile] = useState(null);
    // const handleBlacklistFileChange = (e) => {
    //     if (e.target.files.length > 0) {
    //         setBlacklistFile(e.target.files[0]);
    //     }
    // };

    return (
        <>
            {loading && <Loader message="Loading..." />}
            <div className="admin-home-page">
                <h5 className='text-dark fw-bold mb-3'>Order Overview</h5>
                <div className="row pb-4 first-sec">
                    <div className='col-12 d-flex justify-content-between gap-1'>
                        {/* Order Received (ORDERED) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('ORDERED')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-2 text-center order-status-box-one-text'>Order received & waiting for packup</p>
                            <p className='mb-0 home-count text-end'>{orderStatus.ORDERED}</p>
                        </div>

                        {/* In Transit (TRNST) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('TRNST')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-0 text-center order-status-box-one-text'>In transit orders</p>
                            <p className='mb-0 home-count text-end'>{orderStatus.TRNST}</p>
                        </div>

                        {/* Delivered (DLVRD) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('DLVRD')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-0 text-center order-status-box-one-text'>Delivered</p>
                            <p className='mb-0 home-count text-end'>{orderStatus.DLVRD}</p>
                        </div>

                        {/* Cancelled (CANCEL) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('CANCEL')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-0 text-center order-status-box-one-text'>Cancelled</p>
                            <p className='mb-0 home-count text-end'>{orderStatus.CANCEL}</p>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12 payment-overview-container'>
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
                        <p className="p-text-color fw-bold">
                            Total Amount Received (as per filter data range): {totalAmount.toFixed(2)} (INR)
                        </p>

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

                    <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12 '>
                        <h5 className='text-dark fw-bold loction-header'>Your delivery location</h5>

                        {/* First Section - Whitelist */}
                        <div className="delivery-location-section mb-0 p-3">
                            <h6 className='fw-bold mb-3 p-text-color'>Add new delivery location(Whitelist)</h6>
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                <label className='me-2 text-dark'>Download delivery address template:</label>
                                <a className="btn btn-sm btn-secondary"
                                    href={downloadUrl}
                                >
                                    <span className='me-1'>
                                        <FaDownload size={13} color='#fff' />
                                    </span>
                                    Download
                                </a>
                            </div>
                            <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
                                <label className='d-block mb-2 text-dark'>Upload your delivery addresses:</label>
                                <div className="d-flex align-items-end flex-column">
                                    <div>
                                        <input
                                            type="file"
                                            id="whitelist-upload"
                                            accept=".xls,.xlsx"
                                            onChange={handleWhitelistFileChange}
                                            className="d-none"
                                        />
                                        <label htmlFor="whitelist-upload" className="btn btn-sm btn-secondary text-end" style={{ padding: "4px 17px" }}>
                                            <span className='me-1'>
                                                <FaUpload size={13} color='#fff' />
                                            </span>
                                            Upload
                                        </label>
                                    </div>
                                    {whitelistFile && (
                                        <span className="small">{whitelistFile.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button
                                     className={`my-coust-btn ${(!whitelistFile || loading) ? 'bg-disable' : ''}`}
                                    onClick={handleWhitelistSubmit}
                                    disabled={!whitelistFile || loading}
                                     style={(!whitelistFile || loading) ? { cursor: 'not-allowed' } : {}}
                                >
                                    {loading ? 'Uploading...' : 'Submit'}
                                </button>
                            </div>
                        </div>

                        {/* Second Section - Blacklist */}
                        {/* <div className="delivery-location-section mb-0 p-3">
                            <h6 className='fw-bold mb-3 p-text-color'>Block delivery location(Blacklist)</h6>
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                <label className='me-2 text-dark'>Download delivery address template:</label>
                                <a className="btn btn-sm btn-secondary">
                                    <span className='me-1'>
                                        <FaDownload size={13} color='#fff' />
                                    </span>
                                    Download
                                </a>
                            </div>
                            <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
                                <label className='d-block mb-2 text-dark'>Upload your delivery addresses:</label>
                                <div className="d-flex align-items-end flex-column">
                                    <div>
                                        <input
                                            type="file"
                                            id="blacklist-upload"
                                            accept=".xls,.xlsx"
                                            onChange={handleBlacklistFileChange}
                                            className="d-none"
                                        />
                                        <label htmlFor="blacklist-upload" className="btn btn-sm btn-secondary" style={{ padding: "4px 17px" }}>
                                            <span className='me-1'>
                                                <FaUpload size={13} color='#fff' />
                                            </span>
                                            Upload
                                        </label>
                                    </div>
                                    {blacklistFile && (
                                        <span className="small">{blacklistFile.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button className=" my-coust-btn">Submit</button>
                            </div>
                        </div> */}

                        {/* Third Section - Video */}
                        <div className="delivery-location-section p-3 border rounded">
                            <h6 className='fw-bold mb-3 p-text-color'>Guide: How to add or block delivery location check here</h6>
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src="https://www.youtube.com/embed/RRMpWijZMGo"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;
