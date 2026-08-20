// src/App.jsx
import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./Pages/HomePage.jsx";
import CreatePage from "./Pages/CreatePage.jsx";
import ProductDetailsPage from "./Pages/ProductDetailsPage.jsx"; // 👈 Uncomment import
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AdminOrdersPage from "./Pages/AdminOrdersPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

function App() {
  return (
    <Box minH={"100vh"} display="flex" flexDirection="column">
      <Navbar />

      <Box flex="1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} /> {/* 👈 Enabled route */}

          {/* Protected Admin Orders Route */}
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