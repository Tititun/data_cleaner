import React from 'react';

var timer;
export const Categories = function({categories, hidden, appSetFilters, appFilters}) {
    const [search, setSearch] = React.useState('')
    const [filter, setFilter] = React.useState('')
    const [selected, setSelected] = React.useState(appFilters['category'])

    React.useEffect(() => {
      setSelected(appFilters['category'])
    }, [appFilters])

    function searchHandler(value) {
      clearTimeout(timer)
      setSearch(value);
      timer = setTimeout(() => setFilter(value), 500)
    }

    function rowClickHandler(category) {
      if (selected === category) {
        setSelected('');
        category = '';
      }
      setSelected(category)
      appSetFilters({type: 'categories_list',
                     value: {category: category}
                    })
    }

    return (
      <div id='categories_container' className={`${hidden ? 'is-hidden' : ''}`}>
        <input 
          className="input is-info" type="text" placeholder="Search categories"
          value={search}
          onInput={e => searchHandler(e.target.value)}
        />
        <table
         className={`table is-striped is-hoverable is-fullwidth ${Object.keys(categories).length === 0 ? 'is-loading' : ''}`}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.entries(categories).map(([category, count], idx) => {
                return (
                  category.search(filter) !== -1 ?
                  <tr
                   onClick={() => rowClickHandler(category)}
                   className={`is-clickable ${selected === category ? 'has-background-info-light' : ''}`}
                   >
                    <td>{category}</td>
                    <td>{count}</td>
                  </tr> : null
                )
              })
            }

          </tbody>
        </table>
      </div>
    )
}
