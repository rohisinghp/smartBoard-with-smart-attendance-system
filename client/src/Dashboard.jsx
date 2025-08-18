import { Box, Button } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ReactSketchCanvas } from "react-sketch-canvas";

import Drawer1 from './Component/Dashboardcomponent/Drawer1';
import Tools from './Component/Dashboardcomponent/Tools';
import { ThemeContext } from './ThemeContex';
import { initsocket } from './socket';
import Attendance from './Component/form/Attendance';
import { ToastContainer, toast } from 'react-toastify';
import Request from './Component/Request/Requset';
import { Atd_popUp } from './Component/Atd_pop_up/Atd_popUp';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const socketref=useRef(null);
  const canvasRef = useRef(null);
  const[access,setacess]=useState(false);
  
       const navigate = useNavigate();
   console.log("dashboard value",access)

    const[message,setmessage]=useState('');
    const{pen,penColor,username,setatd,atd,mark,setmark,roomid,student,setstudent}=useContext(ThemeContext);
    const boxstyle={
        display:"flex",
        justifyContent:"space-evenly",
        alignItems:"center",
        gap:"10px"
        // border:"2px solid red",
       
        
    }
 
    console.log(username)
    const handleChange = async () => {
    
      if (!canvasRef.current || !socketref.current||(username!='admin'&&!access)) return;
      console.log("change")
      const paths = await canvasRef.current.exportPaths();
      socketref.current.emit('drawing', {
        roomid: roomid,
        data: paths,
      });
    
      console.log("Stroke finished and sent");
    };
    
    
//change mark
 
const changeMark=(number)=>{


  let index=Number(number)
  console.log(mark,",",index,"k");
  let updatemark=JSON.parse(localStorage.getItem('mark'));
  console.log("updated",updatemark);


  // Handle null case
  if (!updatemark) {
    updatemark = Array(100).fill(0);
     localStorage.setItem('mark', JSON.stringify(updatemark));
     // or [] if you're expecting an array
     console.log(updatemark,"setup")
  }

  // Initialize if undefined
  if (updatemark[index] === undefined) {
    updatemark[index] = 0;
  }


  updatemark[index]+=1;
  localStorage.setItem('mark', JSON.stringify(updatemark));
  console.log(updatemark[index],"yha hua change");

  setmark(updatemark);
  console.log(mark)
  console.log(updatemark)

}
   //leave


    useEffect(()=>{
      const init=async()=>{
        socketref.current=await initsocket();
        socketref.current.emit('join',{
          id:roomid,
          userename:username
        })
        socketref.current.emit('join', { roomid: roomid ,username:username});
        socketref.current.on("r-drawing",(data)=>{
        // console.log("data",data);
        // console.log("data2",canvasRef.current);
        console.log("r-draw")
        console.log(roomid)
          if(canvasRef.current){
            canvasRef.current.loadPaths(data);
           
          }
        })
        //on join of student
         socketref.current.on('student', ({ id, username }) => {
  if (!id || !username) return;

  console.log(id, username, "student");

  setstudent(prev => {
    // Check for duplicates
    const alreadyExists = prev.some(student => student.id === id && student.username === username);
    if (alreadyExists) return prev;

    const updated = [...prev, { id, username }];
    
    // Save to localStorage

    return updated;
  });
});

//disconnect of socket
socketref.current.on('disconnect-del',({username,id})=>{
    if (!id) return;

  setstudent(prev =>
    prev.filter((i) => i.id && i.id !== id)
  );
  console.log("after disconnect",student);
})





        //attendance message
        socketref.current.on('r-attendance',({message})=>{
          console.log("socket username",username)
          if(username!="admin"&& username!=undefined){
            console.log("socket username2",username)
            toast(
              <Attendance socketref={socketref}></Attendance>
            )
          }
        })
       



        //recv  req
        socketref.current.on('r-sendreq',({message,socketid})=>{
          console.log('bhai  ka nam',message)
          setatd(prv=>[...prv,{name:message,socketid:socketid}]);

          toast(
 username=='admin'&& <Request name={'studnet'} socketid={socketid} socketref={socketref} />,
  {
    position: "bottom-left",
    autoClose: 5000,       // 5 seconds = 5000 ms
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }
); 


        })



          // take access
        socketref.current.on("access-g",({value})=>{
          console.log(value,"hello");
          setacess(value);
        })



        //recv mark
        socketref.current.on('r-mark', ({ rollnumber }) => {
          
          console.log("socket roll", rollnumber);
          changeMark(rollnumber);
        });
        //del student from local storage
       
     
      }
      init();

      return () => {
        if (socketref.current) {
          socketref.current.emit('leave', { roomid: roomid });
          // socketref.current.disconnect(); // optional
        }
      };
    },[])
    const notify=()=>{
      toast(
        <Attendance ></Attendance>
      )
    }
    const sendMessage=(e)=>{
      e.preventDefault();
      if(socketref.current && username=='admin'){
        socketref.current.emit('send-attendance',{
          message:"attendance is sended",
          roomid:roomid
        })
      }
    }
   const sendRequest=(e)=>{
    if(socketref.current){
      console.log("socketid",socketref.current.id)
      socketref.current.emit('sendreq',{message:username
        ,roomid:roomid,
      socketid:socketref.current.id})
    }
  }
  

   //leave
   const leave=()=>{
    if(username=='admin'){
      console.log("leave ho gya",mark);
      let mark1= JSON.parse(localStorage.getItem('mark')) || [];
      console.log(mark1,"mk")
      if (!Array.isArray(mark1)) {
      console.warn("mark1 is not an array, defaulting to []");
      mark1 = [];
    }
      let message="";
      {mark1.map((i,key)=>{
       i>=2?message+=`${key},`:"";
      })


      }
   
      
      toast(<Atd_popUp message={message||'None'} socketref={socketref}></Atd_popUp>, {
      position: 'top-right',
      autoClose: false, 
      closeOnClick: false,
      draggable: false,
      closeButton: true,
    })
     
      
    }
  else {
   
const updatearray=student.filter((i)=>{i.name!=username});
setstudent(updatearray);
 socketref.current.emit('leave',{roomid})
 
localStorage.removeItem('username')
navigate('/');
}
  
   }
         useEffect(() => {
           console.log("Updated atd:", message);
         }, [message]);
  
console.log(student)

  return (
    
    <Box width={"100%"} 
    height={"100vh"}
    border={"2px solid red"}
    >
         <ReactSketchCanvas
  ref={canvasRef}
  width="100%"
  height="80%"
  strokeWidth={pen}
  strokeColor={penColor}
  canvasColor="#D9D9D9"
  withTimestamp={true}
  onStroke={(username === "admin" || access === true) ? handleChange : undefined}
  allowOnlyPointerType={username === 'admin' ? 'all' : undefined}
  style={{
    pointerEvents: (username === "admin" || access === true) ? 'auto' : 'none',
    opacity: (username === "admin" || access === true) ? 1 : 0.5,
    border: '2px solid #ccc',
    borderRadius: '8px'
  }}
/>
{
  student.map((i)=>{
    console.log(i.id,i.username);
  })
}


      <Box style={boxstyle} width={"100%"} mt="30px" height={"20%"}>
       
       {/* <Attendance></Attendance> */}
       <ToastContainer
  position="bottom-right"
  autoClose={6000}
  hideProgressBar={false}
  newestOnTop={true}
  closeButton={false}
  pauseOnHover={true}
  draggable={true}
/>
       



       
       { username=="admin"&&<Drawer1 socketref={socketref}></Drawer1>}
        {/* box for icon button */}
          {/* <Box style={boxstyle} width={"30%"}>
          <CreateIcon></CreateIcon>
          <ColorLensIcon></ColorLensIcon>
          <ImagesearchRollerIcon></ImagesearchRollerIcon>

              
          </Box >  */}
       {username=="admin"&&<Tools></Tools>} 
      {/* box for button */}
      <Box sx={boxstyle} width={"50%"}>


   {  
  //  username=="admin"&& <Button variant='contained' sx={{background:"#4761DF",
  //       color:"white",
        
  //       fontSize:"0.9rem"
        
  //      }}>go_to code_collab</Button>
      }
       

  {username=="admin"?<Button variant='contained' sx={{background:"#1A8899",
        color:"white",
      
          fontSize:"0.9rem"
        
       }} onClick={sendMessage}
       
    
       >Send_Attendance</Button>:
       <Button 
       variant='contained'
       onClick={sendRequest}
        sx={{background:"#1A8899",
        color:"white",
        fontFamily:"Roboto",
          fontSize:"0.9rem"
        
       }}
      
       
       >Send_Request</Button>
      }


      
       <Button variant='contained' sx={{background:"#ed4f41",
        color:"white",
       
          fontSize:"0.9rem"
        
       }}
       onClick={leave}
      
       
       >Leave_Room</Button>
      </Box>


      </Box>

    </Box>
  )
}
