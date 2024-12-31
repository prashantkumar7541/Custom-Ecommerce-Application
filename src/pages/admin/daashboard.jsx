import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Dashboard from '../../components/admin/dashboard';
import Sidebar from '../../components/admin/sidebar';

const DashboardPage = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Mera Bestie</title>
                <meta name="description" content="Admin dashboard for managing products, orders and customers" />
            </Helmet>
            <div className="flex">
                <Sidebar />
                <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'} lg:ml-64`}>
                    <div className="p-4">
                        <Dashboard />
                    </div>
                </div>
            </div>
            <style>
                {`
                    @media (max-width: 1024px) {
                        .sidebar-logo {
                            display: none; /* Hide the logo name on mobile */
                        }
                    }
                `}
            </style>
        </>
    );
};

export default DashboardPage;
