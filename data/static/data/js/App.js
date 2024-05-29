/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom'

const HOST = 'http://localhost:8000'

function App() {
  const [items, setItems] = React.useState([])

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
      console.log(data)
      setItems(data)
    })
    .catch(err => console.log(err))
  }, [])
  

  return (
    <div className="content m-5">
      <div className='columns'>
        <div className='column is-9'>
          {
          items.map(item => {
            return (
              <div key={item.id}>{item.name}</div>
            )
          })
          }
        </div>
        <div className='column is-3'></div>
      </div>
    </div>
  );
}


ReactDOM.render(
    <App />,
    document.getElementById("root")
);

