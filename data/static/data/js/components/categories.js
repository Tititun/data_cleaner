import React from 'react';

var timer;
export const Categories = function({categories, hidden}) {
    const [search, setSearch] = React.useState('')
    const [filter, setFilter] = React.useState('')

    function searchHandler(value) {
      clearTimeout(timer)
      setSearch(value);
      timer = setTimeout(() => setFilter(value), 400)
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
                  <tr>
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
