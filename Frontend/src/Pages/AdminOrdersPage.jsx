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
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import useAuthStore from "../store/auth.js";

const API_URL = "http://localhost:5000";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const cardBg = useColorModeValue("white", "gray.800");

  // Grab both user and token correctly from Zustand store
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          console.error("No token found in auth store");
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
    <Container maxW="container.xl" py={8}>
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={6}
        spacing={4}
      >
        <Heading size="lg">
          Admin Dashboard: Customer Orders ({filteredOrders.length})
        </Heading>

        <InputGroup maxW={{ base: "full", md: "350px" }}>
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
        <Text color="gray.500">No matching orders found.</Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {filteredOrders.map((order) => (
            <Card key={order._id} bg={cardBg} shadow="md" borderRadius="lg">
              <CardBody>
                <Stack direction={{ base: "column", md: "row" }} justify="space-between" mb={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Order ID: <span style={{ fontWeight: "bold" }}>{order._id}</span>
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={order.status === "Pending" ? "yellow" : "green"}
                    fontSize="0.9em"
                    p={2}
                    borderRadius="md"
                    h="fit-content"
                  >
                    {order.status}
                  </Badge>
                </Stack>

                <Divider mb={4} />

                <Stack direction={{ base: "column", md: "row" }} spacing={6} justify="space-between">
                  <Box flex="1">
                    <Text fontWeight="bold" mb={1}>Customer Details:</Text>
                    <Text>Name: {order.fullName}</Text>
                    <Text>Address: {order.address}, {order.city}</Text>
                    <Text>Payment Method: {order.paymentMethod?.toUpperCase()}</Text>
                  </Box>

                  <Box flex="2">
                    <Text fontWeight="bold" mb={2}>Ordered Items:</Text>
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
                            <Td>{item.name}</Td>
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