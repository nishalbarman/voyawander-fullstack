import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../Components/homepage/HomePage";
import ContactUs from "../Components/contact-us/ContactUs";
import { Login } from "../Components/Login/Login";
import { Signup } from "../Components/Signup/Signup";
import Payment from "../Components/Payment/Payment";
import Thankyou from "./../Components/Payment/Thankyou";
import Hotel from "../Components/Hotels/Hotel";
import { ChakraProvider } from "@chakra-ui/react";
import HotelSingleInfo from "../Components/Hotels/HotelSingleInfo";
import PrivateRoute from "../Components/PrivateRoute";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/contactus" element={<ContactUs />}></Route>
      <Route
        path="/hotel"
        element={
          <PrivateRoute>
            <Hotel />
          </PrivateRoute>
        }></Route>
      <Route path="/singlepage" element={<HotelSingleInfo />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/Signup" element={<Signup />}></Route>
      <Route
        path="/Payment"
        element={
          <ChakraProvider>
            <Payment />
          </ChakraProvider>
        }></Route>
      <Route
        path="/Payment-Success"
        element={
          <ChakraProvider>
            <Thankyou />
          </ChakraProvider>
        }></Route>
    </Routes>
  );
}

export default AllRoutes;
