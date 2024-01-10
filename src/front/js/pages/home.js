import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const { protegido } = store
	useEffect(()=>actions.protegido,[])
	
	if (store.token!==null){
	return (
		<div className="text-center mt-5">
			<h1>PRIVATE!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<h1>El usuairio es {protegido.username}</h1>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>
		</div>
	);}
	else{
		return <h1>No estas Autorizado</h1>
	}
};
