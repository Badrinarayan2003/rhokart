import { useState } from "react";
import "./businessDetailCountryCode.css";

import { codes } from '../../constants/data';

const BusinessDetailCountryCode = () => {
    const [selectedCode, setSelectedCode] = useState("0");

    return (
        <div className="custom-select">
            <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)}>
                {codes.map((code) => (
                    <option key={code.value} value={code.value}>
                        {code.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default BusinessDetailCountryCode;
