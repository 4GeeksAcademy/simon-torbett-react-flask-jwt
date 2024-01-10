import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Form } from "../component/form.jsx";

export const SingIn = () => {
	const [tipoFormulario, setTipoFormulario] = useState("singin")
	return (
		<div className="text-center mt-5">
			<h1>Registro</h1>
			<div className="col-8 mx-auto text-start">
				<Form tipo={tipoFormulario}/>
			</div>
		</div>
	);
};