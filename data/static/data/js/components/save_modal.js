import React from 'react';
import { HOST, headers } from '../constants';


export const SaveModal = function({active, setIsModalActive, updateData, updateItems}) {

    function updateAllItemsModal() {
      setIsModalActive(false)
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
          <div class={`modal ${active ? 'is-active': ''}`}>
            <div class="modal-background" onClick={() => setIsModalActive(false)}></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Save changes?</p>
                <button class="delete" aria-label="close" onClick={() => setIsModalActive(false)}></button>
              </header>
                <section class="modal-card-body">
                  Apply the next changes
                  <ul>
                    <li><strong>level_1:</strong>{' '}{updateData.level_1}</li>
                    <li><strong>level_2:</strong>{' '}{updateData.level_2}</li>
                    <li><strong>level_3:</strong>{' '}{updateData.level_3}</li>
                  </ul>
                  to all {<strong>{updateData.category}</strong>} of {<strong>{updateData.source}</strong>}?
                </section>
                <footer class="modal-card-foot">
                  <div class="buttons">
                      <button class="button is-success" onClick={updateAllItemsModal}>Save changes</button>
                      <button class="button" onClick={() => setIsModalActive(false)}>Cancel</button>
                  </div>  
                </footer>
            </div>
          </div>
        }
      </>
  )
}