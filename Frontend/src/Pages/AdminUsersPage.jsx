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
  Button,
  useToast,
} from "@chakra-ui/react";
import { FiKey, FiTrash2 } from "react-icons/fi";
import useAuthStore from "../store/auth.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue("white", "gray.800");
  const toast = useToast();

  const { token: storeToken } = useAuthStore();
  const token = storeToken || localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUsers(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleResetPassword = async (userId) => {
    const newPassword = prompt("Enter new password for this user (min 6 characters):");
    if (!newPassword) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/users/${userId}/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Success", description: data.message, status: "success", duration: 3000 });
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error", duration: 4000 });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUsers(users.filter((u) => u._id !== userId));
      toast({ title: "User Deleted", status: "success", duration: 3000 });
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error", duration: 4000 });
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Admin Dashboard: Manage Users ({users.length})</Heading>
      <Box bg={cardBg} p={6} borderRadius="lg" shadow="md" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name / Email</Th>
              <Th>Role</Th>
              <Th>Joined Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((u) => (
              <Tr key={u._id}>
                <Td>
                  <Text fontWeight="bold">{u.name || "N/A"}</Text>
                  <Text fontSize="sm" color="gray.500">{u.email}</Text>
                </Td>
                <Td>
                  <Badge colorScheme={u.role === "admin" ? "purple" : "green"}>{u.role}</Badge>
                </Td>
                <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <Button size="sm" colorScheme="orange" leftIcon={<FiKey />} mr={2} onClick={() => handleResetPassword(u._id)}>
                    Reset Password
                  </Button>
                  <Button size="sm" colorScheme="red" leftIcon={<FiTrash2 />} onClick={() => handleDeleteUser(u._id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default AdminUsersPage;