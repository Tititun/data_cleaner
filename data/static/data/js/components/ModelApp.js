/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';


export const ModelApp = function() {
    const navigate = useNavigate();
    return (
      <div className="content mt-0 mx-3 mb-3">
        <div className='columns'>

          <div id='left-main-column' className='column is-9'>
            <nav className="navbar" role="navigation" aria-label="main navigation">
              <div className="navbar-menu is-justify-content-center">
                <a role='button' className='navbar-item' onClick={() => navigate('/')}>
                  To data cleaner
                </a>
              </div>
            </nav>   
          </div>
      
          <div id="right-main-column" className='column is-3 pt-5'>
            Right column content
          </div>  
        </div>
      </div>
  )
}