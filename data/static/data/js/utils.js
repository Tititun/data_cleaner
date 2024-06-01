/* eslint-disable default-case */
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
    }
}