import React, { useContext } from 'react'
import {toast} from "react-hot-toast"
import { useAuthContext } from '../authContext/AuthContext';
import { ThemeContext } from '../ThemeContex';


const useAdminLogin = () => {

    const {setAuthUser, setUser} = useAuthContext();
    const{username,setusername}=useContext(ThemeContext)
   
    const login = async (input) => {
        const isValid = validateInput(input);
        if (!isValid) {
            return;
        }

        try {
            const res = await fetch("https://smartboard-with-smart-attendance-system-2.onrender.com//auth/admin/login", {
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
            localStorage.setItem("user-info", "admin");
            setAuthUser("admin");

            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);

            toast.success("Login successful!");
            console.log(data,"am");

        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        }
    };

    return { login };
}

export default useAdminLogin

 const validateInput = (input) => {
        const { employee_id, password } = input;

        if (!employee_id || !password) {
            toast.error("Please fill in all fields.");
            return false;
        }

        return true;
    }