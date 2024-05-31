import React from 'react';

export const Groups = function({key, groups}) {
  return (
      <div key={key} className='column is-3'>
        {
          Object.entries(groups).map(([level_1, level_1_data]) => {
              return (
              <div className="columns p-2">  
                <div className="column col-4 is-flex groups-columns">
                  <button className="button is-info ml-1 groups-big-button">{level_1}</button>
                </div>
                <div className="column col-8 is-flex-direction-column">
                  {
                    Object.entries(level_1_data.groups).map(([level_2, level_2_data]) => {
                      return (
                        <div className="columns">
                          <div className="column col-6 groups-columns is-flex is-flex-direction-column">
                            <button className="button groups-big-button is-info">{level_2}</button>
                          </div>

                          <div className="column col-6 groups-columns is-flex is-flex-direction-column">
                            {
                              Object.keys(level_2_data.groups).map(level_3 => {
                                return (
                                  <button className="button groups-big-button is-info">{level_3}</button>
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