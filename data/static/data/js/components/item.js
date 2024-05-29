/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Dropdown } from './dropdown';

export default React.memo(function ({item, levels}) {
  console.log('rendering item')
  const [dropbar, setDropbar] = React.useState({})

  const level_1 = item['level_1'] || item['level_1_inferred'] || ''
  const level_2 = item['level_2'] || item['level_2_inferred'] || ''
  const level_3 = item['level_3'] || item['level_3_inferred'] || ''

  function levelClicked(e) {
    const level = e.target.dataset.level;
    if (!level) {return}
    const names = ['add category']

    if (level === '1') {
      names.push(...(levels?.[level_2]?.l1 || []))
      names.push(...(levels?.[level_3]?.l1 || []))
    } else if (level === '2') {
      names.push(...(levels?.[level_1]?.l2 || []))
      names.push(...(levels?.[level_3]?.l2 || []))
    } else if (level === '3') {
      // names.push(...(levels?.[level_1]?.l3 || []))
      names.push(...(levels?.[level_2]?.l3 || []))
    }
    console.log(names)
    setDropbar({...dropbar, [level]: names})
  }
  console.log(dropbar)
  return (
      <tr key={item.id}>
        <td className='w-5' key={1}>{item.source}</td>
        <td className='w-20'  key={2}>{item.category}</td>
        <td className='w-20'  key={3}>{item.name}</td>
        <td className='w-5'  key={4}></td>
        <td data-level={1} className='w-15' key={5} onClick={levelClicked}>
          {dropbar?.['1'] ? <Dropdown currentName={level_1} nameList={dropbar['1']}
           removeDropbar={() => setDropbar(null)}/>: level_1}
        </td>
        <td data-level={2} className='w-15 has-background-light has-text-centered' key={6} onClick={levelClicked}>
          {dropbar?.['2'] ? <Dropdown currentName={level_2} nameList={dropbar['2']}
           removeDropbar={() => setDropbar(null)}/>: level_2}
        </td>
        <td data-level={3} className='w-15' key={7} onClick={levelClicked}>
         {dropbar?.['3'] ? <Dropdown currentName={level_3} nameList={dropbar['3']}
           removeDropbar={() => setDropbar(null)}/>: level_3}
        </td>
        <td className='w-5'  key={8}>
          <button className='button is-light m-0'>Save</button>
        </td> 
      </tr>
  )
})