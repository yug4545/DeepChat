// src/socket.js
import { io } from 'socket.io-client';

const socket = io('https://deepchat-backend-qrc9.onrender.com', {
  autoConnect: true,
  withCredentials: true,
});



export default socket;
