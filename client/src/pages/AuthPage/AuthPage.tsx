import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './authpage.module.css';
import { setUser } from '../../store/slices/UserSlice';

interface FormValues {
  email: string;
  password: string;
}

function AuthPage(): JSX.Element {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const route = location.pathname.includes('signup') ? '/api/user/signup' : '/api/user/signin';

    fetch(`http://localhost:3001${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Ошибка при авторизации');
      })
      .then((result) => {  
        localStorage.setItem('token', result.accessToken);
        dispatch(
          setUser({
            id: result.user,
          })
        );
        navigate('/');
      })
      .catch((error) => {
        console.error('Ошибка при отправке запроса:', error);
        alert('Ошибка при авторизации');
      });
  };

  return (
    <div className={styles.container_login}>
      <div className={styles.card}>
        <h2 className={styles.login}>{location.pathname.includes('signin') ? 'Sign in' : 'Sign up'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.authform}>
          <div className={styles.inputBox}>
            <input type="email" {...register('email', { required: true })} required />
            <span>Email</span>
          </div>
          {errors.email?.type === 'required' && (
            <span className={styles.error}>Email is required</span>
          )}
          <div className={styles.inputBox}>
            <input
              type="password"
              {...register('password', { required: true, minLength: 8 })}
              required
            />
            <span>Password</span>
          </div>
          {errors.password?.type === 'required' && (
            <span className={styles.error}>Password is required</span>
          )}
          {errors.password?.type === 'minLength' && (
            <span className={styles.error}>Password must be at least 8 characters</span>
          )}
          <button className={styles.enter} type="submit">
            Enter
          </button>
        </form>
        <div className={styles.signup}>
          {location.pathname.includes('signin') ?
          <>
          <p>No account? </p>
          <a href="/signup">Sign Up</a>
          </>
          : 
          <>
          <p>Already have account? </p>
          <a href="/signin">Sign In</a>
          </>
}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

