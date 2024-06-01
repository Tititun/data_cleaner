/* eslint-disable default-case */
import { headers } from "./constants"

export const searchReducer = function(state, action) {
    switch (action.type) {
      case 'source':
        return {...state, source: action.value }
      case 'category':
        return {...state, category: action.value }
      case 'name':
        return {...state, name: action.value }
      case 'level_1':
        return {...state, level_1: action.value }
      case 'level_2':
        return {...state, level_2: action.value }
      case 'level_3':
        return {...state, level_3: action.value }
      case 'levels':
        return {...state, ...action.value}  
      case 'categories_list':
        return {...state, ...action.value}  
      case 'clear':
        const new_state = {};
        for (const key of Object.keys(state)) {
          new_state[key] = ''
        }
        return new_state   
    }
}

export function fetchAndSet(url, setter) {
  fetch(url, {
    method: "GET",
    headers: headers
  })
  .then(r => r.json())
  .then(data => {
    setter(data);
  })
  .catch(err => console.log(err))
}