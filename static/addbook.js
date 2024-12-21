$(document).ready(() => {
  document.getElementById('form').onsubmit = handleAddForm;
});

function handleAddForm(event){
  event.preventDefault();

  var name = $("input[name='author']").val();
  var description = $("input[name='title']").val(); 
  var interests = $("input[name='call-number']").val();
  var url = $("input[name='url']").val();

  $.post("/api/books/add", {
    "name": name,
    "description": description,
    "interests": interests,
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