import React, { useContext , useEffect, useState} from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Form } from "../component/form.jsx";

export const LogIn = () => {
	const [tipoFormulario, setTipoFormulario] = useState("login")
	useEffect(()=>localStorage.setItem("jwt-token",""),[])
	return (
		<div className="text-center mt-5">
			<h1>Login</h1>
			<div className="col-8 mx-auto text-start">
				<Form tipo={tipoFormulario}/>
			</div>
		</div>
	);
};
