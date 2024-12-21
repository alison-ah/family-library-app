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
  const defaultImage = "https://www.iconpacks.net/icons/2/free-opened-book-icon-3169-thumb.png";
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