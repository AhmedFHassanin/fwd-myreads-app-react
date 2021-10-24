import React from "react";

const Book = ({bookProp, moveToShelf})=> {



    return(
        <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${bookProp.imageLinks.smallThumbnail})` }}></div>
          <div className="book-shelf-changer">
            <select defaultValue={bookProp.shelf ? bookProp.shelf : 'none'} onChange={(e)=> moveToShelf(bookProp, e.target.value)}>
              <option value="move" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{bookProp.title}</div>
        <div className="book-authors">{bookProp.publisher}</div>
      </div>
    )
    
}

export default Book;