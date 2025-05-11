import './home.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { BASE_URL } from '../../../config/urls';
import Loader from '../../../components/loader/Loader';

const Home = () => {

    const sellerId = useSelector((state) => state.auth?.sellerId);


    // State for order status counts
    const [orderStatus, setOrderStatus] = useState({
        ORDERED: 0,
        TRNST: 0,
        DLVRD: 0,
        CANCEL: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch order status data using Axios
    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/order/groupbyseller?sellerId=${sellerId}`);
                const data = response.data;

                if (data.rcode === 0) {
                    // Transform the array into an object for easier access
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

    // Handle status box click
    const handleStatusClick = (status) => {
        console.log(`Status clicked: ${status}`, orderStatus[status]);
        // You can add additional logic here, like filtering data based on status
    };


    // AG-Grid state and configuration
    const [rowData] = useState([
        { date: '2023-05-01', amount: 12500, paymentMode: 'Credit Card', transitId: 'TRX-001' },
        { date: '2023-05-02', amount: 8500, paymentMode: 'PayPal', transitId: 'TRX-002' },
        { date: '2023-05-03', amount: 22000, paymentMode: 'Bank Transfer', transitId: 'TRX-003' },
        { date: '2023-05-04', amount: 15000, paymentMode: 'Credit Card', transitId: 'TRX-004' },
        { date: '2023-05-05', amount: 18000, paymentMode: 'PayPal', transitId: 'TRX-005' },
    ]);

    const [columnDefs] = useState([
        {
            headerName: "Date",
            field: 'date',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 130
        },
        {
            headerName: 'Received Amount (INR)',
            field: 'amount',
            filter: true,
            sortable: true,
            cellStyle: { fontWeight: 'bold' },
            width: 180
        },
        {
            headerName: 'Payment Mode',
            field: 'paymentMode',
            filter: true,
            sortable: true,
            width: 180
        },
        {
            headerName: 'Transit ID',
            field: 'transitId',
            filter: true,
            sortable: true,
        },
    ]);


    // File upload state
    const [whitelistFile, setWhitelistFile] = useState(null);
    const [blacklistFile, setBlacklistFile] = useState(null);

    const handleWhitelistFileChange = (e) => {
        if (e.target.files.length > 0) {
            setWhitelistFile(e.target.files[0]);
        }
    };

    const handleBlacklistFileChange = (e) => {
        if (e.target.files.length > 0) {
            setBlacklistFile(e.target.files[0]);
        }
    };

    return (
        <>
            {loading && <Loader message="Loading..." />}
            <div className="admin-home-page">
                <h5 className='text-dark fw-bold'>Order Overview</h5>
                <div className="row pb-2 first-sec">
                    <div className='col-12 d-flex justify-content-between gap-1'>
                        {/* Order Received (ORDERED) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('ORDERED')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-2 text-light text-center'>Order received & waiting for packup</p>
                            <p className='mb-0 text-light home-count text-end'>{orderStatus.ORDERED}</p>
                        </div>

                        {/* In Transit (TRNST) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('TRNST')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-0 text-light text-center'>In transit orders</p>
                            <p className='mb-0 text-light home-count text-end'>{orderStatus.TRNST}</p>
                        </div>

                        {/* Delivered (DLVRD) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('DLVRD')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-0 text-light text-center'>Delivered</p>
                            <p className='mb-0 text-light home-count text-end'>{orderStatus.DLVRD}</p>
                        </div>

                        {/* Cancelled (CANCEL) */}
                        <div
                            className="order-status-box-one position-relative flex-column"
                            onClick={() => handleStatusClick('CANCEL')}
                            style={{ cursor: 'pointer' }}
                        >
                            <p className='mb-0 text-light text-center'>Cancelled</p>
                            <p className='mb-0 text-light home-count text-end'>{orderStatus.CANCEL}</p>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12 payment-overview-container'>
                        <h5 className='text-dark fw-bold mt-2'>Payment Overview</h5>
                        <div className="pay-over-table-filter-container mb-3">
                            <div className='pay-over-table-filter-box d-flex flex-column'>
                                <label className='text-dark'>From</label>
                                <input type='date' />
                            </div>
                            <div className='pay-over-table-filter-box d-flex flex-column'>
                                <label className='text-dark'>To</label>
                                <input type='date' />
                            </div>
                            <div className='pay-over-table-filter-box'>
                                <select name="days" id="days" className='pay-over-table-filter-select-btn'>
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                    <option value="6month">Last 6 Months</option>
                                    <option value="1yr">Last Year</option>
                                </select>
                            </div>
                        </div>
                        <p className="p-text-color fw-bold">Total Amount Receieved(as per filter data range): 123454.00 (INR)</p>

                        <div className="home-table ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                            <AgGridReact
                                // ref={gridRef}
                                rowData={rowData}
                                columnDefs={columnDefs}
                                suppressCellFocus={true}
                                defaultColDef={{
                                    resizable: true,
                                    sortable: true,
                                    filter: true
                                }}
                                animateRows={true}
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
                                <a className="btn btn-sm btn-secondary">Download</a>
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
                                        <label htmlFor="whitelist-upload" className="btn btn-sm btn-secondary text-end">
                                            Uplouad
                                        </label>
                                    </div>
                                    {whitelistFile && (
                                        <span className="small">{whitelistFile.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button className=" my-coust-btn">Submit</button>
                            </div>
                        </div>

                        {/* Second Section - Blacklist */}
                        <div className="delivery-location-section mb-0 p-3">
                            <h6 className='fw-bold mb-3 p-text-color'>Block delivery location(Blacklist)</h6>
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                <label className='me-2 text-dark'>Download delivery address template:</label>
                                <a className="btn btn-sm btn-secondary">Download</a>
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
                                        <label htmlFor="blacklist-upload" className="btn btn-sm btn-secondary">
                                            Uplouad
                                        </label>
                                    </div>
                                    {blacklistFile && (
                                        <span className="small">{blacklistFile.name}</span>
                                    )}
                                </div>
                            </div>
                        </div>

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