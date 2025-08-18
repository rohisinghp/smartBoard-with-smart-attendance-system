// import {io} from "socket.io-client"
// export  const  initsocket=async()=>{
//     const option={
//         "froce new connection":true,
//         reconnectionAttempt:"infinity",
//         timeout:1000,
//         transports:["websocket"],
//     }
//     return io("https://smartboard-with-smart-attendance-system-2.onrender.com/",option) 
// }




import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  // Use env variable for flexibility
  return io("https://smartboard-with-smart-attendance-system-2.onrender.com", options);
};
