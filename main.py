from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask("app")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///book.db"
db = SQLAlchemy(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)
    interests = db.Column(db.String(250), nullable=False)
    url = db.Column(db.String(250), nullable=False)
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

@app.route("/api/books/", methods=["GET"])
def get_books():
  books=book.query.all()
  data = []
  for book in books:
    data.append({
      "name": book.name,
      "description": book.description,
      "interests": book.interests,
      "url": book.url,
      "date_added": book.date_added
    })
  return jsonify(data)

@app.route("/api/books/add", methods=["POST"])
def add_book():
  errors = []
  name = request.form.get("name", "")

  if not name:
    errors.append("Oops! Looks like you forgot a name!")

  description = request.form.get("description", "")
  if not description:
    errors.append("Oops! Looks like you forgot a description!")
  
  interests = request.form.get("interests", "")
  if not interests:
    errors.append("Oops! Looks like you forgot some interests!")
  
  url = request.form.get("url", "")
  if not url:
    errors.append("Oops! Looks like you forgot an image!")
  
  book = Book.query.filter_by(name=name).first()
  if book:
    errors.append("Oops! A book with that name already exists!")
  
  if errors:
    return jsonify({"errors": errors})
  else:
    new_book = Book(name=name, description=description, interests=interests, url=url)
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"status": "success"})

@app.route("/api/books/delete", methods=["POST"])
def delete_book():
  name = request.form.get("name", "")
  book = Book.query.filter_by(name=name).first()
  if book:
    db.session.delete(book)
    db.session.commit()
    return jsonify({"status": "success"})
  else:
    return jsonify({"errors": ["Oops! A book with that name doesn't exist!"]})

@app.route("/api/", methods=["GET"])
def get_endpoints():
  endpoints = {
    "/api/books/": "GET - Retrieves all book data from the database",
    "/api/books/add": "POST - Adds a new book to the database",
    "/api/books/delete": "POST - Deletes a book from the database"
  }
  return jsonify(endpoints)

app.run(host='0.0.0.0', port=8080)