import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import Shelves from "./components/Shelves";
import Book from "./components/Book";

const BooksApp = () => {
  /**
   * TODO: Instead of using this state variable to keep track of which page
   * we're on, use the URL in the browser's address bar. This will ensure that
   * users can use the browser's back and forward buttons to navigate between
   * pages, as well as provide a good URL they can bookmark and share.
   */

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBooks, setSearchBooks] = useState([]);
  const [movedBooks, setMovedBooks] = useState([]);
  const [changedBook, setChangedBook] = useState(new Map());

  useEffect(() => {
    BooksAPI.getAll().then((data) => {
      setBooks(data);
      setChangedBook(createMappedBook(data));
    });
  }, []);

  useEffect(() => {
    let flag = true;
    if (searchQuery) {
      BooksAPI.search(searchQuery).then((data) => {
        if (data.error) {
          setSearchBooks([]);
        } else {
          if (flag) {
            setSearchBooks(data);
          }
        }
      });
    }
    return () => {
      flag = false;
      setSearchBooks([]);
    };
  }, [searchQuery]);

  useEffect(() => {
    const filteredBooks = searchBooks.map((book) => {
      if (changedBook.has(book.id)) {
        return changedBook.get(book.id);
      } else {
        return book;
      }
    });
    setMovedBooks(filteredBooks);
  }, [searchBooks]);

  const createMappedBook = (books) => {
    const map = new Map();
    books.map((book) => map.set(book.id, book));
    return map;
  };

  const changeShelf = (book, newShelf) => {
    const booksAfterUpdate = books.map((theBook) => {
      if (theBook.id === book.id) {
        book.shelf = newShelf;
        return book;
      }
      return theBook;
    });

    if (!changedBook.has(book.id)) {
      book.shelf = newShelf;
      booksAfterUpdate.push(book)
    }
    setBooks(booksAfterUpdate);
    BooksAPI.update(book, newShelf);
  };

  return (
    <div className="app">
      <Router>
        <Switch>
          {/* Search page */}
          <Route path="/search">
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/">
                  <button className="close-search">Close</button>
                </Link>
                <div className="search-books-input-wrapper">
                  {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {movedBooks.map((displayedBook) => (
                    <li key={displayedBook.id}>
                      <Book
                        bookProp={displayedBook}
                        moveToShelf={changeShelf}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Route>

          {/* Main page */}
          <Route path="/">
            <div className="list-books">
              <Header />
              <div className="list-books-content">
                <Shelves books={books} changeShelf={changeShelf} />
              </div>
              <div className="open-search">
                <Link to="/search">
                  <button>Add a book</button>
                </Link>
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default BooksApp;
