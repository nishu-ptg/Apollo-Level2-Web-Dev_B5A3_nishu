# Library Management API

## Project Overview

This project implements a robust Library Management System API using **Express.js**, **TypeScript**, and **MongoDB** with **Mongoose**. It provides a comprehensive set of endpoints for managing books and tracking their borrowing status, adhering to strict validation rules and best practices in API design.

The system incorporates:

- **Proper Schema Validation:** Utilizing both Zod for request body validation and Mongoose schema validators for database-level integrity.
- **Business Logic Enforcement:** Automatic availability control for books based on `copies` count.
- **MongoDB Aggregation Pipeline:** For generating insightful summaries of borrowed books.
- **Mongoose Middleware:** Leveraging `pre('save')` and `pre('findOneAndUpdate')` hooks to ensure data consistency.
- **Filtering Features:** For efficient retrieval of books based on criteria like genre.

---

## Features

### Book Management

1.  **Create Book** (`POST /api/books`): Add new book records to the library.
2.  **Get All Books** (`GET /api/books`): Retrieve a list of all books with support for filtering by genre and sorting options.
3.  **Get Book by ID** (`GET /api/books/:bookId`): Fetch details for a specific book.
4.  **Update Book** (`PATCH /api/books/:bookId`): Modify existing book details (e.g., update copies).
5.  **Delete Book** (`DELETE /api/books/:bookId`): Remove a book record from the system.

### Borrowing Management

6.  **Borrow a Book** (`POST /api/borrow`): Record a book borrowing event, updating book copy counts and availability.
7.  **Borrowed Books Summary** (`GET /api/borrow`): Generate an aggregated summary of borrowed books, showing total quantities borrowed per book and their details.

---

## Technologies Used

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ORM:** Mongoose
- **Validation:** Zod (for request body validation), Mongoose built-in validators
- **Environment Variables:** `dotenv`

---

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/nishu-ptg/Apollo-Level2-Web-Dev_B5A3_nishu.git
    cd Apollo-Level2-Web-Dev_B5A3_nishu
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file:**
    Copy the `.env.example` file and rename it to `.env`.

    ```bash
    cp .env.example .env
    ```

4.  **Configure Environment Variables:**
    Open the `.env` file and update the following:

    ```env
    PORT=3000
    DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname

    # Replace with your MongoDB connection string
    # e.g., MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/libraryDB?retryWrites=true&w=majority"
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The API server should now be running, typically on `http://localhost:3000`.

---

## API Endpoints

All API endpoints are prefixed with `/api`.

### 1. Create Book

**`POST /api/books`**

- **Description:** Creates a new book record.
- **Request Body:**
  ```json
  {
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Book created successfully",
    "data": { ...book_object... }
  }
  ```

### 2. Get All Books

**`GET /api/books`**

- **Description:** Retrieves a list of all books with filtering and sorting capabilities.
- **Query Parameters:**
  - `filter` (optional): Filter by book genre (e.g., `?filter=FANTASY`). Must be one of the defined `Genre` enums.
  - `sortBy` (optional): Field to sort by (e.g., `createdAt`, `title`, `author`). Default: `createdAt`.
  - `sort` (optional): Sort order (`asc` or `desc`). Default: `asc`.
  - `limit` (optional): Maximum number of results to return. Default: `10`.
- **Example Query:** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Books retrieved successfully",
    "data": [ ...array_of_book_objects... ]
  }
  ```

### 3. Get Book by ID

**`GET /api/books/:bookId`**

- **Description:** Retrieves details of a single book by its ID.
- **Path Parameters:** `:bookId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Book retrieved successfully",
    "data": { ...single_book_object... }
  }
  ```

### 4. Update Book

**`PATCH /api/books/:bookId`**

- **Description:** Updates one or more fields of an existing book.
- **Path Parameters:** `:bookId` (MongoDB ObjectId)
- **Request Body:** (Partial update, any valid book field is optional)
  ```json
  {
    "copies": 50,
    "description": "Updated description."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Book updated successfully",
    "data": { ...updated_book_object... }
  }
  ```

### 5. Delete Book

**`DELETE /api/books/:bookId`**

- **Description:** Deletes a book record by its ID.
- **Path Parameters:** `:bookId` (MongoDB ObjectId)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Book deleted successfully",
    "data": null
  }
  ```

### 6. Borrow a Book

**`POST /api/borrow`**

- **Description:** Records a book borrowing event. Decrements available copies and updates book availability.
- **Business Logic:**
  - Verifies sufficient available copies.
  - Deducts `quantity` from `book.copies`.
  - Automatically sets `book.available` to `false` if `book.copies` becomes `0` (handled by Mongoose middleware).
  - Saves the borrow record.
- **Request Body:**
  ```json
  {
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Book borrowed successfully",
    "data": { ...borrow_record_object... }
  }
  ```

### 7. Borrowed Books Summary

**`GET /api/borrow`**

- **Description:** Provides an aggregated summary of borrowed books.
- **Details:** Uses a MongoDB aggregation pipeline to group borrow records by book, sum the total quantity borrowed for each, and include relevant book details (`title`, `isbn`).
- **Response:**
  ```json
  {
    "success": true,
    "message": "Borrowed books summary retrieved successfully",
    "data": [
      {
        "book": {
          "title": "The Theory of Everything",
          "isbn": "9780553380163"
        },
        "totalQuantity": 5
      },
      {
        "book": {
          "title": "1984",
          "isbn": "9780451524935"
        },
        "totalQuantity": 3
      }
    ]
  }
  ```

---

## Validation Strategy

This API employs a dual-layer validation strategy for robust data integrity:

- **Zod (Request Body Validation):**

  - **Purpose:** Ensures incoming request bodies conform to expected types, presence, and basic format constraints _before_ interacting with the database.
  - **Location:** Defined in `src/validators/` and used in route handlers.
  - **Benefits:** Provides early feedback to clients, improves API reliability, and reduces unnecessary database operations.
  - **Specifics:** Uses `.nonempty()` for required strings, `.min()`/`.nonnegative()` for numbers, and `z.nativeEnum()` for enums. Separate schemas (`bookSchema` for creation, `bookUpdateSchema` for updates) are used to correctly handle optional fields in `PATCH` requests.

- **Mongoose (Schema Validation & Database Integrity):**
  - **Purpose:** Enforces schema rules directly at the database level, serving as a final safeguard. Catches any data inconsistencies that might bypass the API layer (e.g., direct database operations).
  - **Location:** Defined directly within `src/models/*.model.ts` schemas.
  - **Benefits:** Guarantees data integrity in the MongoDB collection, particularly for `unique` constraints and complex custom validators.

---

## Live Deployment & Submission

- **GitHub Repository:** https://github.com/nishu-ptg/Apollo-Level2-Web-Dev_B5A3_nishu
- **Live Deployment:** https://apollo-level2-web-dev-b5-a3-nishu.vercel.app/
- **Video Explanation:** TODO
