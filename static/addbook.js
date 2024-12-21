$(document).ready(() => {
  document.getElementById('form').onsubmit = handleAddForm;
});

function handleAddForm(event){
  event.preventDefault();

  var author = $("input[name='author']").val();
  var title = $("input[name='title']").val();
  var call-number = $("input[name='call-number']").val();
  var url = $("input[name='url']").val();

  $.post("/api/books/add", {
    "author":author,
    "title":title,
    "call-number":call-number,
    "url":url,
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