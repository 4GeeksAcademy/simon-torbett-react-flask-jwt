const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: { 
            apiUrl: "http://127.0.0.1:3001",
            currentUser: null,
			password:"",
			email:"",
			token:null,
        
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
			
		},
		actions: {
			getLogin: async (info = { email: '', password: '' }) => {
				try {
					const { apiUrl } = getStore();
					const response = await fetch(`${apiUrl}/login`, {
						method: 'POST',
						body: JSON.stringify(info),
						headers: {
							'Content-Type': 'application/json'
						}
					});
			
					if (!response.ok) {
						if (response.status === 401) {
							// Manejar caso específico de no autorizado
							// Puedes agregar código aquí para tratar el caso de usuario no autorizado
							console.error('Usuario no autorizado');
						} else {
							throw new Error(`Error en la solicitud: ${response.statusText}`);
						}
					}
			
					try {
						const { access_token } = await response.json();
						if (access_token) {
							setStore({ currentUser: { access_token } });
							sessionStorage.setItem('currentUser', JSON.stringify({ access_token }));
						}
					} catch (error) {
						console.error('Error parsing JSON:', error);
						return { error: 'Error al procesar la respuesta JSON' };
					}
				} catch (error) {
					console.error(error);
					return { error: `Ocurrió un error durante la solicitud de inicio de sesión. Detalles: ${error.message}` };
				}
			},
            getLogout: () => {
                if (sessionStorage.getItem('currentUser')) {
                    sessionStorage.removeItem('currentUser');
                    setStore({ currentUser: null });
                }
            },
            checkSession: () => {
                if (sessionStorage.getItem('currentUser')) {
                    setStore({ currentUser: JSON.parse(sessionStorage.getItem('currentUser')) })
                }
            },
			registerUser: async (email, password) => {
				try {
					const response = await fetch('http://127.0.0.1:3001', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email, password }),
					});
			
					const data = await response.json();
					console.log('Success:', data);
					alert('Usuario Creado');
				} catch (error) {
					console.error('Error:', error);
				}
			},
			getToken:()=>{
				return getStore().token
			},
			borrarToken:()=>{
				setStore({token:null})
			},
			syncTokenFromSessionStore:()=>{
				const token = sessionStorage.getItem("jwt-token")
				console.log("Aplication")
				if(token && token != "" && token!= undefined) setStore({token: token})
			},




			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/login")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;