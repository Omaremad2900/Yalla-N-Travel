import React, { useEffect, useContext } from "react";
import { SocketContext } from "./SocketContext";

const JoinRoom = ({ userId }) => {
  const { socket, joinRoom, notifications, setNotifications } = useContext(SocketContext);

  useEffect(() => {
    if (userId) {
      joinRoom(userId); // Join the room using the userId
    }

    // Cleanup socket on unmount
    return () => {
      if (socket) {
        socket.off("notification"); // Remove listeners when component unmounts
      }
    };
  }, [userId, joinRoom, socket]);

  // Handle incoming notifications if any
  useEffect(() => {
    if (socket) {
      socket.on("notification", (notification) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      });
    }
  }, [socket, setNotifications]);

  return null; // This component doesn't render anything itself
};

export default JoinRoom;
