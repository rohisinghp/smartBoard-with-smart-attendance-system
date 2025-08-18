import React, { useContext, useEffect, useState } from 'react'
import Logout from '../../Component/Logout'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useUserLogin from '../../Hooks/useUserLogin';
import { ThemeContext } from '../../ThemeContex';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';


const AdminHome = () => {
  const { subject, setsubject, setroomid } = useContext(ThemeContext);
  // const data = [
  //   {
  //     subject: "Data Structures",
  //     date: "18/02/2025",
  //     day: "Wednesday",
  //     participants: "4,7,8,9,12,14,15,16,36,34,37,38,39,48,49,50,56"
  //   },
  //   {
  //     subject: "Data Structures",
  //     date: "17/02/2025",
  //     day: "Monday",
  //     participants: "2,4,6,8,22,24,25,26,31,32,35,37,40,41"
  //   },
  //   {
  //     subject: "Data Structures",
  //     date: "21/02/2025",
  //     day: "Friday",
  //     participants: "1,3,4,5,7,8,14,15,19,21,25,26,27,35,38,39"
  //   }
  // ]

  const [data, setData] = useState();

  const [sortedData, setSortedData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  useEffect(() => {
    async function getClassroomsForAdmin() {
      try {
        console.log(user);
        const admin_id = user.admin_id;
        // console.log("Admin ID:", admin_id);

        const res = await axios.post(
          "http://localhost:5000/classroom/api/getclassroom",
          { admin_id }
        );

        const classrooms = res.data.classrooms;

        const cleaned = classrooms.filter(item => Object.keys(item).length > 0); // remove empty objects
        console.log("Cleaned classrooms:", cleaned,);

        setData(cleaned);

        // --------------------------------------------------------------------------------------------------------------------------


      } catch (e) {
        console.error("Error in fetching classrooms:", e);
        toast("Something went wrong: " + (e.response?.data?.message || e.message));
      }
    }
    getClassroomsForAdmin();
  }, [])

  function dateToNumber(dateStr) {
    if (dateStr == undefined) return 20000101;
    const parts = dateStr.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return parseInt(year + month + day); // e.g., "20250218" as number
  }

  useEffect(() => {
    if (!data || data.length === 0) return;
    const temp = [...data]
    for (let i = 0; i < temp.length - 1; i++) {
      for (let j = 0; j < temp.length - i - 1; j++) {
        if (dateToNumber(temp[j].date) < dateToNumber(temp[j + 1].date)) {
          // Swap
          const x = temp[j];
          temp[j] = temp[j + 1];
          temp[j + 1] = x;
        }
      }
    }
    setSortedData(temp);

  }, [data]);

  //viv changes





  const handleInfo = (item) => {
    console.log(item);
    setCurrentItem(item);
  }
  //
  const navigate = useNavigate()
  const { user } = useUserLogin()
  const [roomId, setRoomId] = useState('')
  const { setusername } = useContext(ThemeContext)
  const handleSubmit = (e) => {
    e.preventDefault()


    if (roomId && user.fullname) {
      setusername('admin')

      navigate(`/editor/${roomId}`)
    }
  }



    ;
  const [searchTerm, setSearchTerm] = useState('');
  function isEqualIgnoreCase(a, b) {
    const charCodeA = a.charCodeAt(0);
    const charCodeB = b.charCodeAt(0);
    const normA = (charCodeA >= 65 && charCodeA <= 90) ? charCodeA + 32 : charCodeA;
    const normB = (charCodeB >= 65 && charCodeB <= 90) ? charCodeB + 32 : charCodeB;
    return normA === normB;
  }

  let manuallyFilteredData = [];
  for (let i = 0; i < sortedData.length; i++) {
    const item = sortedData[i];
    console.log(item);
    const subject = item.subject;
    const date = item.date;
    const term = searchTerm;
    let matchFound = false;
    for (let j = 0; j <= subject.length - term.length; j++) {
      let k = 0;
      while (k < term.length && isEqualIgnoreCase(subject[j + k], term[k])) {
        k++;
      }
      if (k === term.length) {
        matchFound = true;
        break;
      }
    }
    if (date != undefined)
      for (let j = 0; j <= date.length - term.length; j++) {
        let k = 0;
        while (k < term.length && isEqualIgnoreCase(date[j + k], term[k])) {
          k++;
        }
        if (k === term.length) {
          matchFound = true;
          break;
        }
      }

    if (matchFound || term === '') {
      manuallyFilteredData.push(item);
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#000000',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Logout />
      <Box sx={{
        display: 'flex',
        flex: 1,
        p: 3,
        gap: 3,
        height: '100vh'
              }}>
        {/* Past Meetings Section */}
        <Paper
          elevation={3}
          sx={{
            width: '25%',
            height: '100vh',
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#000000',
              textAlign: 'center',
              pb: 2,
              borderBottom: '2px solid #000000'
            }}
          >
            Past Meetings
          </Typography>


          <TextField
            fullWidth
            placeholder="Search by subject or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#000000', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&:hover fieldset': {
                  borderColor: '#000000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000000',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#000000',
              },
            }}
          />

          <List sx={{ overflow: 'auto', flex: 1 }}>
            {manuallyFilteredData.length > 0 ? (
              manuallyFilteredData.map((item, index) => (

                <ListItem
                  key={index}
                  sx={{
                    mb: 2,
                    border: '2px solid #000000',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  {console.log("ITem is : " + item.date)}
                  <Button
                    fullWidth
                    onClick={() => handleInfo(item)}
                    sx={{
                      textAlign: 'left',
                      p: 2,
                      color: '#000000',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          textDecoration: 'underline',
                          textDecorationThickness: '2px',
                          mb: 1
                        }}
                      >
                        {item.subject}
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#000000'
                      }}>
                        <Typography variant="body1">{item.date}</Typography>
                        <Typography variant="body1">{item.day}</Typography>
                      </Box>
                    </Box>
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography
                sx={{
                  textAlign: 'center',
                  color: '#666666',
                  mt: 4
                }}
              >
                No meetings found
              </Typography>
            )}
          </List>
        </Paper>

        {/* Main Content Section */}
        <Box sx={{
          width: '75%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Meeting Details */}
          {currentItem && (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 2,
                maxWidth: '800px',
                mx: 'auto',
                width: '100%'
              }}
            >
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 3
              }}>
                <Typography variant="h6" sx={{ color: '#000000' }}>
                  <strong>Date:</strong> {currentItem.date}
                </Typography>
                <Typography variant="h6" sx={{ color: '#000000' }}>
                  <strong>Day:</strong> {currentItem.day}
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#000000',
                  mb: 4,
                  textDecoration: 'underline',
                  textDecorationThickness: '3px'
                }}
              >
                {currentItem.subject}
              </Typography>

              <Typography variant="h6" sx={{ color: '#000000', ml: 4 }}>
                <strong>Presentees (Class Roll No):</strong>
                {currentItem.participants.map((p) => p.class_rollno).join(", ")}
              </Typography>

            </Paper>
          )}

          {/* Create Room Section */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              maxWidth: '800px',
              mx: 'auto',
              width: '100%',
              mt: 'auto',
              mb: 4
            }}
          >
            {/* viv change */}
            <form action="" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Enter room ID"
                sx={{
                  mt: 0.2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#F9FAFB',
                    fontSize: { xs: 13, sm: 15 }
                  }
                }}
              />

              <TextField
                fullWidth
                value={subject}
                onChange={(e) => setsubject(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Enter Subject"
                sx={{
                  mt: 0.2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#F9FAFB',
                    fontSize: { xs: 13, sm: 15 }
                  }
                }}
              />


              {/* viv change */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#000000',
                    textAlign: 'center'
                  }}
                >
                  Want to create a Room? Click button below
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#000000',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#333333',
                    }
                  }}
                  type='submi'
                >
                  Create a room
                </Button>

              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminHome
