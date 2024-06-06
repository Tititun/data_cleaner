/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom'
import Item from './item'
import { Pagination } from './pagination';
import { fetchAndSet, searchReducer } from '../utils';
import { empty_filters, headers, HOST, langs } from '../constants';
import { Categories } from './categories';
import { Groups } from './groups';
import { useNavigate } from 'react-router-dom';


var levels = {};

function update_or_create(word, level, relation) {
  if (word === 'no group' || relation === 'no group') {
    return
  }
  if (!(word in levels)) {
    levels[word] = {}
  }
  if (!levels[word][level]) {
    levels[word][level] = []
  }
  if (!levels[word][level].includes(relation)){
    levels[word][level].push(relation)
  }
}

function update_levels(groups) {
  for (const [level_1, level_1_data] of Object.entries(groups)) {
    const l1 = level_1.toLowerCase()
    for (const [level_2, level_2_data] of Object.entries(level_1_data.groups)) {
        const l2 = level_2.toLowerCase()
        update_or_create(l1, 'l2', l2)
        update_or_create(l2, 'l1', l1)
        for (const level_3 of Object.keys(level_2_data.groups)) {
          const l3 = level_3.toLowerCase()
          update_or_create(l1, 'l3', l3)
          update_or_create(l2, 'l3', l3)
          update_or_create(l3, 'l1', l1)
          update_or_create(l3, 'l2', l2)
      }
    }
  }
}


export const DataCleanerApp = function () {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [pagination, setPagination] = React.useState({currentPage: 1, maxPage: null, prev: null, next: null})
  
  const [searchFilter, searchDispatcher] = React.useReducer(searchReducer, empty_filters)
  const [url, setUrl] = React.useState(`${HOST}/api/items`)
  const [items, setItems] = React.useState([])
  const [groups, setGroups] = React.useState({})
  const [selectedGroup, setSelectedGroup] = React.useState([])
  const [categories, setCategories] = React.useState({})
  const [selectedTab, setSelectedTab] = React.useState('categorized')
  const [brush, setBrush] = React.useState(null)
  const [temp, setTemp] = React.useState({})
  const [lang, setLang] = React.useState(false)

  React.useEffect(() => {
    let didCancel = false;
    setIsLoading(true);
    fetch(url, {
            method: "GET",
            headers: headers})
      .then(r => r.json())
      .then(data => {
        if (!didCancel) {
          if (data["detail"] === "Invalid page.") {
            console.log('INVALID PAGE')
            setTemp({})
            searchDispatcher({type: 'clear'})
            setIsLoading(false)
          } else {
            setItems(data['results']);
            setTemp({})
            setPagination({currentPage: data['page_number'], maxPage: data['max_page'], prev: data['previous'], next: data['next']})
            setIsLoading(false)
          }
        }
      })
      .catch(err => console.log(err))

    return () => {didCancel = true}
  }, [url])

  React.useEffect(() => {
    fetch(`${HOST}/api/levels`, {
      method: "GET",
      headers: headers
    })
    .then(r => r.json())
    .then(data => {
      levels = data;
    })
    .catch(err => console.log(err))
  }, [])

  React.useEffect(() => {
    fetchAndSet(`${HOST}/api/classified`, setGroups)
  }, [])

  React.useEffect(() => {
    fetchAndSet(`${HOST}/api/categories_list`, setCategories)
  }, [])
  
  React.useEffect(() => {
    update_levels(groups)
  }, [groups])

  function applyFilters () {
      setUrl(`${HOST}/api/items?` + new URLSearchParams(searchFilter).toString())
  }

  function anchorRequest (e) {
    e.preventDefault();
    // window.history.pushState({}, null, e.target.href);
    setUrl(e.target.href + '&' + new URLSearchParams(searchFilter).toString())
  }

  function updateItem(new_item) {
    const new_items = []
    const new_temp = structuredClone(temp)
    for (let old_item of items) {
      if (old_item['id'] === new_item['id']) {
        new_items.push({...old_item, ...new_item})
        delete new_temp[old_item['id']]
      } else {
        new_items.push(old_item)
      }
    }
    setItems(new_items)
    setTemp(new_temp)
    fetchAndSet(`${HOST}/api/classified`, setGroups)
  }

  function updateItems(new_data) {
    const new_items = []
    const new_temp = structuredClone(temp)
    for (let old_item of items) {
      if (old_item['category'] === new_data['category']) {
        new_items.push({...old_item, ...new_data})
        delete new_temp[old_item['id']]
      } else {
        new_items.push(old_item)
      }
    }
    setItems(new_items)
    setTemp(new_temp)
    fetchAndSet(`${HOST}/api/classified`, setGroups)
  }

  function savePage() {
    const body = JSON.stringify(temp)
    fetch(`${HOST}/api/save_page`, {
      method: "POST",
      headers: headers,
      body: body}
     ).then(r => r.json())
      .then(data => {
          if (data['status'] === 'success') {
            const new_items = []
            for (let old_item of items) {
              if (old_item['id'] in temp ) {
                new_items.push(temp[old_item.id])
              } else {
                new_items.push(old_item)
              }
            }
            setItems(new_items)
            setTemp({})
            fetchAndSet(`${HOST}/api/classified`, setGroups)
          }
        })
      .catch(err => console.log(err))
    }
    
  function palletteClick() {
    if (brush) {
      setBrush(null)
    } else {
      setBrush('clean')
    }
  }
  
  return (
    <div className="content mt-0 mx-3 mb-3">
       
      <div className='columns'>
        <div key={1} id='left-main-column' className='column is-9'>
          <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
              <a role='button' className='delete is-align-self-center' onClick={() =>{searchDispatcher({type: 'clear'}); setSelectedGroup([])}}></a>
            </div>
            <div className="navbar-menu is-justify-content-center">
              <a role='button' className='navbar-item' onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide filters': 'Show filters'}</a>
            </div>
            <div className="navbar-menu is-justify-content-center">
              <a role='button' className={`navbar-item `} onClick={() => navigate('model')}>
                To model
              </a>
            </div>
            <div className="navbar-menu is-justify-content-center">
              <a role='button' className={`navbar-item ${brush ?'has-background-info-soft' : ''}`} onClick={palletteClick}>
                {brush instanceof(Array) ? brush.join(' / ') : 'Select Pallette'}
              </a>
            </div>
            <a className="navbar-item">
              <label className="checkbox">
              <input type="checkbox" className=' mr-2' onClick={() => searchDispatcher({type: 'show_classified', value: !(searchFilter['show_classified'])})}
               checked={searchFilter['show_classified']} />
                Show classified
              </label>
            </a>
          </nav>   
        <table id="main-table" className={`table is-striped is-hoverable ${isLoading ? 'is-loading' : ''}`}>
          <thead>
            {
              showFilters ?
              <tr style={{zIndex: 3}}>
                <th className="w-5 col-title" key={1}>
                  <input className="input" type="text" value={searchFilter['source']} onChange={e => searchDispatcher({type: 'source', value: e.target.value})}></input>
                </th>
                <th className="w-10 col-title" key={2}>
                  <input className="input column col-10" type="text" value={searchFilter['category']} onChange={e => searchDispatcher({type: 'category', value: e.target.value})}></input>
                </th>
                <th className="w-30 col-title" key={3}>
                  <div className='columns is-align-items-center is-flex'>
                    <input className="input column col-10" type="text" value={searchFilter['name']} onChange={e => searchDispatcher({type: 'name', value: e.target.value})}></input>
                    <div className={`${lang ? 'is-active' : ''} dropdown column col-2`} style={{maxWidth: '25%'}}>
                      <div className="dropdown-trigger">
                        <button onClick={() => setLang(!lang)} className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                          {searchFilter['lang']}<span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg></span>
                        </button>
                      </div>
                      <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content p-0" style={{width: '50px'}}>
                          {langs.map(lang => {
                            return <a href="#" className={`${searchFilter['lang'] === lang ? 'is-active' : ''} dropdown-item lang-dropdown`}
                                    onClick={e => {e.preventDefault();searchDispatcher({type: 'lang', value: lang}); setLang(false)}}>{lang}</a>
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="w-15 col-title" key={5}>
                  <input className="input" type="text" value={searchFilter['level_1']} onChange={e => searchDispatcher({type: 'level_1', value: e.target.value})}></input>
                </th>
                <th className="w-15 col-title" key={6}>
                  <input className="input" type="text" value={searchFilter['level_2']} onChange={e => searchDispatcher({type: 'level_2', value: e.target.value})}></input>
                </th>
                <th className="w-15 col-title" key={7}>
                  <input className="input" type="text" value={searchFilter['level_3']} onChange={e => searchDispatcher({type: 'level_3', value: e.target.value})}></input>
                </th>
                <th className="w-10 col-title has-text-centered" key={8}>
                  <button className='button is-light' onClick={applyFilters}>Apply filters</button>
                </th>
              </tr>
              : null
            }
            <tr className={`${showFilters ? '' : 'hoisted'}`}>
              <th className="col-title has-text-centered" key={1}>Source</th>
              <th className="col-title has-text-centered" key={2}>Category</th>
              <th className="col-title has-text-centered" key={3}>Name</th>
              <th className="col-title has-text-centered" key={5}>level 1</th>
              <th className="col-title has-text-centered" key={6}>level 2</th>
              <th className="col-title has-text-centered" key={7}>level 3</th>
              <th className="col-title has-text-centered" key={8}>
                <button className='button is-light' onClick={savePage}>Save page{Object.keys(temp).length ? ` [${Object.keys(temp).length}]` : ''}</button></th>
            </tr>
          </thead>
          <tbody>
            {items && levels && items.map(item => 
            <Item item={item} levels={levels} updateItem={updateItem}
             updateItems={updateItems} brush={brush} setTemp={setTemp} />)}
          </tbody>
        </table>  
        <Pagination {...pagination} onClickFunc={anchorRequest} />
        </div>
        
        <div key={3} id="right-main-column" className='column is-3'>
          <div className='tabs main-tabs is-fullwidth'>
            <ul>
              <li className={selectedTab === 'categorized' ? "is-active" : ''}>
                <a onClick={() => setSelectedTab('categorized')}>Categorized</a>
              </li>
              <li className={selectedTab === 'categories_list' ? "is-active" : ''}>
                <a onClick={() => setSelectedTab('categories_list')}>Categories list</a>
              </li>
            </ul>
          </div>
          <Groups groups={groups} appSetFilters={searchDispatcher} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup}
           hidden={selectedTab === 'categorized' ? false : true}  brush={brush} setBrush={setBrush} />
          <Categories categories={categories} appSetFilters={searchDispatcher} appFilters={searchFilter}
           hidden={selectedTab !== 'categories_list' ? true : false} />
        </div>
      </div>
    </div>
  );
}


// ReactDOM.render(
//     <App />,
//     document.getElementById("root")
// );
