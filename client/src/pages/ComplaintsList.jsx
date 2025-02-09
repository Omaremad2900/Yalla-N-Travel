import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ComplaintsCard from "../components/ComplaintsCard"
import touristService from '../services/touristService';
import TouristSideNav from '../components/TouristSideNav';
// import TouristSideNav1 from '../components/TouristSideNav1';
import { ProSidebarProvider } from 'react-pro-sidebar';

const ComplaintsList = ({  }) => {
    const loggedInUser = useSelector((state) => state.user.currentUser);
    const [complaints, setComplaints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [complaintStatus,setComplaintStatus]= useState("");
    const itemsPerPage = 10; // Change this as needed

    useEffect(() => {
        const fetchComplaints = async () => {
          try {
            const response = await touristService.getTouristComplaints(currentPage, itemsPerPage);
            console.log(response);
            if (response.success) {
              console.log(response.data)
              console.log(response.data.complaints)
              setComplaints(response.data.complaints || []);
              console.log(complaints)
              setTotalPages(response.data.pagination.totalPages);
              
            }
          } catch (error) {
            console.error("Failed to fetch complaints", error);
          }
        };
        fetchComplaints();
      }, [touristService, currentPage]);
    
      
    
      const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
          setCurrentPage(page);
        }
      };

     
    return (
        <ProSidebarProvider>
        <div className="flex bg-slate-100 min-h-screen">
        <TouristSideNav/>
        <div className="w-3/4 p-6 ml-auto">
          <h3 className="text-3xl font-semibold text-slate-700 mb-6">My Complaints</h3>

          

          {complaints.length === 0 ? (
            <p className="text-slate-600">No Complaints found</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint, idx) => (
                <ComplaintsCard key={idx} complaint={complaint} loggedInUser={loggedInUser} />
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-600 text-white rounded-l-lg hover:bg-slate-500"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-slate-200 text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-500"
            >
              Next
            </button>
          </div>
        </div>

        </div>
        </ProSidebarProvider>

    );
};
export default ComplaintsList