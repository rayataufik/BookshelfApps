const books = [];
const RENDER_EVENT = "render-Bookshelf";
const SAVED_EVENT = 'saved-Bookshelf';
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("input-buku");

function isStorageExist() {
   if (typeof Storage === "undefined") {
      alert("Maaf, Browser anda tidak mendukung web storage. Silahkan gunakan Browser yang lainnya");
      return false;
   }
   return true;
}

const generateId = () => +new Date();

const generateBookItem = (id, title, author, year, isComplete) => {
   return {
      id,
      title,
      author,
      year: parseInt(year),
      isComplete,
   };
};

function findBook(bookId) {
   for (const book of books) {
      if (book.id === bookId) {
         return book;
      }
   }
   return null;
}

function findBookIndex(bookId) {
   for (const index in books) {
      if (books[index].id == bookId) {
         return index;
      }
   }
   return null;
}

function addBook() {
   const title = document.getElementById("title").value;
   const author = document.getElementById("author").value;
   const year = document.getElementById("year").value;
   const isComplete = checkStatusBook();

   const id = generateId();
   const newBook = generateBookItem(id, title, author, year, isComplete);

   books.push(newBook);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function checkStatusBook() {
   const isCheckComplete = document.getElementById("inlineFormCheck");
   return isCheckComplete.checked;
}

function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
   }
}

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      books.push(...data);
   }
   document.dispatchEvent(new Event(RENDER_EVENT));
}

function showBooks() {
   const belumDibaca = document.getElementById("belumDibaca");
   const selesaiDibaca = document.getElementById("selesaiDibaca");

   belumDibaca.innerHTML = "";
   selesaiDibaca.innerHTML = "";

   books.forEach((book) => {
      const buttonLabel = book.isComplete ? "Baca Lagi" : "Selesai Baca";
      const el = `
      <div class="card mb-3">
         <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">Penulis: ${book.author}</p>
            <p class="card-text">Tahun Terbit: ${book.year}</p>
         </div>
         <div class="card-footer">
            <div class="row">
               <div class="col-3">
                  <button class="btn btn-success" onclick="changeBookStatus(${book.id})">${buttonLabel}</button>
               </div>
               <div class="col-2">
                  <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal-${book.id}">Hapus</button>
               </div>
            </div>
         </div>
      </div>

      <section id="modal">
            <div class="modal fade" id="deleteModal-${book.id}" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="deleteModalLabel">Hapus Buku</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Apakah Kamu Yakin Ingin Menghapus Buku Ini?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tidak</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="removeBook(${book.id})">Ya</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      `;

      if (book.isComplete) {
         selesaiDibaca.innerHTML += el;
      } else {
         belumDibaca.innerHTML += el;
      }
   });
}


function changeBookStatus(bookId) {
   const index = findBookIndex(bookId);
   if (index !== null) {
      books[index].isComplete = !books[index].isComplete;
      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
   }
}

function removeBook(bookId) {
   const index = findBookIndex(bookId);
   if (index !== null) {
      books.splice(index, 1);
      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
   }
}

document.addEventListener("DOMContentLoaded", function () {
   form.addEventListener("submit", function (e) {
      e.preventDefault();
      addBook();
      form.reset();
   });

   if (isStorageExist()) {
      loadDataFromStorage();
   }
});

document.addEventListener(RENDER_EVENT, showBooks);