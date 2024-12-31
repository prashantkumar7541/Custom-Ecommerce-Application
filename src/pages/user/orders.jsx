import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import Navbar from '../../components/user/navbar/navbar';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://ecommercebackend-8gx8.onrender.com/find-my-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        });

        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/:productId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (data.success) {
        return data.product;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
    return null;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <motion.div 
            className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-lg text-gray-700 font-medium"
          >
            Fetching your orders...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 mt-16">
      <Helmet>
        <title>My Orders | Mera Bestie</title>
      </Helmet>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg mb-8 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
          </div>
        </motion.div>

        <div className="space-y-8">
          {orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <p className="text-gray-600 text-xl">No orders found</p>
              <button 
                onClick={() => navigate('/shop')} 
                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-300"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <OrderCard order={order} fetchProductDetails={fetchProductDetails} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, fetchProductDetails }) => {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const productDetails = await Promise.all(
        order.productIds.map(id => fetchProductDetails(id))
      );
      setProducts(productDetails.filter(product => product !== null));
    };
    loadProducts();
  }, [order.productIds, fetchProductDetails]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Order Date</h3>
            <p className="text-gray-800 font-medium">{order.date} {order.time}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Order Total</h3>
            <p className="text-gray-800 font-medium">₹{order.price}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500">Shipping Address</h3>
            <p className="text-gray-800 font-medium">{order.address}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Products Ordered</h3>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-lg flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <img src={product.img} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <p className="text-gray-800 font-semibold">{product.name}</p>
                  <p className="text-pink-600 font-medium">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Order;

