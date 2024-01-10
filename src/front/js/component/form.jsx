import React from "react"
import { useContext } from "react";
import { Link , use } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Form=(props)=>{
    const {  actions, store } = useContext(Context);
    const { mensaje, obtenerPassword, obtenerEmail, registrar }= actions;
    const { password, email} = store;
    const history = useNavigate();
    const hadleClick=()=>{
        mensaje(email,password)
        history('/home')
    }
    return(
        <div>
        <form>
        <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyUp={obtenerEmail}/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" onKeyUp={obtenerPassword}/>
        </div>
        <div className="mb-3 form-check">
        </div>
       
        </form>
            {
                props.tipo=="singin"?<Link to='/'><button  className="btn btn-primary" onClick={()=>registrar(email,password)}>Submit</button></Link>:
                <button  className="btn btn-primary" onClick={()=>hadleClick()}>Submit</button>
            }
        </div>
    )

}