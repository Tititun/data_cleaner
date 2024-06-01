/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

export const Dropdown = function ({currentName, nameList, fullNameList, removeDropbar, level}) {
    const ref = React.useRef(null)
    const [filter, setFilter] = React.useState('')

    function closeDropdown (value) {
        ref.current &&  ref.current.classList.remove('is-active')
        removeDropbar(value, level)
    }

    function filterArray(array) {
        return array.filter(name => name.search(filter) !== -1).map((name, idx) => {
            return (
            <div key={idx}
             class={`dropdown-item has-background-${name === 'add category' ? 'info-light' : 'white'}`}
             onClick={() => closeDropdown(name)}>
                <p>{name}</p>
            </div>
            )
        })
    }

    let rows = filterArray(nameList)

    if (!(rows.length)) {
        rows = filterArray(fullNameList)
    }

    return (
        <div ref={ref} className="dropdown is-hoverable is-active" onMouseLeave={() => closeDropdown(currentName)}>
            <input autoFocus className="input" type="text" onChange={e => setFilter(e.target.value)} onKeyUp={ e => {
                                                                                            if (e.key === 'Enter') { closeDropdown(e.target.value) }
                                                                                        }}> 
                
            </input>
            <div className="dropdown-menu" role="menu" >
                <div cclassNamelass="dropdown-content">
                    {rows}
                </div>
            </div>
        </div>
    )
}