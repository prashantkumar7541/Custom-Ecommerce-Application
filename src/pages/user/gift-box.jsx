import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../../components/user/navbar/navbar';

function GiftBox() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const location = useLocation();
  const category = location.pathname.split('/').pop(); // Extract category from URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/product/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ category })
        });
        const data = await response.json();
        if (data.success) {
          const validProducts = data.products.filter(
            product =>
              product.name &&
              product.price &&
              product.img &&
              product.category &&
              product.productId &&
              (product.visibility === 'on' || product.visibility === 'true')
          );
          setProducts(validProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <>
      <Helmet>
        <title>Gift Boxes | Mera Bestie</title>
      </Helmet>
      <div className="bg-gradient-to-b from-pink-50 to-pink-100 min-h-screen relative mt-16">
        <Navbar className="sticky top-0 z-50 bg-white shadow-md" />

        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center py-20 text-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url('src/assets/bg-shop.png')",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl font-extrabold text-pink-800 mb-4 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {category?.split('-').join(' ').toUpperCase()}
            </motion.h1>
            <motion.p
              className="text-gray-700 text-xl max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              Explore our collection of {category?.split('-').join(' ')} for every occasion.
            </motion.p>
          </div>
        </section>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link to={`/${product.productId}`} className="block">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${product.img}')` }}
                  ></div>
                  <div className="p-4 text-center">
                    <h4 className="font-bold text-pink-800">{product.name}</h4>
                    <p className="text-gray-600">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="bg-white py-16 text-black border-t border-pink-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-3xl font-extrabold text-pink-800 mb-4">MERA Bestie</h4>
              <p className="text-gray-600 mb-4 text-center md:text-left">
                Your one-stop destination for thoughtful and unique gifts.
              </p>
              <div className="flex space-x-6 text-3xl mt-4">
                <FaFacebook className="text-pink-600 hover:text-pink-800 transition cursor-pointer" />
                <FaInstagram className="text-pink-600 hover:text-pink-800 transition cursor-pointer" />
                <FaTwitter className="text-pink-600 hover:text-pink-800 transition cursor-pointer" />
              </div>
            </div>
            <div className="text-center md:text-right">
              <h5 className="text-2xl font-bold text-pink-800 mb-4">Contact Us</h5>
              <p className="text-gray-600">
                3181 Street Name, City, India
                <br />
                Email: support@merabestie.com
                <br />
                Phone: +91 1234567890
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default GiftBox;
