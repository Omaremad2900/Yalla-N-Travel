import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCompass, FaPlane, FaHotel, FaMapMarkerAlt, FaBus } from 'react-icons/fa';
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Spline from '@splinetool/react-spline';
import Slider from 'react-slick'; // Import the carousel component

// Import the vertical timeline package and styles
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const TouristHome = ({ bookingService }) => {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Function to handle "Book a Flight" button click
  const handleBookFlight = async () => {
    if (!bookingService || !bookingService.checkIfBookingDetailsSaved) {
      console.error('Booking service is not available or improperly configured.');
      return;
    }

    try {
      const response = await bookingService.checkIfBookingDetailsSaved();
      console.log(response);
      if (response.dataExists === true) {
        navigate('/Bookflight');
      } else {
        navigate('/Travelerdetails');
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
    }
  };

  // Function to handle "Book a Hotel" button click
  const handleBookHotel = () => {
    navigate('/Bookhotel');
  };

  // Function to handle scroll event
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Set 'hasScrolled' to true if scrolled past 50vh
    if (scrollY > viewportHeight / 2) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  };

  // Listen for scroll events
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-slate-200 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-90" style={{ backgroundImage: 'url("/images/explore-bg.jpg")' }}>
        <div className="bg-slate-200 text-slate-700 py-16 flex items-center justify-center">
          <h1 className="text-slate-700 text-5xl font-bold">Explore the World with Us!</h1>
        </div>
        {/* Spline Container */}
        <div
          className="spline-wrapper mx-auto"
          style={{
            width: '100%',
            height: '500px',
            overflow: 'hidden',
            marginTop: '-100px',
          }}>
          <Spline
            scene="https://prod.spline.design/9uVkXNqkarzqy-aG/scene.splinecode"
            scrollZoom={false}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* White Section with Vertical Timeline */}
      <section className="bg-white py-16 relative">
        {/* Vertical Divider */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 w-[10px] z-0 transition-all duration-1000 ease-out ${hasScrolled ? 'opacity-100 bg-gradient-to-t from-transparent via-[#334155] to-transparent' : 'opacity-0'}`}
          style={{
            background: hasScrolled
              ? 'linear-gradient(to top, transparent, #334155, transparent)'  // Gradient without any solid white in the middle
              : 'none',
            height: 'calc(100% - 300px)',  // Stops the divider 100px before the section ends
          }}
        ></div>

        {/* Vertical Timeline */}
        <VerticalTimeline>
          {/* Timeline Step for Explore Button */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Ongoing"
            iconStyle={{ background: '#334155', color: '#fff' }}
            icon={<FaCompass />}
          >
            <h3 className="vertical-timeline-element-title">Explore</h3>
            <p>Discover a variety of travel destinations, find the best itineraries, and more!</p>
            <Link
              to="/TouristDashboard"
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 shadow-md text-lg flex items-center justify-center"
            >
              <FaCompass className="mr-3" />
              Explore
            </Link>
          </VerticalTimelineElement>

          {/* Timeline Step for Book a Flight Button */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Step 1"
            iconStyle={{ background: '#334155', color: '#fff' }}
            icon={<FaPlane />}
          >
            <h3 className="vertical-timeline-element-title">Book a Flight</h3>
            <p>Book your flight to your dream destination and start your adventure!</p>
            <button
              onClick={handleBookFlight}
              className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 shadow-md"
            >
              <FaPlane className="mr-3" />
              Book a Flight
            </button>
          </VerticalTimelineElement>

          {/* Timeline Step for Book a Hotel Button */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Step 2"
            iconStyle={{ background: '#334155', color: '#fff' }}
            icon={<FaHotel />}
          >
            <h3 className="vertical-timeline-element-title">Book a Hotel</h3>
            <p>Reserve your accommodation to enjoy a comfortable stay during your trip.</p>
            <button
              onClick={handleBookHotel}
              className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 shadow-md"
            >
              <FaHotel className="mr-3" />
              Book a Hotel
            </button>
          </VerticalTimelineElement>

          {/* Timeline Step for Transportation Button */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Step 3"
            iconStyle={{ background: '#334155', color: '#fff' }}
            icon={<FaBus />}
          >
            <h3 className="vertical-timeline-element-title">Book Transportation</h3>
            <p>Arrange your transport to and from the airport to ensure a smooth journey.</p>
            <Link
              to="/Booktransportation"
              className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 shadow-md"
            >
              <FaBus className="mr-3" />
              Transportation
            </Link>
          </VerticalTimelineElement>

          {/* Timeline Step for Browse Products Button */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Step 4"
            iconStyle={{ background: '#334155', color: '#fff' }}
            icon={<StorefrontOutlinedIcon />}
          >
            <h3 className="vertical-timeline-element-title">Browse Products</h3>
            <p>Check out exclusive travel products to make your trip more enjoyable.</p>
            <Link
              to="/TouristProducts"
              className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 shadow-md"
            >
              <StorefrontOutlinedIcon className="mr-3" />
              Browse Products
            </Link>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </section>

      {/* Footer */}
      <footer className="bg-slate-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Yalla n'Travel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TouristHome;
