/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

export default React.memo(function ({item}) {
  console.log('rendering item')

  return (
      <tr key={item.id}>
        <td key={1}>{item.source}</td>
        <td key={2}>{item.category}</td>
        <td key={3}>{item.name}</td>
        <td key={4}></td>
        <td key={5}></td>
        <td className='has-background-light has-text-centered' key={6}><span>{item.category}</span></td>
        <td key={7}></td>
        <td key={8} className='p-0 is-flex'>
        <button className='button is-light m-0 is-justify-content-flex-start' style={{borderRadius: 0, width: '100%'}}>Apply to all &nbsp;<strong>{item.source}{' '}{item.category}</strong></button>
        </td> 
      </tr>
  )
})