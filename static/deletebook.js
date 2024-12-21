$(document).ready(() => {
  document.getElementById('form').onsubmit = handleDeleteForm;
});

function handleDeleteForm(event){
  event.preventDefault();
  var title = $("input[name='title']").val();
  $.post("/api/books/delete", {
    "title":title
  }, function(data){
    if (data.errors !== undefined) {
      document.getElementById("errors").innerHTML = data.errors.map((error) => (`<div class="error">${error}</div>`)).join("");
    } else {
      window.location = "/";
    }
  });
  return false;
}