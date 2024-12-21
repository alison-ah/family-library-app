$(document).ready(() => {
  document.getElementById('form').onsubmit = handleAddForm;
});

function handleAddForm(event){
  event.preventDefault();

  var title = $("input[name='title']").val();
  var author = $("input[name='author']").val(); 
  var call_number = $("input[name='call_number']").val();
  var url = $("input[name='url']").val();

  // Set default image URL if none provided
  const defaultImage = "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781787550360/classic-book-cover-foiled-journal-9781787550360_hr.jpg";
  const imageUrl = url.trim() === "" ? defaultImage : url;

  $.post("/api/books/add", {
    "title": title,
    "author": author,
    "call_number": call_number,
    "url": imageUrl,
    "date_added": new Date()
  }, function(data){
    if (data.errors !== undefined) {
      document.getElementById("errors").innerHTML = data.errors.map((error) => (`<div class="error">${error}</div>`)).join("");
    } else {
      window.location = "/";
    }
  })

  return false;
}