import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { 
  FaMinus, 
  FaPlus, 
  FaShoppingCart, 
  FaStar, 
  FaTag,
  FaBox, 
  FaShippingFast,
  FaWarehouse,
  FaExclamationCircle
} from 'react-icons/fa';
import Navbar from '../../components/user/navbar/navbar';
import { Helmet } from "react-helmet";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [stockStatus, setStockStatus] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    {
      name: 'John Doe',
      rating: 4,
      reviewText: 'Great product! Really useful and high quality.'
    },
    {
      name: 'Jane Smith', 
      rating: 5,
      reviewText: 'Exceeded my expectations. Worth every penny!'
    },
    {
      name: 'Alex Johnson',
      rating: 3,
      reviewText: "It's okay, but I was expecting more features."
    }
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ecommercebackend-8gx8.onrender.com/:productId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          calculateStockStatus(data.product);
          fetchRelatedProducts(data.product.category);
          updateRecentlyViewed(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  const calculateStockStatus = (productData) => {
    const stock = productData.inStockValue || 0;
    let status = '';
    let color = '';

    if (stock > 50) {
      status = 'In Stock';
      color = 'text-green-600 bg-green-50';
    } else if (stock > 10) {
      status = 'Low Stock';
      color = 'text-yellow-600 bg-yellow-50';
    } else if (stock > 0) {
      status = 'Very Low Stock';
      color = 'text-orange-600 bg-orange-50';
    } else {
      status = 'Out of Stock';
      color = 'text-red-600 bg-red-50';
    }

    setStockStatus({ status, color, stock });
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(`https://ecommercebackend-8gx8.onrender.com/products?category=${category}`);
      const data = await response.json();
      if (data.success) {
        setRelatedProducts(data.products.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const updateRecentlyViewed = (productData) => {
    let viewedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    viewedProducts = viewedProducts.filter((p) => p.productId !== productData.productId);
    viewedProducts.unshift(productData);
    if (viewedProducts.length > 5) {
      viewedProducts.pop();
    }
    localStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
    setRecentlyViewed(viewedProducts);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (stockStatus?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      navigate('/login');
      return;
    }
  
    if (stockStatus?.stock === 0) {
      toast.error('Sorry, this product is currently out of stock');
      return;
    }
  
    // Ensure quantity is a number before sending to the server
    const validQuantity = parseInt(quantity, 10); // Ensure `quantity` is a number
    if (isNaN(validQuantity) || validQuantity <= 0) {
      toast.error('Invalid quantity');
      return;
    }
  
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/cart/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: validQuantity, // Send valid quantity here
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success(
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/cart')}>
            Go to Cart →
          </div>
        );
      } else {
        toast.error(data.message || 'Product not saved to cart');
      }
    } catch (error) {
      toast.error('Error adding product to cart');
      console.error('Error adding to cart:', error);
    }
  };
  
  

  const handleWriteReview = () => {
    setShowReviewDialog(true);
  };

  const closeReviewDialog = () => {
    setShowReviewDialog(false);
  };

  const handleSubmitReview = () => {
    const newReview = {
      name: userName || 'Anonymous',
      rating,
      reviewText,
    };
    setReviews([newReview, ...reviews]);
    setShowReviewDialog(false);
    setUserName('');
    setRating(1);
    setReviewText('');
    toast.success('Review submitted successfully');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="w-16 h-16 border-4 border-t-4 border-t-pink-600 border-pink-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Mera Bestie</title>
      </Helmet>
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image Section */}
              <div className="p-8 bg-gray-50 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full max-w-md h-[500px] relative"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain rounded-2xl shadow-lg"
                  />
                </motion.div>
              </div>

              {/* Product Info Section */}
              <div className="p-8 space-y-6">
                {/* Header Section with Name and Price */}
                <div className="border-b border-pink-100 pb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text">
                    {product.name}
                  </h1>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-pink-600">
                      {product.price}
                    </p>
                    <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium text-yellow-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Status Section */}
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full flex items-center ${stockStatus?.color}`}>
                    {stockStatus?.status === 'In Stock' && <FaBox className="mr-2 text-green-600" />}
                    {stockStatus?.status === 'Low Stock' && <FaExclamationCircle className="mr-2 text-yellow-600" />}
                    {stockStatus?.status === 'Very Low Stock' && <FaWarehouse className="mr-2 text-orange-600" />}
                    {stockStatus?.status === 'Out of Stock' && <FaShippingFast className="mr-2 text-red-600" />}
                    <span className="font-medium">
                      {stockStatus?.status} ({stockStatus?.stock} available)
                    </span>
                  </div>
                  <div className="bg-pink-50 px-4 py-2 rounded-full flex items-center">
                    <FaTag className="mr-2 text-pink-500" />
                    <span className="font-medium text-pink-600">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Quantity Section */}
                <div className="flex items-center space-x-4 py-6">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-xl font-medium text-gray-700">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    disabled={quantity >= stockStatus?.stock}
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-xl shadow-md flex flex-col items-center w-full max-w-sm"
                >
                  <span className="font-semibold">{review.name}</span>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar
                        key={idx}
                        className={`ml-1 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-gray-700 text-sm">{review.reviewText}</p>
                </div>
              ))}
            </div>

            {/* Write a Review Button */}
            <div className="mt-7 flex justify-center">
              <button
                onClick={handleWriteReview}
                className="w-64 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
              >
                Write a Review
              </button>
            </div>
          </div>

          {/* Review Dialog */}
          {showReviewDialog && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                />
                <div className="flex space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                  rows="4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={closeReviewDialog}
                    className="py-2 px-4 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="py-2 px-4 bg-pink-600 text-white rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className="mt-12 max-w-7xl mx-auto p-9 pt-0">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentlyViewed.map((item) => (
              <Link key={item.productId} to={`/product/${item.productId}`}>
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="text-lg font-semibold text-pink-600">{item.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
