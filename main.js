document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  });

const books = [];
console.log(books);
const RENDER_EVENT = 'render-book';

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const Iscomplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, Iscomplete);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData()

}

function generateId() {
  return +new Date();
}

 

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year:parseInt(year),
    isComplete
  }

}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if(bookItem.isComplete){
        completedBookList.append(bookElement)
      }else{
        uncompletedBookList.append(bookElement)
      }
  }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText =("Penulis: " + bookObject.author);

    const textYear = document.createElement('p');
    textYear.innerText = ("Tahun: " + bookObject.year);

    const Container = document.createElement('article');
    Container.classList.add('book_item');
    Container.append(textTitle, textAuthor, textYear);

    if(bookObject.isComplete){
      const finishButton = document.createElement('button')
      finishButton.classList.add('green')
      finishButton.innerText = ('Belum Selesai Dibaca')

      const Delete = document.createElement('button');
      Delete.classList.add('red');
      Delete.innerText = ('Hapus Buku');

      Delete.addEventListener('click', function() {
        removeBookFromCompleted(bookObject.id)
      })

      const action = document.createElement('div');
      action.classList.add('action');
      action.append(finishButton, Delete);

      finishButton.addEventListener('click', function() {
        undoBookFromCompleted(bookObject.id)
      })
      
      Container.append(action)
    }else {
      const unButton = document.createElement('button')
      unButton.classList.add('green')
      unButton.innerText = ('Selesai di Baca')

      const Delete = document.createElement('button');
      Delete.classList.add('red');
      Delete.innerText = ('Hapus Buku');

      Delete.addEventListener('click', function() {
        removeBookFromCompleted(bookObject.id)
      })

      const action = document.createElement('div');
      action.classList.add('action');
      action.append(unButton, Delete);

      unButton.addEventListener('click', function() {
        addbookToCompleted(bookObject.id)
      })
      
      Container.append(action)
    }

    return Container;
  }

  function addbookToCompleted (bookId) {
    const bookTarget = findbook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findbook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function removeBookFromCompleted(bookId) {
    const bookTarget = findbook(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoBookFromCompleted(bookId) {
    const bookTarget = findbook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}