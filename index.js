const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const app = express();
const Book = require("./models/books.model");
app.use(express.json());
initializeDatabase();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
const PORT = 5000;
app.listen(PORT,()=> {
    console.log("successfully connected to", PORT);
})
const readAllBooks = async() => {
    try{
        const allBooks = await Book.find();
        console.log(allBooks);
        return allBooks;
    }catch(error){
            throw error;
    }
}
app.get("/books", async(req,res)=> {
    try{
         const books = await readAllBooks()
    if(books.length !=0){
      res.json(books)
    }else{
      res.status(404).json({error:"No Books found"})
    }
    }catch(error){
         
        res.status(500).json({error:"Not able to get books"})
    }
})
const saveBooks = async(newBook) => {
    try{
        const book = Book(newBook);
        const saveBook = await book.save();
        return saveBook
    }catch(error){
        throw error
    }
}
app.post("/books", async(req,res) => {
    try{
        const savedBooks = await saveBooks(req.body);
        res.status(201).json({message:"Book added successfully", book:savedBooks})
    }catch(error){
           res.status(500).json({error:"Failed to add movie"})
    }
})
const getBooksByTitle = async(title) => {
    try{
            const getTitle = await Book.findOne({title:title})
            return getTitle
    }catch(error){
        console.log("Error in fetching book", error)
    }
}
app.get("/books/:title", async(req,res) =>{
    try{
        const getBook = await getBooksByTitle(req.params.title)
        if(getBook){
            res.status(200).json({message:"Book found", book: getBook})
        }else{
            res.status(404).json({error:"No Book found by this title"})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch books"})
    }
})
const getBooksByAuthor = async(author) => {
    try{
            const getAuthor = await Book.find({author:author})
            return getAuthor
    }catch(error){
        console.log("Error in fetching book", error)
        throw error;
    }
}
app.get("/books/author/:author", async(req,res) =>{
    try{
        const getBookByAuthor = await getBooksByAuthor(req.params.author)
        if(getBookByAuthor.length != 0){
            res.status(200).json({message:"Book found", book: getBookByAuthor})
        }else{
            res.status(404).json({error:"No Book found by this title"})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch books"})
    }
})
const getBooksByGenre = async (genre) => {
  try {
   
    const books = await Book.find({ genre: genre });
    return books;
  } catch (error) {
    console.error("Error fetching books by genre:", error);
    throw error;
  }
};

app.get("/books/genre/:genre", async (req, res) => {
  try {
    const genre = req.params.genre;
    const books = await getBooksByGenre(genre);

    if (books.length > 0) {
      res.status(200).json({ message: "Books found", books });
    } else {
      res.status(404).json({ error: `No books found for genre ${genre}` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by genre" });
  }
});
const getBooksByYear = async (year) => {
  try {
    const books = await Book.find({ publishedYear: year });
    return books;
  } catch (error) {
    console.error("Error fetching books by year:", error);
    throw error;
  }
};

app.get("/books/year/:year", async (req, res) => {
  try {
    const year = Number(req.params.year);
    const books = await getBooksByYear(year);

    if (books.length > 0) {
      res.status(200).json({ message: "Books found", books });
    } else {
      res.status(404).json({ error: `No books found for year ${year}` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by year" });
  }
});
const updateBookRatingById = async(dataId, dataToUpdate) => {
    try{
        const updateRating = await Book.findByIdAndUpdate(dataId,dataToUpdate,{new:true});
        return updateRating
    }catch(error){
        throw error;
    }
}
app.post("/books/update/:bookId", async(req,res)=> {
    try{
        const updatedRating = await updateBookRatingById(req.params.bookId,req.body)
         if(updatedRating){
      res.status(200).json({message:"Rating updated", book: updatedRating})
    }else{
      res.status(404).json({message:"Rating not updated"})
    }
    }catch(error){
        console.log(error)
          res.status(500).json({ error: "Failed to update Rating" });
    }
})
const updateBookByTitle = async (bookTitle, dataToUpdate) => {
  try{
    const updatedBookTitle = await Book.findOneAndUpdate({title:bookTitle}, dataToUpdate, {new:true})
    console.log("Updated Title", updatedBookTitle)
    return updatedBookTitle
  }catch(error){
    console.log("Error occured while updating Book Name")
  }
}
app.post("/books/:title", async (req, res) => {
  try {
    const updateBook = await updateBookByTitle(req.params.title, req.body);

    if (updateBook) {
      res.status(200).json({ message: "Book updated", book: updateBook });
    } else {
      res.status(404).json({ message: "Book not updated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Book" });
  }
});

const deleteBookById = async (bookId) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    console.error("Error while deleting book:", error);
    throw error;
  }
};


app.delete("/books/delete/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId);

    if (deletedBook) {
      res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
      });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});
