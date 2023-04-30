import React, { useEffect } from 'react';
import PostForm from './components/PostForm/PostForm';
import Posts from './components/Posts/Posts'
import { NavBar } from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/UserSlice';
import { HomePage } from './pages/HomePage';
import { RootState } from './store/store';


function App() {
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state: RootState) => state.user.id !== null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/user/info`, { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Ошибка при авторизации');
      })
      .then((result) => {
        dispatch(
          setUser({
            id: result,
          }),
        );
      })
      .catch((error) => {
        console.error('Ошибка при отправке запроса:', error);
        alert('Ошибка при авторизации');
      });
  });

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route index element={<HomePage />} />
        {isAuthorized ? (
         <>
            <Route path="/form" element={<PostForm />} />
            <Route path="/posts" element={<Posts />} />
         </>
        ) : (
          <>
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
          </>
        )}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;