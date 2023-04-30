import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { RootState } from '../../store/store'
import { setUser } from '../../store/slices/UserSlice'

import './NavBar.css'

function NavBar():JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state:RootState)=> state.user)

  async function logout() {
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:3001/api/user/logout`, { 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: "include" 
    })
    dispatch(setUser({user: {
      email:'',
    }}))
    navigate('/')
  }
 
  return (
    <nav>
        <div className="nav-organize">
          <div className="nav-logo">
            <Link to="/" >
              <b><div className="extra-black">Editor</div></b>
            </Link>
          </div>
          {user.id ? (
            <>
            <div className="nav-user-section">
                <b onClick={logout} className="secondary-btn">Sign out</b>
            </div>
            <div className='nav-item'>
                <b>@{user.id}</b>
            </div>
            <div className="nav-item">
              <Link
                to="/form"
              >
                <b>Form</b>
              </Link>
            </div>
            <div className="nav-item">
              <Link
                to="/posts"
              >
                <b>Posts</b>
              </Link>
            </div>
            </>
          ) : (
            <div className="nav-user-section">
              <Link to="/signin" >
                <b className="secondary-btn">Sign in</b>
              </Link>
            </div>
          )}
        </div>
      </nav>
  )
}

export default NavBar