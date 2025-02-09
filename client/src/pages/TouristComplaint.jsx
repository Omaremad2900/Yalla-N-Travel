import React, { useState } from 'react';
import touristService from '../services/touristService';
import TouristSideNav from '../components/TouristSideNav';

const TouristComplaint = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const complaintData = { title, body };
        console.log('Sending complaint data:', complaintData);
        try {
            const response = await touristService.fileComplaint(complaintData);
            console.log('Response from backend:', response);
            alert('Complaint Filed Successfully!');
            setTitle('');
            setBody('');
        } catch (error) {
            console.error('Error during complaint submission:', error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar */}
            <TouristSideNav />

            {/* Main content */}
            <div className="flex flex-1 flex-col justify-center items-center p-8">
                <h1 className="text-slate-700 text-3xl font-bold mb-4">Your Feedback Matters!</h1>
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 mt-4">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-slate-500">File a Complaint</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="mb-4">
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title"
                                className="border p-3 rounded-lg w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Describe your problem"
                                className="border p-3 rounded-lg w-full"
                                rows="4"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    {message && <p className="text-center mt-4 text-red-500">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default TouristComplaint;
