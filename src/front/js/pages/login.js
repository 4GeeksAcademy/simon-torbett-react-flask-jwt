import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const resp = await actions.getLogin(data);
        console.log(resp);
        if (resp && resp.access_token) {
            Swal.fire({
                title: 'Inicio de Sesión Exitosa',
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: resp && resp.msg ? resp.msg : 'Unexpected error',
                footer: 'Please try again!'
            });
        }
    };
    console.log("This is your token", store.token)
    useEffect(() => {
        if (store.currentUser !== null) {
            navigate('/');
        }
    }, [store.currentUser, navigate]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 col-sm-12 col-12">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                {...register('username', { required: 'Username is required' })}
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                placeholder="Insert username"
                            />
                            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Insert password"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-primary gap-2">Login</button>
                        </div>
                    </form>
                    <p className="mt-3">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};