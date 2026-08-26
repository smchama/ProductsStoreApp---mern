// src/App.jsx - Cache Buster Update 2026
import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./Pages/HomePage.jsx";
import CreatePage from "./Pages/CreatePage.jsx";
import ProductDetailsPage from "./Pages/ProductDetailsPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AdminOrdersPage from "./Pages/AdminOrdersPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
// If you have LoginPage or SignupPage files, import them here:
// import LoginPage from "./Pages/LoginPage.jsx";
// import SignupPage from "./Pages/SignupPage.jsx";

function App() {
  return (
    <Box minH={"100vh"} display="flex" flexDirection="column">
      <Navbar />

      <Box flex="1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          
          {/* If you have login/signup pages, uncomment these: */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/signup" element={<SignupPage />} /> */}

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            }
          />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;