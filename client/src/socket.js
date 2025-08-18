import {io} from "socket.io-client"
export  const  initsocket=async()=>{
    const option={
        "froce new connection":true,
        reconnectionAttempt:"infinity",
        timeout:1000,
        transports:["websocket"],
    }
    return io("https://smartboard-with-smart-attendance-system-2.onrender.com/",option) 
}