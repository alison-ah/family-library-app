$(document).ready(() => {
  document.getElementById('form').onsubmit = handleAddForm;
});

function handleAddForm(event){
  event.preventDefault();

  var title = $("input[name='title']").val();
  var author = $("input[name='author']").val(); 
  var callNo = $("input[name='call_number']").val();
  var url = $("input[name='url']").val();

  $.post("/api/books/add", {
    "title": title,
    "author": author,
    "call_number": callNo,
    "url": url,
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