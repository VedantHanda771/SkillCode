import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";


// eslint-disable-next-line react/prop-types
const Button = ({to, text, onClick, type="button", className = ""}) =>{
     if(to) {
         return (
             <>
                 <Link to = {to} className={`btn ${className}`}>
                     {text}
                     </Link>
             </>
         );
     }
         return (
             <>
                 <button type={type} className={`btn ${className}`} onClick={onClick}>
                     {text}
                 </button>
             </>
         )
}
export default Button;