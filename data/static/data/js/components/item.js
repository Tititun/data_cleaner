/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Dropdown } from './dropdown';
import { HOST, headers } from '../constants';

export default function ({item, levels, updateItem, updateItems}) {
  console.log('rendering item')
  const [dropbar, setDropbar] = React.useState({})
  const [item_levels, setItemLevels] = React.useState({level_1: '', level_2: '', level_3: ''})
  // const [classified, setClassified] = React.useState(item['level_1'] || item['level_2'])

  React.useEffect(() => {
    setItemLevels({
      level_1: item['level_1'] || item['level_1_inferred'] || '',
      level_2: item['level_2'] || item['level_2_inferred'] || '',
      level_3: item['level_3'] || item['level_3_inferred'] || ''
    })
  }, [item])

  function levelClicked(e) {
    const level = e.target.dataset.level;
    if (!level) {return}
    const names = []

    if (level === '1') {
      names.push(...(levels?.[item_levels.level_2]?.l1 || []))
      names.push(...(levels?.[item_levels.level_3]?.l1 || []))
    } else if (level === '2') {
      names.push(...(levels?.[item_levels.level_1]?.l2 || []))
      names.push(...(levels?.[item_levels.level_3]?.l2 || []))
    } else if (level === '3') {
      names.push(...(levels?.[item_levels.level_1]?.l3 || []))
      names.push(...(levels?.[item_levels.level_2]?.l3 || []))
    }
    names.sort()
    setDropbar({...dropbar, [level]: names})
  }

  function closeDropdown(value, level) {
    if (value){
      setItemLevels(structuredClone({...item_levels, [level]: value}))
    }
    setDropbar(null)
  }

  function saveItem() {
    const update_data = {
      id: item['id'],
      level_1: item_levels['level_1'] || item['level_1_inferred'],
      level_2: item_levels['level_2'] || item['level_2_inferred'],
      level_3: item_levels['level_3'] || item['level_3_inferred'],
    }
    const body = JSON.stringify(update_data)
    fetch(`${HOST}/api/set_item_levels`, {
      method: "POST",
      headers: headers,
      body: body}
     ).then(r => r.json())
      .then(data => {
          if (data['status'] === 'success') {
            updateItem(update_data)
          }
        })
      .catch(err => console.log(err))
    }
  
  function saveAllItems() {
    const update_data = {
      category: item['category'],
      source: item['source'],
      level_1: item_levels['level_1'] || item['level_1_inferred'],
      level_2: item_levels['level_2'] || item['level_2_inferred'],
      level_3: item_levels['level_3'] || item['level_3_inferred'],
    }
    const body = JSON.stringify(update_data)
    fetch(`${HOST}/api/set_items_levels`, {
      method: "POST",
      headers: headers,
      body: body}
      ).then(r => r.json())
      .then(data => {
          if (data['status'] === 'success') {
            updateItems(update_data)
          }
        })
      .catch(err => console.log(err))
    }

  return (
      <tr key={item.id} className={`${item['level_1'] || item['level_2'] ? 'has-background-success-light' : ""}`}>
        <td className='w-5' key={1}>{item.source}</td>
        <td className='w-20'  key={2}>{item.category}</td>
        <td className='w-20'  key={3}>{item.name}</td>
        <td className='w-5'  key={4}></td>
        <td data-level={1} className='w-15' key={5} onClick={levelClicked}>
          {dropbar?.['1'] ? <Dropdown currentName={item_levels.level_1} nameList={dropbar['1']} level="level_1"
           removeDropbar={closeDropdown}/>: item_levels.level_1}
        </td>
        <td data-level={2} className='w-15 has-background-light has-text-centered' key={6} onClick={levelClicked}>
          {dropbar?.['2'] ? <Dropdown currentName={item_levels.level_2} nameList={dropbar['2']} level="level_2"
           removeDropbar={closeDropdown}/>: item_levels.level_2}
        </td>
        <td data-level={3} className='w-15' key={7} onClick={levelClicked}>
         {dropbar?.['3'] ? <Dropdown currentName={item_levels.level_3} nameList={dropbar['3']} level="level_3"
           removeDropbar={closeDropdown}/>: item_levels.level_3}
        </td>
        <td className='w-5'  key={8}>
          <div className='is-flex'>
            <button className='button is-light m-0 is-primary mr-1' onClick={saveItem}>Save</button>
            <button className='button is-light m-0 has-background-danger-light' onClick={saveAllItems}>Save all</button>
          </div>
        </td> 
      </tr>
  )
}