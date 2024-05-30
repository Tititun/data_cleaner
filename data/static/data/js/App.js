/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom'
import Item from './components/item'
import { Pagination } from './components/pagination';
import { searchReducer } from './utils';
import { headers, HOST } from './constants';


var items, levels;

function App() {
  console.log('rendering table')

  const [displayIds, setDisplayIds] = React.useState([])
  const [showFilters, setShowFilters] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [pagination, setPagination] = React.useState({currentPage: 1, maxPage: null, prev: null, next: null})
  
  const [searchFilter, searchDispatcher] = React.useReducer(searchReducer, {
    source: '', category: '', name: '', translation: '', level_1: '', level_2: '', level_3: ''
  })
  const [url, setUrl] = React.useState(`${HOST}/api/items`)

  React.useEffect(() => {
    let didCancel = false;
    setIsLoading(true);
    fetch(url, {
            method: "GET",
            headers: headers})
      .then(r => r.json())
      .then(data => {
        if (!didCancel) {
          items = data['results'];
          setDisplayIds([...Array(items.length).keys()] )
          setPagination({currentPage: data['page_number'], maxPage: data['max_page'], prev: data['previous'], next: data['next']})
          setIsLoading(false)
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
    let timeout = setTimeout(() => {
      if (showFilters) {
        setUrl(`${HOST}/api/items?` + new URLSearchParams(searchFilter).toString())
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchFilter])
  
  function anchorRequest (e) {
    e.preventDefault();
    // window.history.pushState({}, null, e.target.href);
    setUrl(e.target.href + '&' + new URLSearchParams(searchFilter).toString())
  }
  
  return (
    <div className="content m-5">
      <nav class="navbar is-justify-content-center" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a role='button' className='navbar-item' onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide filters': 'Show filters'}</a>
        </div>
      </nav>  
      <div className='columns'>
        <div key={1} className='column is-9'>
        <table className={`table is-striped is-hoverable ${isLoading ? 'is-loading' : ''}`}>
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
            {items && levels && displayIds.map(idx => <Item item={items[idx]} levels={levels} />)}
          </tbody>
        </table>  
        <Pagination {...pagination} onClickFunc={anchorRequest} />
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

