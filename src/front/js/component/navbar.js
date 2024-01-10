import { func } from "prop-types";
import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const {  actions, store, setStore } = useContext(Context);
	const {borrarToken} = actions
	// const {protegido} = actions
	function borrarStorage(){
		sessionStorage.removeItem("jwt-token")
		borrarToken();

	}
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/singin">
					<span className="navbar-brand mb-0 h1">REGISTRO</span>
				</Link>
				<div className="ml-auto">
					{store.token==null?
					<Link to="/"><button className="btn btn-primary">Login</button></Link>:
					<Link to="/"><button className="btn btn-primary" onClick={borrarStorage}>LogOut</button></Link>
				}	
				</div>
			</div>
		</nav>
	);
};
