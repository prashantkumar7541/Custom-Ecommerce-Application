import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import { FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Scroll Progress Bar Component
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <motion.div
      style={{ scaleX: scrollProgress / 100 }}
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 origin-left z-50"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
  );
};

// Custom Left Arrow Component
const CustomLeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-pink-500 rounded-full p-2 shadow-md z-10"
    aria-label="Previous Slide"
  >
    <FaArrowLeft size={20} />
  </button>
);

// Custom Right Arrow Component
const CustomRightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-pink-500 rounded-full p-2 shadow-md z-10"
    aria-label="Next Slide"
  >
    <FaArrowRight size={20} />
  </button>
);

// Custom Dot Component for Carousel
const CustomDot = ({ onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-2 h-2 rounded-full mx-1 focus:outline-none transition-colors duration-300 ${
      active ? 'bg-pink-700' : 'bg-pink-500 opacity-75'
    }`}
    aria-label="Carousel Dot"
  />
);

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-cubic",
      once: true,
    });
  }, []);

  const reviews = [
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
      reviewText: 'It’s okay, but I was expecting more features.'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      reviewText: 'Absolutely love it! Will definitely buy again.'
    },
    {
      name: 'Michael Brown',
      rating: 4,
      reviewText: 'Very good quality and fast shipping.'
    },
    {
      name: 'Sarah Wilson',
      rating: 5,
      reviewText: 'Fantastic! Highly recommend to everyone.'
    },
    {
      name: 'David Lee',
      rating: 2,
      reviewText: 'Not what I expected. Quality could be better.'
    },
    // Add more reviews as needed
  ];

  const productCategories = [
    {
      img: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Gift Boxes
      title: "Gift Boxes",
      category: "Gift-Boxes",
      description: "Huge collection of Gift Boxes for every occasion.",
    },
    {
      img: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg", // Stationery
      title: "Stationery",
      category: "Stationery",
      description: "Elegant and functional stationery items for every occasion."
    },
    {
      img: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Books
      title: "Books",
      category: "Books",
      description: "A diverse collection of books to inspire and educate."
    }
  ];

  // Separate responsive configuration for Product Categories Carousel
  const categoryResponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  // Existing responsive configuration for Reviews Carousel
  const reviewResponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const newArrivals = [
    {
      img: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Gift Boxes
      title: "Gift Boxes",
      category: "Gift-Boxes"
    },
    {
      img: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg", // Stationery
      title: "Stationery",
      category: "Stationery"
    },
    {
      img: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Books
      title: "Books",
      category: "Books"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Mera Bestie | Unique Gifting Experience</title>
        <meta
          name="description"
          content="Discover unique gifts and thoughtful collections for every occasion."
        />
      </Helmet>
      <ScrollProgress />
      <Navbar />
      <div className="w-full bg-white overflow-hidden mt-16">
                {/* Product Categories Section */}
                <section className="px-0 pt-0 py-20 bg-gray-50">
          <div className="w-full">
            <Carousel
              responsive={categoryResponsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              keyBoardControl={true}
              customTransition="transform 0.5s ease-in-out"
              transitionDuration={500}
              containerClass="carousel-container relative w-full"
              removeArrowOnDeviceType={[]}
              showDots={false}
              arrows={true}
              customDot={<CustomDot />}
              dotListClass="flex justify-center mt-4"
              renderDotsOutside={false}
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
              itemClass="carousel-item"
            >
              {productCategories.map((category, index) => (
                <Link
                to={`/${category.category}`}
                  key={index}
                  className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <img
                    src={category.img}
                    alt={category.title}
                    className="object-cover w-full h-96 transition-transform duration-500 ease-in-out transform hover:scale-110"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end items-center bg-gradient-to-t from-black/85 via-transparent to-transparent pt-4 pb-8">
                    <h3 className="text-5xl font-extrabold text-white text-center mb-2">{category.title}</h3>
                    <button
                      onClick={() => (window.location.href = `/${category.category}`)}
                      className="mt-4 bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-700 transition"
                    >
                      Shop Now
                    </button>
                  </div>
                </Link>
              ))}
            </Carousel>
          </div>
        </section>

    
        {/* Hero Section with Modern Glassmorphism Design */}

        {/* Product Categories Section with Refined Styling */}
        {/* Removed duplicate closing section tag */}

    {/* Optional: Remove the additional "Shop Now" button below the carousel if not needed */}
    {/* <div className="text-center mt-8">
      <button
        onClick={() => window.location.href="#shop"}
        className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition"
      >
        Shop Now
      </button>
    </div> */}

<section className="px-0 py-20 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-pink-500">New Arrivals</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto mb-6"></div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map((item, index) => (
                <Link
                  to={`/${item.category}`}
                  key={index}
                  className="bg-pink-500 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="relative w-full h-60 overflow-hidden rounded-md">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-500 ease-in-out transform hover:scale-110"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>




        {/* New Arrivals Section */}
        
        
<section
  className="relative min-h-[80vh] flex items-center py-16 sm:py-20 md:py-24 lg:py-28" // Updated padding
  data-aos="fade-up"
>
  <div className="absolute inset-0 z-0">
    <img
      src="https://tse3.mm.bing.net/th?id=OIP.RNJBshhRJcxPoSt2Slj5bAHaEK&pid=Api&P=0&h=180"
      alt="Vision Background"
      className="w-full h-full object-cover filter brightness-50"
      loading="lazy"
    />
  </div>

  <div className="container relative z-10 mx-auto max-w-6xl px-4">
    <motion.div
      className="bg-white/20 backdrop-blur-md border border-white/30 p-16 md:p-20 rounded-3xl max-w-2xl mx-auto text-center shadow-2xl" // Increased padding
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h2 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
        Our Vision
      </h2>
      <p className="text-xl text-white/90 mb-10 leading-relaxed">
        We believe in creating more than just products – we craft
        experiences that connect hearts, celebrate relationships, and
        turn ordinary moments into extraordinary memories. Our mission
        is to be your partner in expressing love, appreciation, and
        thoughtfulness.
      </p>
      <Link to="/about">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 px-12 py-4 rounded-full uppercase text-sm tracking-wider font-semibold shadow-xl transition-all"
        >
          Our Journey
        </motion.button>
      </Link>
    </motion.div>
  </div>
</section>

        {/* Reviews Section */}
        <div className="mt-12 max-w-7xl mx-auto p-9">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">Customer Reviews</h2>
          <Carousel
            responsive={reviewResponsive} // Use separate responsive settings for reviews
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={1500} // Faster timing
            keyBoardControl={true}
            customTransition="transform 0.5s ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container w-full" 
            removeArrowOnDeviceType={["tablet", "mobile"]}
            showDots={false} // Hide dots if desired
            arrows={false} // Hide navigation arrows
            // Removed dotListClass since showDots is false
            itemClass="carousel-item px-4" 
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-md w-full"
              >
                <span className="font-semibold text-lg">{review.name}</span>
                <div className="flex items-center mt-3">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={`ml-1 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-gray-700 text-lg">{review.reviewText}</p>
              </div>
            ))}
          </Carousel>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;