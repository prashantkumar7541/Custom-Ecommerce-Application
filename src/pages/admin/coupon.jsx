import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/admin/sidebar';
import { useParams, useNavigate } from 'react-router-dom';

const CouponPage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [couponData, setCouponData] = useState({
    code: '',
    discountPercentage: ''
  });

  useEffect(() => {
    const verifySeller = async () => {
      if (!sellerId) {
        navigate('/seller/login');
        return;
      }

      try {
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/admin/verify-seller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sellerId })
        });

        const data = await response.json();
        
        if (data.loggedIn !== 'loggedin') {
          navigate('/seller/login');
        }
      } catch (error) {
        console.error('Error verifying seller:', error);
        navigate('/seller/login');
      }
    };

    verifySeller();
  }, [sellerId, navigate]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/coupon/get-coupon');
      const data = await response.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError('Failed to fetch coupons');
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponData({ ...couponData, code });
  };

  const handleCreateCoupon = () => {
    generateCouponCode();
    setShowDialog(true);
  };

  const handleDeleteCoupon = async (code, discountPercentage) => {
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/coupon/delete-coupon', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          discountPercentage
        })
      });

      if (response.ok) {
        fetchCoupons();
      } else {
        setError('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setError('Something went wrong');
    }
  };

  const handleSaveCoupon = async () => {
    if (!couponData.code || !couponData.discountPercentage) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/coupon/save-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(couponData)
      });

      if (response.ok) {
        setShowDialog(false);
        fetchCoupons();
        setCouponData({
          code: '',
          discountPercentage: ''
        });
      } else {
        setError('Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      setError('Something went wrong');
    }
  };

  return (
    <>
      <Helmet>
        <title>Coupons | Admin Dashboard</title>
      </Helmet>
      <Sidebar />
      <div className="min-h-screen bg-gray-100 sm:ml-0 md:ml-[10vh] lg:ml-[40vh]">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coupons</h1>
              <button
                onClick={handleCreateCoupon}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Plus size={20} />
                Create New Coupon
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8 bg-red-50 rounded-lg">{error}</div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="text-gray-500">No coupons created yet</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {coupons.map((coupon) => (
                  <motion.div
                    key={coupon._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                  >
                    <button 
                      onClick={() => handleDeleteCoupon(coupon.code, coupon.discountPercentage)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex flex-col h-full">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{coupon.code}</h3>
                      <div className="flex items-center mt-auto">
                        <span className="text-3xl font-bold text-pink-600">{coupon.discountPercentage}%</span>
                        <span className="ml-2 text-gray-600">OFF</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {showDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div 
                  className="bg-white p-6 rounded-lg w-full max-w-md"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Coupon Code</label>
                      <input
                        type="text"
                        value={couponData.code}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Discount Percentage</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={couponData.discountPercentage}
                        onChange={(e) => setCouponData({ ...couponData, discountPercentage: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        onClick={() => setShowDialog(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCoupon}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponPage;
