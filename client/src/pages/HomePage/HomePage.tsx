import React from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState } from '../../store/store'
import styles from './homepage.module.css'



function HomePage(): JSX.Element {

  const user = useSelector((state: RootState) => state.user)

  const navigate = useNavigate()

  function rotate() {
    if (user.id) {
      navigate('/form')
    } else {
      navigate('/signin')
    }
  }

  return (
    <div className={styles.homepage}>
      <div>
        <button className={styles.btn} onClick={rotate}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Нажми
        </button>
      </div>
    </div>
  );
}

export default HomePage

