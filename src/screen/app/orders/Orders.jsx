import React, { useState } from "react";
import './orders.css';
import OrderedTbl from "./orderTable/OrderedTbl";
import PackedTbl from "./orderTable/PackedTbl";
import TransitTbl from "./orderTable/TransitTbl";
import DeliveredTbl from "./orderTable/DeliveredTbl";
import CancelTbl from "./orderTable/CancelTbl";
import { useLocation } from 'react-router-dom';


const Orders = () => {
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(
        location.state?.activeTab || 'ORDERED'
    );


    // const [activeTab, setActiveTab] = useState('ORDERED');


    const renderTable = () => {
        switch (activeTab) {
            case 'ORDERED':
                return <OrderedTbl />;
            case 'PCKD':
                return <PackedTbl />;
            case 'TRANSIT':
                return <TransitTbl />;
            case 'DELIVERED':
                return <DeliveredTbl />;
            case 'CANCEL':
                return <CancelTbl />;
            default:
                return <OrderedTbl />;
        }
    }

    return (
        <div className="order-section-page">
            <div className='row'>
                <div className='col-12 d-flex justify-content-between gap-1'>
                    <div
                        className={`order-status-box position-relative ${activeTab === 'ORDERED' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ORDERED')}
                    >
                        <p className={`mb-0 order-text ${activeTab === 'ORDERED' ? 'text-light' : ''}`}>Order received & waiting for packing</p>
                        <span className={`${activeTab === 'ORDERED' ? 'order-status-indecator' : ''}`}></span>
                    </div>

                    <div
                        className={`order-status-box position-relative ${activeTab === 'PCKD' ? 'active' : ''}`}
                        onClick={() => setActiveTab('PCKD')}
                    >
                        <p className={`mb-0 order-text ${activeTab === 'PCKD' ? 'text-light' : ''}`}>Order packed & waiting for pickup</p>
                        <span className={`${activeTab === 'PCKD' ? 'order-status-indecator' : ''}`}></span>
                    </div>

                    <div
                        className={`order-status-box position-relative ${activeTab === 'TRANSIT' ? 'active' : ''}`}
                        onClick={() => setActiveTab('TRANSIT')}
                    >
                        <p className={`mb-0 order-text ${activeTab === 'TRANSIT' ? 'text-light' : ''}`}>In transit orders</p>
                        <span className={`${activeTab === 'TRANSIT' ? 'order-status-indecator' : ''}`}></span>
                    </div>
                    <div
                        className={`order-status-box position-relative ${activeTab === 'DELIVERED' ? 'active' : ''}`}
                        onClick={() => setActiveTab('DELIVERED')}
                    >
                        <p className={`mb-0 order-text ${activeTab === 'DELIVERED' ? 'text-light' : ''}`}>Delivered</p>
                        <span className={`${activeTab === 'DELIVERED' ? 'order-status-indecator' : ''}`}></span>
                    </div>
                    <div
                        className={`order-status-box position-relative ${activeTab === 'CANCEL' ? 'active' : ''}`}
                        onClick={() => setActiveTab('CANCEL')}
                    >
                        <p className={`mb-0 order-text ${activeTab === 'CANCEL' ? 'text-light' : ''}`}>Cancelled</p>
                        <span className={`${activeTab === 'CANCEL' ? 'order-status-indecator' : ''}`}></span>
                    </div>
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col-12'>
                    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                        {renderTable()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders;