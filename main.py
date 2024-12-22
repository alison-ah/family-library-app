from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask("app")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///book.db"
db = SQLAlchemy(app)

class Book(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(80), unique=True, nullable=False)
  author = db.Column(db.String(120), nullable=False)
  call_number = db.Column(db.String(250), nullable=False)
  url = db.Column(db.String(250), nullable=True)
  date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  def __repr__(self):
    return "<Book "+ self.name + ">"

with app.app_context():
	db.create_all()
	db.session.commit()
  
@app.route("/")
def book_cards():
  return app.send_static_file("book.html")
@app.route("/add")
def add():
  return app.send_static_file("addbook.html")

@app.route("/delete")
def delete():
  return app.send_static_file("deletebook.html")

@app.route("/edit/<title>")
def edit(title):
  return app.send_static_file("editbook.html")

@app.route("/api/books/edit", methods=["POST"])
def edit_book():
  title = request.form.get("title", "")
  author = request.form.get("author", "")
  call_number = request.form.get("call_number", "")
  url = request.form.get("url", "")
  
  if not all([title, author, call_number, url]):
    return jsonify({"errors": ["All fields are required"]})
    
  book = Book.query.filter_by(title=title).first()
  if not book:
    return jsonify({"errors": ["Book not found"]})
    
  book.author = author
  book.call_number = call_number
  book.url = url
  db.session.commit()
  
  return jsonify({"status": "success"})

@app.route("/api/books/search", methods=["GET"])
def search_books():
  query = request.args.get("q", "").lower()
  books = Book.query.all()
  data = []
  for book in books:
    if query in book.title.lower() or query in book.author.lower():
      data.append({
        "title": book.title,
        "author": book.author,
        "call_number": book.call_number,
        "url": book.url,
        "date_added": book.date_added
      })
  return jsonify(data)

@app.route("/api/books/", methods=["GET"]) 
def get_books():
  books=Book.query.all()
  data = []
  for book in books:
    data.append({
      "title": book.title,
      "author": book.author,
      "call_number": book.call_number,
      "url": book.url,
      "date_added": book.date_added
    })
  return jsonify(data)

@app.route("/api/books/add", methods=["POST"])
def add_book():
  errors = []
  title = request.form.get("title", "")

  if not title:
    errors.append("Oops! Looks like you forgot a title!")

  author = request.form.get("author", "")
  if not author:
    errors.append("Oops! Looks like you forgot an author!")
  
  call_number = request.form.get("call_number", "")
  if not call_number:
    errors.append("Oops! Looks like you forgot the Call No.!")
  
  url = request.form.get("url", "")
  if not url:
    errors.append("Oops! Looks like you forgot an image!")
  
  book = Book.query.filter_by(title=title).first()
  if book:
    errors.append("Oops! A book with that title already exists!")
  
  if errors:
    return jsonify({"errors": errors})
  else:
    new_book = Book(title=title, author=author, call_number=call_number, url=url)
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"status": "success"})

@app.route("/api/books/delete", methods=["POST"])
def delete_book():
  title = request.form.get("title", "")
  book = Book.query.filter_by(title=title).first()
  if book:
    db.session.delete(book)
    db.session.commit()
    return jsonify({"status": "success"})
  else:
    return jsonify({"errors": ["Oops! A book with that title doesn't exist!"]})

@app.route("/api/", methods=["GET"])
def get_endpoints():
  endpoints = {
    "/api/books/": "GET - Retrieves all book data from the database",
    "/api/books/add": "POST - Adds a new book to the database",
    "/api/books/delete": "POST - Deletes a book from the database"
  }
  return jsonify(endpoints)

app.run(host='0.0.0.0', port=8080)