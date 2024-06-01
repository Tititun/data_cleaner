import React from 'react';
import { HOST, headers } from '../constants';


export const SaveModal = function({active, setIsModalActive, updateData, updateItems}) {

    const [ignoreClassified, setIgnoreClassified] = React.useState(true)

    function updateAllItemsModal() {
      setIsModalActive(false)
      updateData['ignore_classified'] = ignoreClassified;
      const body = JSON.stringify(updateData)
      fetch(`${HOST}/api/set_items_levels`, {
      method: "POST",
      headers: headers,
      body: body}
      ).then(r => r.json())
      .then(data => {
          if (data['status'] === 'success') {
            updateItems(updateData)
          }
        })
      .catch(err => console.log(err))
    }

    return (
      <>
        {
          !active ?
            null
          :
          <div className={`modal ${active ? 'is-active': ''}`}>
            <div className="modal-background" onClick={() => setIsModalActive(false)}></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Save changes?</p>
                <button className="delete" aria-label="close" onClick={() => setIsModalActive(false)}></button>
              </header>
                <section className="modal-card-body">
                  <label className="checkbox mb-2">
                    <input id="ignore_classified" className="mr-2" type="checkbox" checked={ignoreClassified}
                     onClick={() => setIgnoreClassified(!ignoreClassified)} />
                      Ignore classified
                  </label><br/>
                  Apply the next changes
                  <ul>
                    <li><strong>level_1:</strong>{' '}{updateData.level_1}</li>
                    <li><strong>level_2:</strong>{' '}{updateData.level_2}</li>
                    <li><strong>level_3:</strong>{' '}{updateData.level_3}</li>
                  </ul>
                  to all {<strong>{updateData.category}</strong>} of {<strong>{updateData.source}</strong>}?

                </section>

                <footer className="modal-card-foot">
                  <div className="buttons">
                      <button className="button is-success" onClick={updateAllItemsModal}>Save changes</button>
                      <button className="button" onClick={() => setIsModalActive(false)}>Cancel</button>
                  </div>  
                </footer>
            </div>
          </div>
        }
      </>
  )
}