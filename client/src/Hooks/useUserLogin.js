import React, { useContext } from 'react'
import { toast } from "react-hot-toast";
import { useAuthContext } from "../authContext/AuthContext.jsx";
import { ThemeContext } from '../ThemeContex.jsx';


const useUserLogin = () => {
    const { user,setAuthUser , setUser} = useAuthContext();
    const {username,setusername}=useContext(ThemeContext);
    const login = async (input) => {
        const isValid = validateInput(input);
        if (!isValid) {
            return;
        }

        try {
            const res = await fetch("https://smartboard-with-smart-attendance-system-2.onrender.com/auth/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
           
                toast.error(data.error || "Login failed. Please try again.");
                return;
            }

            // Store user and update context
            localStorage.setItem("user-info", "user");
            setAuthUser("user");

           localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            console.log(user)
            setusername(data.fullname);
                console.log('before login',username)
            toast.success("Login successful!");
            console.log(data);

        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        }
    };
    // let value = localStorage.getItem('user');
    // setUser(value);
console.log('user',user)
    return { login,user };
}

export default useUserLogin


const validateInput = (input) => {
    const { university_rollno, password } = input;

    if (!university_rollno || !password) {
        toast.error("Please fill in all fields.");
        return false;
    }

    return true;
}