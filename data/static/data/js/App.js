/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom'
import Item from './components/item'
import { Pagination } from './components/pagination';
import { fetchAndSet, searchReducer } from './utils';
import { headers, HOST } from './constants';
import { Categories } from './components/categories';
import { Groups } from './components/groups';


var levels;

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
  const [items, setItems] = React.useState([])
  const [groups, setGroups] = React.useState({})
  const [categories, setCategories] = React.useState({})
  const [selectedTab, setSelectedTab] = React.useState('categorized')


  React.useEffect(() => {
    let didCancel = false;
    setIsLoading(true);
    fetch(url, {
            method: "GET",
            headers: headers})
      .then(r => r.json())
      .then(data => {
        if (!didCancel) {
          setItems(data['results']);
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
    fetchAndSet(`${HOST}/api/classified`, setGroups)
  }, [])

  React.useEffect(() => {
    fetchAndSet(`${HOST}/api/categories_list`, setCategories)
  }, [])
  
  React.useEffect(() => {
    let timeout = setTimeout(() => {
        setUrl(`${HOST}/api/items?` + new URLSearchParams(searchFilter).toString())
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchFilter])
  
  function anchorRequest (e) {
    e.preventDefault();
    // window.history.pushState({}, null, e.target.href);
    setUrl(e.target.href + '&' + new URLSearchParams(searchFilter).toString())
  }

  function updateItem(new_item) {
    const new_items = []
    for (let old_item of items) {
      if (old_item['id'] === new_item['id']) {
        new_items.push({...old_item, ...new_item})
      } else {
        new_items.push(old_item)
      }
    }
    setItems(new_items)
    fetchAndSet(`${HOST}/api/classified`, setGroups)
  }

  function updateItems(new_data) {
    const new_items = []
    for (let old_item of items) {
      if (old_item['category'] === new_data['category']) {
        new_items.push({...old_item, ...new_data})
      } else {
        new_items.push(old_item)
      }
    }
    setItems(new_items)
    fetchAndSet(`${HOST}/api/classified`, setGroups)
  }
  
  return (
    <div className="content m-5">
       
      <div className='columns'>
        <div key={1} className='column is-9'>
          <nav class="navbar is-justify-content-center" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a role='button' className='navbar-item' onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide filters': 'Show filters'}</a>
          </div>
        </nav>   
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
              <th className="col-title has-text-centered" key={1}>Source</th>
              <th className="col-title has-text-centered" key={2}>Category</th>
              <th className="col-title has-text-centered" key={3}>Name</th>
              <th className="col-title has-text-centered" key={5}>level 1</th>
              <th className="col-title has-text-centered" key={6}>level 2</th>
              <th className="col-title has-text-centered" key={7}>level 3</th>
              <th className="col-title has-text-centered" key={8}></th>
            </tr>
          </thead>
          <tbody>
            {items && levels && items.map(item => <Item item={item} levels={levels} updateItem={updateItem} updateItems={updateItems} />)}
          </tbody>
        </table>  
        <Pagination {...pagination} onClickFunc={anchorRequest} />
        </div>
        
        <div key={3} className='column is-3'>
          <div className='tabs is-fullwidth'>
            <ul>
              <li className={selectedTab === 'categorized' ? "is-active" : ''}>
                <a onClick={() => setSelectedTab('categorized')}>Categorized</a>
              </li>
              <li className={selectedTab === 'categories_list' ? "is-active" : ''}>
                <a onClick={() => setSelectedTab('categories_list')}>Categories list</a>
              </li>
            </ul>
          </div>
          <Groups groups={groups} appSetFilters={searchDispatcher} hidden={selectedTab === 'categorized' ? false : true}/>
          <Categories categories={categories} appSetFilters={searchDispatcher} appFilters={searchFilter}
           hidden={selectedTab !== 'categories_list' ? true : false} />
        </div>
      </div>
    </div>
  );
}


ReactDOM.render(
    <App />,
    document.getElementById("root")
);

