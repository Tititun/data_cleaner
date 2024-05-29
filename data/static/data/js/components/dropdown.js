/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

export const Dropdown = function ({currentName, nameList, removeDropbar}) {
    const ref = React.useRef(null)

    function closeDropdown () {
        ref.current &&  ref.current.classList.remove('is-active')
        removeDropbar()
    }
    const timer = setTimeout(removeDropbar, 3000);

    return (
        <div ref={ref} className="dropdown is-hoverable is-active">
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{currentName ? currentName : ''}</span>
                <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
                </button>
            </div>
            <div className="dropdown-menu" role="menu" onMouseLeave={closeDropdown} onMouseEnter={() => timer && clearInterval(timer)}>
                <div cclassNamelass="dropdown-content">
                    {
                        nameList.map((name, idx) => {
                            return (
                            <div key={idx} class={`dropdown-item has-background-${name === 'add category' ? 'info-light' : 'white'}`} onClick={closeDropdown}>
                                <p>{name}</p>
                            </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}