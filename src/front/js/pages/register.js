import React, {useContext, useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';

export const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const resp = await actions.registerUser(data);
        if (resp && resp.success) {
            Swal.fire({
                title: 'Registration Successful',
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
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

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 col-sm-12 col-12">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                {...register('email', { required: 'Email is required' })}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="Insert email"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
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
                            <Link to= '/login' className="btn btn-primary gap-2">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};