import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaMapSigns, FaUserEdit, FaChartBar, FaDollarSign } from 'react-icons/fa';
import ViewListIcon from "@mui/icons-material/ViewList";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Slider from "react-slick";  // For the testimonial slider
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const Tourguidehomepage = () => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const isCompleted = loggedInUser?.isCompleted;

  const testimonials = [
    { name: "John Doe", feedback: "Amazing experience! I learned so much during the tour." },
    { name: "Jane Smith", feedback: "Highly recommend! The tour was well organized and fun." },
    { name: "Mark Johnson", feedback: "A perfect guide with detailed knowledge of the area." },
  ];

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-120" style={{ backgroundImage: 'url("/images/explore-bg.jpg")' }}>
        <div className="bg-slate-200 text-slate-700 py-12 flex items-center justify-center">
          <h1 className="text-slate-700 text-5xl font-bold">Tour Guide Dashboard</h1>
        </div>
      </div>

      {/* Button Section for Navigation */}
      <section className="py-6 bg-slate-100 flex-1 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-700">Manage Your Tours</h2>
            <p className="text-slate-500">Use the options below to create itineraries or view your recent activities.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/CreateItinerary"
              className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600"
            >
              <FaMapSigns className="w-5 h-5 mr-2" />
              <span>Create Itinerary</span>
            </Link>

            <Link
              to="/view-itineraries"
              className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600"
            >
              <ViewListIcon className="w-5 h-5 mr-2" />
              <span>View/Edit Itineraries</span>
            </Link>

            {/* View Revenue Button */}
            <Link
              to="/Tourguiderevenue"
              className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600"
            >
              <FaDollarSign className="w-5 h-5 mr-2" />
              <span>View Revenue</span>
            </Link>

            <Link to="/TourguideViewTouristStatistics" className="flex items-center justify-center bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600">
              <FaChartBar className="w-5 h-5 mr-2" />
              <span>View Tourist Statistics</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Section with GIF and Testimonials */}
      <section className="py-12 bg-slate-50">
  <div className="max-w-6xl mx-auto px-4 text-center">
    {/* Plane GIF */}
    <div className="mb-8">
      <img 
        src="https://ugokawaii.com/wp-content/uploads/2023/04/plane.gif" 
        alt="Plane GIF" 
        className="w-1/4 h-auto mx-auto" // Set to a smaller width
      />
    </div>

    {/* Testimonial Slider */}
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-slate-700 mb-4">What Tourists Are Saying</h3>
      <Slider autoplay={true} autoplaySpeed={3000} dots={true}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-slate-600">"{testimonial.feedback}"</p>
            <h4 className="text-slate-700 font-semibold mt-4">{testimonial.name}</h4>
          </div>
        ))}
      </Slider>
    </div>
  </div>
</section>



      {/* Footer */}
      <footer className="bg-slate-700 text-white py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Yalla n'Travel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Tourguidehomepage;
