/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom'
import Item from './components/item'
import { searchReducer } from './utils';

const HOST = 'http://localhost:8000'

var items, levels;

function App() {
  console.log('rendering table')
  // const [items, setItems] = React.useState([])
  const [displayIds, setDisplayIds] = React.useState([])
  const [showFilters, setShowFilters] = React.useState(false)
  const [searchFilter, searchDispatcher] = React.useReducer(searchReducer, {
    source: '', category: '', name: '', translation: '', level_1: '', level_2: '', level_3: ''
  })


  React.useEffect(() => {
    fetch(`${HOST}/api/items`, {
      method: "GET",
      headers: { "Content-Type": "application/json",
                 "Access-Control-Allow-Headers": "*",
                 "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                 "Access-Control-Allow-Origin": "*"
       }
    })
    .then(r => r.json())
    .then(data => {
      items = data['data'];
      levels = data['levels']
      console.log(items)
      setDisplayIds([...Array(items.length).keys()] )
    })
    .catch(err => console.log(err))
  }, [])
  

  React.useEffect(() => {
    if (!items) return; 
    const ids_to_display = [];
    for (const [idx, item] of Object.entries(items)) {
      let to_display = true;
      for (const [filter, value] of Object.entries(searchFilter)){
        if (!value) {
          continue
        } else if (item[filter] && item[filter].toLowerCase().search(value.toLowerCase()) === -1) {
          to_display = false;
          break
        } else if (!item[filter]) {
          to_display = false;
        }
      }
      if (to_display) { ids_to_display.push(idx) }
    }
    setDisplayIds(ids_to_display)
  }, [searchFilter])
  console.log(items)

  return (
    <div className="content m-5">
      <nav class="navbar is-justify-content-center" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a role='button' className='navbar-item' onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide filters': 'Show filters'}</a>
        </div>
      </nav>  
      <div className='columns'>
        <div key={1} className='column is-9'>
        <table className="table is-striped is-hoverable">
          <thead>
            {
              showFilters ?
              <tr>
                <th className="col-title" key={1}>
                  <input class="input" type="text" value={searchFilter['source']} onChange={e => searchDispatcher({type: 'source', value: e.target.value})}></input>
                </th>
                <th className="col-title" key={2}>
                  <input class="input" type="text" value={searchFilter['category']} onChange={e => searchDispatcher({type: 'category', value: e.target.value})}></input>
                </th>
                <th className="col-title" key={3}>
                  <input class="input" type="text" value={searchFilter['name']} onChange={e => searchDispatcher({type: 'name', value: e.target.value})}></input>
                </th>
                <th className="col-title" key={4}>
                  <input class="input" type="text" value={searchFilter['translation']} onChange={e => searchDispatcher({type: 'translation', value: e.target.value})}></input>
                </th>
                <th className="col-title" key={5}>
                  <input class="input" type="text" value={searchFilter['level_1']} onChange={e => searchDispatcher({type: 'level_1', value: e.target.value})}></input>
                </th>
                <th className="col-title" key={6}>
                  <input class="input" type="text" value={searchFilter['level_2']} onChange={e => searchDispatcher({type: 'level_2', value: e.target.value})}></input>
                </th>
                <th className="col-title" key={7}>
                  <input class="input" type="text" value={searchFilter['level_3']} onChange={e => searchDispatcher({type: 'level_3', value: e.target.value})}></input>
                </th>
                <th className="col-title" key={8}></th>
              </tr>
              : null
            }
            <tr>
              <th className="col-title" key={1}>Source</th>
              <th className="col-title" key={2}>Category</th>
              <th className="col-title" key={3}>Name</th>
              <th className="col-title" key={4}>Translation</th>
              <th className="col-title" key={5}>level 1</th>
              <th className="col-title" key={6}>level 2</th>
              <th className="col-title" key={7}>level 3</th>
              <th className="col-title" key={8}></th>
            </tr>
          </thead>
          <tbody>
            {items ? displayIds.map(idx => <Item item={items[idx]} levels={levels} />) : null}
          </tbody>
        </table>  
        </div>
        <div key={2} className='column is-3'></div>
      </div>
    </div>
  );
}


ReactDOM.render(
    <App />,
    document.getElementById("root")
);

