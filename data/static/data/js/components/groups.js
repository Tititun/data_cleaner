import React from 'react';

function cleanName(level) {
  return (level && level !== 'NO GROUP') ? level : ''
}

export const Groups = function({groups, appSetFilters, selectedGroup, setSelectedGroup, hidden, brush, setBrush}) {
  
  function clickHandler(level_1, level_2, level_3) {
    if (brush) {
      setBrush([cleanName(level_1), cleanName(level_2), cleanName(level_3)])
      return
    }

    const args = [level_1, level_2, level_3]
    console.log('selected:', JSON.stringify(selectedGroup))
    console.log('args:', JSON.stringify(args))
    if (JSON.stringify(selectedGroup) === JSON.stringify(args)) {
      level_1 = level_2 = level_3 = ''
      setSelectedGroup([])
    } else {
      setSelectedGroup([level_1, level_2, level_3])
    }

    const values = {}
    values['level_1'] = cleanName(level_1)
    values['level_2'] = cleanName(level_2)
    values['level_3'] = cleanName(level_3)
    values['category'] = ''
    appSetFilters({type: 'levels',
                   value: values})
  }

  function pickColors(level_1, level_2, level_3) {
    if (level_1 === selectedGroup[0] && level_2 === selectedGroup[1] && level_3 === selectedGroup[2]) {
      return ['#ff6685', '#ffccd6']
    }
    return  ['#66d1ff', '#ccf0ff']
  }

  const group_size = {}
  for (const [level_1, level_1_data] of Object.entries(groups)) {
    group_size[level_1] = 0;
    for (const [level_2, level_2_data] of Object.entries(level_1_data.groups)) {
        group_size[level_2] = 0;
        for (const level_3 of Object.keys(level_2_data.groups)) {
          group_size[level_1] += 1
          group_size[level_2] += 1
          group_size[level_3] = 1
        }
    }
  }
   
  function calc_gradient(level, count, color_1, color_2) {
    
    const threshold = Math.ceil(100 * count / (group_size[level] * 500))
    return `linear-gradient(to right, ${color_1}  0% ${threshold}%, ${color_2} ${threshold}% 100%)`
  }

  return (
      <div id="groups-container" className={`${hidden ? 'is-hidden' : ''}`}>
        {
          Object.entries(groups).map(([level_1, level_1_data]) => {
              return (
              <div className="columns p-2">  
                
                <div className="column col-4 is-flex groups-columns">
                  <button
                   className={`button ml-1 groups-big-button ${brush ? 'brush-clean' : ''}`}
                   style={{backgroundImage: calc_gradient(level_1, level_1_data.count, ...pickColors(level_1))}}
                   disabled = {level_1 === 'NO GROUP' ? true : false}
                   onClick={event => clickHandler(level_1)}>{level_1}</button>
                </div>

                <div className="column col-8 is-flex-direction-column">
                  {
                    Object.entries(level_1_data.groups).map(([level_2, level_2_data]) => {
                      return (
                        <div className="columns">
                          
                          <div className="column col-6 groups-columns is-flex is-flex-direction-column">
                            <button
                             className={`button groups-big-button ${brush ? 'brush-clean' : ''}`}
                             style={{backgroundImage: calc_gradient(level_2, level_2_data.count, ...pickColors(level_1, level_2))}}
                             disabled = {level_2 === 'NO GROUP' ? true : false}
                             onClick={event => clickHandler(level_1, level_2)}>{level_2}</button>
                          </div>

                          <div className="column col-6 groups-columns is-flex is-flex-direction-column">
                            {
                              Object.entries(level_2_data.groups).map(([level_3, level_3_count]) => {
                                return (
                                  <button
                                   className={`button groups-big-button ${brush ? 'brush-clean' : ''}`}
                                   style={{backgroundImage: calc_gradient(level_3, level_3_count, ...pickColors(level_1, level_2, level_3))}}
                                   disabled = {level_3 === 'NO GROUP' ? true : false}
                                   onClick={event => clickHandler(level_1, level_2, level_3)}>{level_3}</button>
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