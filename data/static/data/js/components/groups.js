import React from 'react';

export const Groups = function({groups, appSetFilters, hidden}) {
  const [selected, setSelected] = React.useState([])

  function clickHandler(level_1, level_2, level_3) {
    const args = [level_1, level_2, level_3]

    if (JSON.stringify(selected) === JSON.stringify(args)) {
      level_1 = level_2 = level_3 = ''
      setSelected([])
    } else {
      setSelected([level_1, level_2, level_3])
    }

    const values = {}
    values['level_1'] = (level_1 && level_1 !== 'NO GROUP') ? level_1 : ''
    values['level_2'] = (level_2 && level_2 !== 'NO GROUP') ? level_2 : ''
    values['level_3'] = (level_3 && level_3 !== 'NO GROUP') ? level_3 : ''
    appSetFilters({type: 'levels',
                   value: values})
  }

  function pickClass(level_1, level_2, level_3) {
    if (level_1 === selected[0] && level_2 === selected[1] && level_3 === selected[2]) {
      return 'is-danger'
    }
    return 'is-info'
  }

  return (
      <div className={hidden ? 'is-hidden' : ''}>
        {
          Object.entries(groups).map(([level_1, level_1_data]) => {
              return (
              <div className="columns p-2">  
                
                <div className="column col-4 is-flex groups-columns">
                  <button
                   className={"button ml-1 groups-big-button " + pickClass(level_1)}
                   disabled = {level_1 === 'NO GROUP' ? true : false}
                   onClick={() => clickHandler(level_1)}>{level_1}</button>
                </div>

                <div className="column col-8 is-flex-direction-column">
                  {
                    Object.entries(level_1_data.groups).map(([level_2, level_2_data]) => {
                      return (
                        <div className="columns">
                          
                          <div className="column col-6 groups-columns is-flex is-flex-direction-column">
                            <button
                             className={"button groups-big-button " + pickClass(level_1, level_2)}
                             disabled = {level_2 === 'NO GROUP' ? true : false}
                             onClick={() => clickHandler(level_1, level_2)}>{level_2}</button>
                          </div>

                          <div className="column col-6 groups-columns is-flex is-flex-direction-column">
                            {
                              Object.keys(level_2_data.groups).map(level_3 => {
                                return (
                                  <button
                                   className={"button groups-big-button " + pickClass(level_1, level_2, level_3)}
                                   disabled = {level_3 === 'NO GROUP' ? true : false}
                                   onClick={() => clickHandler(level_1, level_2, level_3)}>{level_3}</button>
                                )
                              })
                            }
                          </div>  

                        </div>
                      )
                    })
                  }
                </div>
               </div> 
            )
          })
        }        
      </div>
  )
}