import React from "react";

import "./pagination.css";

const Pagination = ({
    totalPosts,
    postsPerPage,
    setCurrentPage,
    currentPage,
    setPostsPerPage,
    defaultPageSizes,
    
}) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }

    return (
        <div className='pagination'>
            {pages.map((page, index) => {
                return (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={page == currentPage ? "active" : ""}>
                        {page}
                    </button>
                );
            })}
            <select className ="paginationDrop"
                value={postsPerPage} 
                onChange={e => {setPostsPerPage(e.target.value); setCurrentPage(1)}}>
                    {defaultPageSizes.map((value) => (
                    <option value={value} key={value}>
                        {value}
                    </option>
                    ))}
                </select>
        </div>
    );
};

export default Pagination;