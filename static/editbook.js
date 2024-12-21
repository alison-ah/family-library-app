
$(document).ready(() => {
  const title = window.location.pathname.split('/').pop();
  $.get("/api/books/", function(data) {
    const book = data.find(b => b.title === decodeURIComponent(title));
    if (book) {
      $("input[name='title']").val(book.title);
      $("input[name='author']").val(book.author);
      $("input[name='call_number']").val(book.call_number);
      $("input[name='url']").val(book.url);
    }
  });

  document.getElementById('form').onsubmit = handleEditForm;
});

function handleEditForm(event) {
  event.preventDefault();
  var title = $("input[name='title']").val();
  var author = $("input[name='author']").val();
  var call_number = $("input[name='call_number']").val();
  var url = $("input[name='url']").val();

  $.post("/api/books/edit", {
    "title": title,
    "author": author,
    "call_number": call_number,
    "url": url
  }, function(data) {
    if (data.errors !== undefined) {
      document.getElementById("errors").innerHTML = data.errors.map((error) => (`<div class="error">${error}</div>`)).join("");
    } else {
      window.location = "/";
    }
  });
  return false;
}
