import React from "react";
import Book from "./Book";

const Shelf = ({ books, title, changeShelf }) => {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((displayedBook) => (
            <li key={displayedBook.id}>
              <Book bookProp={displayedBook} moveToShelf={changeShelf}/>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Shelf;
