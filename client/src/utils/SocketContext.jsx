import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]); // Track notifications
  const currentUser = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    console.log('Initializing socket connection...');
    const socketInstance = io("http://192.168.49.2:30081");
    setSocket(socketInstance);

    if (currentUser?._id) {
      console.log('Joining room with userId:', currentUser._id);
      socketInstance.emit("joinRoom", currentUser._id); // Join room with userId
    } else {
      console.log('currentUser or currentUser._id is not defined');
    }

    socketInstance.on('notification', (notification) => {
      console.log('Notification arrived', notification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    return () => {
      console.log('Disconnecting socket...');
      socketInstance.disconnect();
    };
  }, [currentUser]);

  const joinRoom = (userId) => {
    if (socket) {
      socket.emit("joinRoom", userId); // Join the room using the userId
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinRoom, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
