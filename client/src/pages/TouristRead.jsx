import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faMedal } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import SideNav from "../components/TouristSideNav"; // Import the Tourist SideNav

const TouristRead = ({ touristService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    email: "",
    username: "",
    mobileNumber: "",
    nationality: "",
    date_of_birth: "",
    occupationStatus: "",
    wallet: 0,
    loyaltyPoints: 0,
  });

  const [redeemPointsInput, setRedeemPointsInput] = useState(10000);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await touristService.getTouristProfileById(loggedInUser._id);
        if (response && response.data) {
          setProfile({
            email: response.data.user?.email || "",
            username: response.data.user?.username || loggedInUser.username,
            mobileNumber: response.data.mobileNumber || "",
            nationality: response.data.nationality || "",
            date_of_birth: response.data.user?.date_of_birth
              ? new Date(response.data.user.date_of_birth).toLocaleDateString()
              : "",
            occupationStatus: response.data.occupationStatus || "",
            wallet: response.data.wallet || 0,
            loyaltyPoints: response.data.loyaltyPoints || 0,
          });
          setIsProfileLoaded(true);
        } else {
          alert("Profile data not available");
        }
      } catch (error) {
        alert("Failed to fetch profile");
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [loggedInUser._id, touristService]);

  const handleEditClick = () => {
    navigate("/TouristUpdate");
  };

  const handleRedeemPoints = async () => {
    const pointsToRedeem = parseInt(redeemPointsInput, 10);
    if (isNaN(pointsToRedeem) || pointsToRedeem < 10000) {
      alert("Please enter a minimum of 10,000 points for redemption.");
      return;
    }

    if (profile.loyaltyPoints < pointsToRedeem) {
      alert("Insufficient points to redeem.");
      return;
    }

    try {
      const response = await touristService.redeemPoints(pointsToRedeem);
      if (response && response.success) {
        alert(`Successfully redeemed ${pointsToRedeem} points!`);
        const updatedProfileResponse = await touristService.getTouristProfileById(loggedInUser._id);
        if (updatedProfileResponse && updatedProfileResponse.data) {
          setProfile({
            ...profile,
            wallet: updatedProfileResponse.data.wallet || 0,
            loyaltyPoints: updatedProfileResponse.data.loyaltyPoints || 0,
          });
        }
        setRedeemPointsInput(10000);
      } else {
        alert(response?.message || "Failed to redeem points.");
      }
    } catch (error) {
      alert("Failed to redeem points.");
      console.error("Redeem points error:", error);
    }
  };

  const getBadge = (points) => {
    if (points <= 100000) {
      return (
        <div className="flex items-center">
          <span className="ml-2">Level 1</span>
          <FontAwesomeIcon icon={faMedal} style={{ color: "bronze", fontSize: "24px" }} />
        </div>
      );
    } else if (points <= 500000) {
      return (
        <div className="flex items-center">
          <span className="ml-2">Level 2</span>
          <FontAwesomeIcon icon={faMedal} style={{ color: "silver", fontSize: "24px" }} />
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <span className="ml-2">Level 3</span>
          <FontAwesomeIcon icon={faMedal} style={{ color: "gold", fontSize: "24px" }} />
        </div>
      );
    }
  };

  const handleAccountDeletion = async () => {
    if (window.confirm("Are you sure you want to request account deletion? This action cannot be undone.")) {
      try {
        await touristService.requestAccountDeletion(loggedInUser.id);
        alert("Your account deletion request has been submitted.");
      } catch (error) {
        console.error("Failed to request account deletion:", error);
        alert("Failed to request account deletion.");
      }
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-3xl font-semibold text-gray-800">Tourist Profile</h4>
            <button onClick={handleEditClick} className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faPen} size="lg" />
            </button>
          </div>

          {/* Profile Details */}
          {isProfileLoaded ? (
            <div className="space-y-6">
              {Object.entries(profile).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-gray-700">{value || "Not provided"}</span>
                </div>
              ))}
              {/* Loyalty Points */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Loyalty Points</span>
                <span className="text-gray-700">{profile.loyaltyPoints}</span>
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    min="10000"
                    max={profile.loyaltyPoints}
                    value={redeemPointsInput}
                    onChange={(e) => setRedeemPointsInput(e.target.value)}
                    className="p-1 border rounded mr-2"
                  />
                  <button
                    onClick={handleRedeemPoints}
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                  >
                    Redeem Points
                  </button>
                </div>
              </div>
              {/* Badge */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Badge</span>
                {getBadge(profile.loyaltyPoints)}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading profile...</p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:max-w-xs">
              <Link to="/ChangePassword">
                <button className="bg-slate-700 text-white border-2 border-slate-700 py-2 px-6 rounded-lg hover:bg-slate-800 transition-all w-full">
                  Change Password
                </button>
              </Link>
            </div>
            <div className="w-full sm:max-w-xs">
              <button
                onClick={handleAccountDeletion}
                className="bg-red-500 text-white border-2 border-red-500 py-2 px-6 rounded-lg hover:bg-red-600 transition-all w-full"
              >
                Request Account Deletion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristRead;
