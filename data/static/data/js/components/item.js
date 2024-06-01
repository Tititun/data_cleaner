/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Dropdown } from './dropdown';
import { HOST, headers } from '../constants';
import { SaveModal } from './save_modal';


export default function ({item, levels, updateItem, updateItems}) {
  const [dropbar, setDropbar] = React.useState({})
  const [item_levels, setItemLevels] = React.useState({level_1: '', level_2: '', level_3: ''})
  const [modalUpdateData, setModalUpdateData] = React.useState({})
  const [isModalActive, setIsModalActive] = React.useState(false)

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

  function saveItem(remove_levels=false) {
    let update_data;
    if (remove_levels) {
      update_data = {
        id: item['id'],
        level_1: null,
        level_2: null,
        level_3: null,
      }
    } else {
      update_data = {
        id: item['id'],
        level_1: item_levels['level_1'] || item['level_1_inferred'],
        level_2: item_levels['level_2'] || item['level_2_inferred'],
        level_3: item_levels['level_3'] || item['level_3_inferred'],
      }
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
    setModalUpdateData(update_data)
    setIsModalActive(true)
  }

  function getBackgroundColor() {
    const savedLevels = JSON.stringify({level_1: item['level_1'] || '',
                                        level_2: item['level_2'] || '',
                                        level_3: item['level_3'] || ''})
    if (savedLevels === JSON.stringify(item_levels)) {
      if (item['level_1'] || item['level_2'] || item['level_3']) {
        return 'has-background-success-light'}
    } 
    return ''
  }  

  return (
      <tr key={item.id} className={getBackgroundColor()}>
        <td className='w-5' key={1}>{item.source}</td>
        <td className='w-10'  key={2}>{item.category}</td>
        <td className='w-35'  key={3}>{item.name}</td>
        <td data-level={1} className='w-15 has-text-centered is-clickable level-cell' key={5} onClick={levelClicked}>
          {dropbar?.['1'] ? <Dropdown currentName={item_levels.level_1} nameList={dropbar['1']} fullNameList={Object.keys(levels)} level="level_1"
           removeDropbar={closeDropdown}/>: item_levels.level_1}
        </td>
        <td data-level={2} className='w-15 has-text-centered is-clickable level-cell' key={6} onClick={levelClicked}>
          {dropbar?.['2'] ? <Dropdown currentName={item_levels.level_2} nameList={dropbar['2']} fullNameList={Object.keys(levels)} level="level_2"
           removeDropbar={closeDropdown}/>: item_levels.level_2}
        </td>
        <td data-level={3} className='w-10 has-text-centered is-clickable level-cell' key={7} onClick={levelClicked}>
         {dropbar?.['3'] ? <Dropdown currentName={item_levels.level_3} nameList={dropbar['3']} fullNameList={Object.keys(levels)} level="level_3"
           removeDropbar={closeDropdown}/>: item_levels.level_3}
        </td>
        <td className='w-5'  key={8}>
          <div className='is-flex'>
            <button className='button m-0 is-primary mr-1' onClick={() => saveItem(false)}>Save</button>
            <button className='button is-light mr-1 has-background-danger-light' onClick={saveAllItems}>Save all</button>
            <button className='button is-danger mr-0' onClick={() => saveItem(true)}>X</button>
          </div>
        </td> 
      <SaveModal active={isModalActive} setIsModalActive={setIsModalActive} updateData={modalUpdateData} updateItems={updateItems} />  
      </tr>
  )
}