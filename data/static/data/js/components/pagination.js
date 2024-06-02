import React from 'react';
import { HOST } from "../constants"

export const Pagination = function({currentPage, maxPage, prev, next, onClickFunc}) {

    const page_numbers = [...Array(maxPage + 1).keys()].filter(
        i => ((i >= currentPage - 3 && i <= currentPage + 3 && i > 0) || (i === 1 || i === maxPage))
    )
    let prev_page = 0
    const links = []
    for (const i of page_numbers) {
        const dif = i - prev_page;
        if (dif > 1) {
            links.push(<li><span className="pagination-ellipsis">&hellip;</span></li>)
        }
        prev_page = i;
        links.push(
            <li>
                <a href={`${HOST}/api/items?page=${i}`}
                   className={`pagination-link ${currentPage === i ? 'is-current' : ''}`}
                   onClick={onClickFunc}>{i}</a>
            </li>
        )
    }

    return (
        <nav className="pagination pb-2" role="navigation" aria-label="pagination">
            <a href={prev} className="pagination-previous" disabled={prev ? false : true} onClick={onClickFunc}>Previous</a>
            <a href={next} className="pagination-next" disabled={next ? false : true} onClick={onClickFunc}>Next page</a>
            <ul class="pagination-list">
                {links}
            </ul>
            </nav>
    )
}