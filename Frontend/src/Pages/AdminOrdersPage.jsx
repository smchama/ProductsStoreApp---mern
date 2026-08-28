// src/pages/AdminOrdersPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import useAuthStore from "../store/auth.js";

// ✅ Hardcode localhost directly to bypass any Vite environment caching or .env file conflicts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const cardBg = useColorModeValue("white", "gray.800");
  const toast = useToast();

  const { token: storeToken } = useAuthStore();
  const token = storeToken || localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          console.error("No token found in auth store or localStorage");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const nextStatusMap = {
      Pending: "Processing",
      Processing: "Delivered",
      Delivered: "Pending",
      Cancelled: "Pending",
    };

    const newStatus = nextStatusMap[currentStatus] || "Processing";

    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      toast({
        title: "Status Updated 🎉",
        description: `Order moved to ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order from your dashboard? The customer's history will remain intact.")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/admin/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete order");

      toast({
        title: "Order Removed 🗑️",
        description: "Order removed from admin dashboard successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const getStatusColorScheme = (status) => {
    switch (status) {
      case "Pending": return "yellow";
      case "Processing": return "blue";
      case "Delivered": return "green";
      case "Cancelled": return "red";
      default: return "gray";
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <VStack justify="center" h="60vh">
        <Spinner size="xl" color="blue.500" />
        <Text>Loading customer orders...</Text>
      </VStack>
    );
  }

  return (
    <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={6}
        spacing={4}
      >
        <Heading size={{ base: "md", md: "lg" }}>
          Admin Dashboard: Customer Orders ({filteredOrders.length})
        </Heading>

        <InputGroup maxW={{ base: "full", md: "350px" }} size={{ base: "md", md: "lg" }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by customer name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Stack>

      {filteredOrders.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={10}>
          No matching orders found.
        </Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {filteredOrders.map((order) => (
            <Card key={order._id} bg={cardBg} shadow="md" borderRadius="lg">
              <CardBody p={{ base: 4, md: 6 }}>
                <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }} mb={4} spacing={2}>
                  <Box overflow="hidden">
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" wordBreak="break-all">
                      Order ID: <span style={{ fontWeight: "bold" }}>{order._id}</span>
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  </Box>

                  <Stack direction="row" align="center" spacing={3} wrap="wrap">
                    <Badge
                      colorScheme={getStatusColorScheme(order.status)}
                      fontSize="0.9em"
                      p={2}
                      borderRadius="md"
                    >
                      {order.status || "Pending"}
                    </Badge>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleUpdateStatus(order._id, order.status || "Pending")}
                    >
                      Advance Status 🔄
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="solid"
                      leftIcon={<FiTrash2 />}
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Remove Order
                    </Button>
                  </Stack>
                </Stack>

                <Divider mb={4} />

                <Stack direction={{ base: "column", lg: "row" }} spacing={6} justify="space-between">
                  <Box flex="1">
                    <Text fontWeight="bold" mb={1} fontSize="md">Customer Details:</Text>
                    <Text fontSize="sm">Name: {order.fullName}</Text>
                    <Text fontSize="sm">Address: {order.address}, {order.city}</Text>
                    <Text fontSize="sm">Payment Method: {order.paymentMethod?.toUpperCase()}</Text>
                  </Box>

                  <Box flex="2" overflowX="auto">
                    <Text fontWeight="bold" mb={2} fontSize="md">Ordered Items:</Text>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Item</Th>
                          <Th>Qty</Th>
                          <Th isNumeric>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {order.items?.map((item, idx) => (
                          <Tr key={idx}>
                            <Td maxW="150px" isTruncated>{item.name}</Td>
                            <Td>{item.quantity}</Td>
                            <Td isNumeric>${Number(item.price).toFixed(2)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Text mt={3} fontWeight="bold" textAlign="right" fontSize="lg" color="green.500">
                      Total: ${Number(order.totalAmount).toFixed(2)}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default AdminOrdersPage;