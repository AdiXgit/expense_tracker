import React ,{useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Textfield,Button,Typography} from '@mui/material';

const Register = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await axios.post("https://localhost:5000/api/auth/register",{name,email,password})
            navigate("/login");
        } catch(err){
            alert("Failed to register");    
        }
    };

    return(
        <div style = {{maxWidth:400,margin:"50px auto"}}>
            <Typography variant = "h4" gutterBottom>Register</Typography>
            <form onSubmit = {handleSubmit}>
                <Textfield
                    label = "name"
                    fullWidth
                    margin = "normal"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
            />
            <Textfield
                label = "Email"
                fullWidth
                margin = "normal"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
            />
            <Textfield
                label = "Password"
                type = "password"
                fullWidth
                margin = "normal"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            />
            <Button type = "submit" variant = "contained" color = "primary" fullWidth>
                Register
            </Button>
            </form>
        </div>
    );
};

export default Register;

