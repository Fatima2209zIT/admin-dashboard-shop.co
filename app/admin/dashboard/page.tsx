"use client";
import Swal from "sweetalert2";
import { client } from "../../../sanity/lib/client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { FaTrash, FaEye, FaTruck, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface CartItem {
  name: string;
  image: string;
}

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: CartItem[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [ordersMenuOpen, setOrdersMenuOpen] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id, firstName, lastName, phone, email, address,
          zipCode, city, total, discount, orderDate, status,
          cartItems[] -> { name, image }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders", error));
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await client.delete(orderId);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        Swal.fire("Deleted!", "Order has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete order.", "error");
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Updated!", `Order marked as ${newStatus}.`, "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update order status.", "error");
    }
  };

  const statusStyles: Record<string, string> = {
    Pending: "bg-yellow-500 text-white",
    Dispatch: "bg-blue-500 text-white",
    Success: "bg-green-500 text-white",
  };
  const toggleOrdersMenu = () => {
    setOrdersMenuOpen((prev) => !prev);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-gradient-to-b from-blue-600 to-purple-700 p-6 space-y-6">
          <h2 className="text-2xl font-bold">SHOP.CO</h2>
          <div className="space-y-3">
            <button
              onClick={toggleOrdersMenu}
              className="flex justify-between items-center w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              <span className="font-medium">Orders</span>
              {ordersMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {ordersMenuOpen && (
              <div className="mt-2 space-y-2 pl-4">
                {["All", "Pending", "Dispatch", "Success"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                      filter === status
                        ? "bg-white text-black font-bold"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
   
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 p-6 shadow-lg rounded-lg">
              <ul className="divide-y divide-gray-700">
                {filteredOrders.length === 0 ? (
                  <p className="text-center text-gray-400">No orders found.</p>
                ) : (
                  filteredOrders.map((order) => (
                    <li
                      key={order._id}
                      className="p-4 hover:bg-gray-700 rounded-lg transition duration-300"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex-1">
                          <p className="text-lg font-medium">
                            {order.firstName} {order.lastName}
                          </p>
                          <p className="text-sm text-gray-400">{order.email}</p>
                          <p className="text-sm text-gray-400">
                            {order.orderDate}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm ${
                              statusStyles[order.status || "Pending"]
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 mt-4 md:mt-0">
                          <button
                            onClick={() => toggleOrderDetails(order._id)}
                            className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500 transition"
                          >
                            <FaEye className="text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="bg-red-600 p-2 rounded-lg hover:bg-red-500 transition"
                          >
                            <FaTrash className="text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Order Details */}
                      {selectedOrderId === order._id && (
                        <div className="mt-4 bg-gray-700 p-4 rounded-lg">
                          <p className="text-gray-300">
                            <span className="font-bold">Address:</span>{" "}
                            {order.address}, {order.city}, {order.zipCode}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-bold">Total:</span> $
                            {order.total}
                          </p>
                          <div className="mt-4">
                            <h3 className="font-bold text-lg">Order Items</h3>
                            <ul className="mt-2 space-y-2">
                              {order.cartItems.map((item, index) => (
                                <li
                                  key={`${order._id}-${index}`}
                                  className="flex items-center space-x-3"
                                >
                                  {item.image && (
                                    <Image
                                      src={urlFor(item.image).url()}
                                      alt={item.name}
                                      width={50}
                                      height={50}
                                      className="rounded-lg"
                                    />
                                  )}
                                  <p className="text-gray-300">{item.name}</p>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Status Actions */}
                          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-3">
                            <button
                              onClick={() =>
                                handleStatusChange(order._id, "Dispatch")
                              }
                              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition"
                            >
                              <FaTruck className="mr-2" /> Dispatch
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(order._id, "Success")
                              }
                              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition"
                            >
                              <FaCheckCircle className="mr-2" /> Mark as Success
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
