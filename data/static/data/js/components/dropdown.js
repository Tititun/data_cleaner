/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

export const Dropdown = function ({currentName, nameList, removeDropbar, level}) {
    console.log('rendering dropdown')
    const ref = React.useRef(null)
    const [filter, setFilter] = React.useState('')

    function closeDropdown (value) {
        ref.current &&  ref.current.classList.remove('is-active')
        removeDropbar(value, level)
    }

    return (
        <div ref={ref} className="dropdown is-hoverable is-active" onMouseLeave={() => closeDropdown(currentName)}>
            <input autoFocus className="input" type="text" onChange={e => setFilter(e.target.value)} onKeyUp={ e => {
                                                                                            if (e.key === 'Enter') { closeDropdown(e.target.value) }
                                                                                        }}> 
                
            </input>
            <div className="dropdown-menu" role="menu" >
                <div cclassNamelass="dropdown-content">
                    {
                        nameList.filter(name => name.search(filter) !== -1).map((name, idx) => {
                            return (
                            <div key={idx}
                             class={`dropdown-item has-background-${name === 'add category' ? 'info-light' : 'white'}`}
                             onClick={() => closeDropdown(name)}>
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