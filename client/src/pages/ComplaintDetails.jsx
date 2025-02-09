import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminService from '../services/adminService';
import SideNav from '../components/adminSidenav';

const ComplaintDetails = () => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [status, setStatus] = useState(""); // State to hold current status
  const [originalStatus, setOriginalStatus] = useState(""); // State to hold the original status
  const [statusError, setStatusError] = useState(""); // Error for invalid status update

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await AdminService.getComplaintDetails(complaintId);
        setComplaint(response);
        setStatus(response.status); // Set the initial status for update
        setOriginalStatus(response.status); // Store the original status
      } catch (error) {
        console.error('Error fetching complaint details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [complaintId]);

  const handleReply = async () => {
    if (!replyText) {
      setReplyError("Reply cannot be empty.");
      return;
    }

    try {
      await AdminService.replyToComplaint(complaintId, replyText);
      setReplyText("");
      setReplying(false);
      setReplyError("");
      const updatedComplaint = await AdminService.getComplaintDetails(complaintId);
      setComplaint(updatedComplaint); 
      alert("Reply sent successfully");
    } catch (error) {
      alert("Can't reply to complaint");
      console.error('Error replying to complaint:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!newStatus) {
      setStatusError("Please select a valid status.");
      return;
    }

    try {
      await AdminService.updateComplaintStatus(complaintId, newStatus);
      setStatus(newStatus); // Update the status after success
      setOriginalStatus(newStatus); // Update the original status after change
      setStatusError("");
      alert("Status updated successfully");
    } catch (error) {
      setStatusError("Error updating status");
      console.error("Error updating complaint status:", error);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!complaint) return <p className="text-center mt-8 text-gray-700">No complaint details found.</p>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SideNav />
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-slate-700 mb-6">{complaint.title}</h2>
          <div className="mt-4 text-gray-800">
            <h3 className="text-lg font-semibold">Complaint Details :</h3>
            <div className="mt-4 text-gray-600">
              <strong>Complaint Body:</strong>
                <p className="mt-2">{complaint.body}</p>
            </div>
            <div className="mt-4 text-gray-600">
              <strong>Date Filed:</strong>
              <p className="mt-2">{new Date(complaint.date).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 text-gray-600">
              <strong>Status:</strong>
              <p className="mt-2">{originalStatus}</p> {/* Show original status */}
            </div>

            <div className="mt-4">
              <select
                className="px-4 py-2 border rounded-lg"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
              <button
                className="ml-4 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleStatusChange(status)}
              >
                Update Status
              </button>
            </div>
            {statusError && <p className="text-red-500 mt-2">{statusError}</p>}
          </div>

          <div className="mt-8 text-center">
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
              onClick={() => setReplying(!replying)}
            >
              {replying ? "Cancel Reply" : "Reply to Complaint"}
            </button>
          </div>

          {replying && (
            <div className="mt-6">
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                rows="5"
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              {replyError && <p className="text-red-500 mt-1">{replyError}</p>}
              <div className="flex justify-end mt-4">
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  onClick={handleReply}
                >
                  Send Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
