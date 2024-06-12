/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { headers, HOST } from '../constants';
import { Pagination } from './pagination';

function getColor(val, selected) {
  let red = Math.max(255 - 153 * val * 5, 102)
  let blue = Math.max(255 - 46 * val * 5, 209)
  let green = 255
  return `rgba(${red},${blue},${green},${selected ? 0.75 : 1})`
}

function getColumnColor(val) {
  let red = 255 - 153 * val
  let blue = 255 - 46 * val
  let green = 255
  return `rgba(${red},${blue},${green}, 1)`
}

export const ModelApp = function() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [url, setUrl] = React.useState(`${HOST}/api/model_results`)
  const [pagination, setPagination] = React.useState({currentPage: 1, maxPage: null, prev: null, next: null})
  const [cm, setCm] = React.useState([])
  const [labels, setLabels] = React.useState([])
  const [selected, setSelected] = React.useState('cm')
  const [rowIdx, setRowIdx] = React.useState(null)
  const [cmErrors, setCmErrors] = React.useState([])
  const [predictions, setPredictions] = React.useState([])


  React.useEffect(() => {
    let didCancel = false;
    setIsLoading(true);
    fetch(url, {
          method: "GET",
          headers: headers})
      .then(r => r.json())
      .then(data => {
        if (!didCancel) {
            console.log(data);
            console.log(data['results']);
            setItems(data['results']);
            setPagination({currentPage: data['page_number'], maxPage: data['max_page'], prev: data['previous'], next: data['next']})
            setIsLoading(false)
          }
        })
      .catch(err => console.log(err))

    return () => {didCancel = true}
  }, [url])

  React.useEffect(() => {
    setIsLoading(true);
    fetch(`${HOST}/api/confusion_matrix`, {
          method: "GET",
          headers: headers})
      .then(r => r.json())
      .then(data => {
            console.log(data);
            setCm(data['cm']);
            setLabels(data['labels'])
          })
      .catch(err => console.log(err))
  }, [])

  function anchorRequest (e) {
    e.preventDefault();
    setUrl(e.target.href)
  }

  function cmRowClick (idx) {
    setRowIdx(idx);
    fetch(`${HOST}/api/confusion_matrix_errors?label=${labels[idx]}`, {
      method: "GET",
      headers: headers}
      )
    .then(r => r.json())
    .then(data => {
          setCmErrors(data['data']);
        })
    .catch(err => console.log(err))
  }

  function randomPredictions() {
    setIsLoading(true);
    fetch(`${HOST}/api/get_random_predictions`, {
      method: "GET",
      headers: headers}
      )
    .then(r => r.json())
    .then(data => {
          setPredictions(data['data']);
          setIsLoading(false);
        })
    .catch(err => console.log(err))
  }

  function clearItem(itemId) {
    let update_data = {
        id: itemId,
        level_1: null,
        level_2: null,
        level_3: null,
    }

    const body = JSON.stringify(update_data)
    fetch(`${HOST}/api/set_item_levels`, {
      method: "POST",
      headers: headers,
      body: body}
     ).then(r => r.json())
      .then(data => {
          if (data['status'] === 'success') {
            console.log('success')
            setCmErrors([...cmErrors.filter(item => item.id != itemId)])
          }
        })
      .catch(err => console.log(err))
  }


  return (
    <div className="content mt-0 mx-3 mb-3">
      <div className='columns'>

        <div id='left-main-column' className='column is-9' style={{overflow: 'hidden'}}>

          <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-menu is-justify-content-center">
              <a role='button' className='navbar-item' onClick={() => navigate('/')}>
                To data cleaner
              </a>
              <a role='button' className={`navbar-item ${selected === 'test' ? 'is-selected' : ''}`} onClick={e => {e.preventDefault();setSelected('test')}}>
                Test items
              </a>
              <a role='button' className={`navbar-item ${selected === 'cm' ? 'is-selected' : ''}`} onClick={e => {e.preventDefault();setSelected('cm')}}>
                Matrix
              </a>
            </div>
            <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {selected === 'test' ? <a className="button is-link" onClick={randomPredictions}><strong>Random 100</strong></a> : null}
              </div>
            </div>
          </div>
          </nav> 
          <div style={{overflow: 'scroll', height: '100%'}}>
            {selected === 'test' ? (
              <table className={`table is-striped is-hoverable ${isLoading ? 'is-loading' : ''}`}>
                <thead>
                  <tr>
                    <th className='w-25'>name</th>
                    <th className='w-5'>lang</th>
                    <th className='w-5'>source</th>
                    <th className='w-10'>category</th>
                    <th className='w-10'>{predictions.length ? 'language' : 'level_3'}</th>
                    <th className='w-10'>top 1</th>
                    <th className='w-10'>top 2</th>
                    <th className='w-10'>top 3</th>
                  </tr>
                </thead>
                <tbody>
                  {(predictions.length ? predictions : items).map(item => {
                    return(
                      <tr key={item.id}>
                        <td className='w-25'>{item.name}</td>
                        <td className='w-5'>{item.language}</td>
                        <td className='w-5'>{item.source}</td>
                        <td className='w-10'>{item.category}</td>
                        <td className='w-10'>{predictions.length ? item.language : item.level_3}</td>
                        <td className='w-10'>{`${item.predictions[0].category}: ${item.predictions[0].prob.toFixed(2)}`}</td>
                        <td className='w-10'>{`${item.predictions[1].category}: ${item.predictions[1].prob.toFixed(2)}`}</td>
                        <td className='w-10'>{`${item.predictions[2].category}: ${item.predictions[2].prob.toFixed(2)}`}</td>
                      </tr>
                    )
                  })}
                </tbody>
                </table> 
                ) : (
                <table className='table' style={{marginBottom: '60px'}}>
                <thead style={{position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 5}}>
                  <tr>
                    {['', ...labels].map(label => <th>{label}</th>)}
                  </tr>
                </thead>
                <tbody style={{backgroundColor: '#48c78e'}}>
                  {cm.map((row, idx) => {
                    const new_row = [labels[idx], ...row]
                    return <tr
                       className={`${rowIdx === idx ? 'selectedCm' : ''}`}
                       onClick={() => cmRowClick(idx)}>
                        {new_row.map((value, idx_) => <td 
                          className='has-text-centered cm-cell'
                          style={idx_ === 0 ? {position: 'sticky',
                                               left: 0, backgroundColor: getColumnColor(row[idx])} : {backgroundColor: getColor(value, idx===rowIdx)}}>
                          {value}{idx_ === 0 ? ` [${(row[idx] * 100).toFixed(2)}%]`: ''}</td>)}
                      </tr>
                  })}
                </tbody>
                </table>)
            }
          
          </div>
        {selected === 'test' && !predictions.length ? <Pagination {...pagination} onClickFunc={anchorRequest} href={`${HOST}/api/model_results`} /> : null}  
        </div>
        <div id="right-main-column" className='column is-3 pt-5' style={{height: '95vh', overflow: 'scroll'}}>
          {
            selected === 'cm' ?
            cmErrors.map(item => {
              return <div className='box'>
                <h5>{item.name}</h5>
                <p>{item.category}{' | '}{item.language}</p>
                <p>{`${item.predictions[0].category}: ${item.predictions[0].prob.toFixed(2)}`}</p>
                <p>{`${item.predictions[1].category}: ${item.predictions[1].prob.toFixed(2)}`}</p>
                <p>{`${item.predictions[2].category}: ${item.predictions[2].prob.toFixed(2)}`}</p>
                <button class="button is-danger" onClick={() => clearItem(item.id)}>delete</button>
              </div>
            }) : null
          }
        </div>  
      </div>
    </div>
  )
}
