import { Routes, Route, Navigate } from "react-router-dom";


import Home from "../screen/app/home/Home";
import Products from "../screen/app/products/Products";


const AppStack = () => {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    )
}

export default AppStack;