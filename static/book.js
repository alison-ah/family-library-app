$(document).ready(function() {
  $.get("/api/books/", displayBooks);
  
  $("#searchInput").on("keyup", function() {
    const query = $(this).val();
    if(query) {
      $.get("/api/books/search?q=" + query, displayBooks);
    } else {
      $.get("/api/books/", displayBooks);
    }
  });
});

$.get("/api/", function(data){
  console.log(data);
});

function displayBooks(data) {
  $(".content").empty();
  for (let i in data){
    $(".content").append('<div class="card"><h2 class="card-name">' + data[i].title + '</h2><div class="card-actions"><a href="/edit/' + data[i].title + '" class="edit-btn"><i class="fas fa-edit"></i></a><button onclick="deleteCard(\'' + data[i].title + '\')" class="delete-btn"><i class="fas fa-trash"></i></button></div><img src="' + data[i].url + '" class="card-image"/><div class="card-body"><p class="card-description">' + '<h3>' + data[i].author + '</h3>' + '<h4>Find it on the shelf</h4><p class="card-details">' + data[i].call_number + '</p><p class="card-date-added">Date added: ' + data[i].date_added + '</p></div></div>');
  }
}
function deleteCard(title) {
  Swal.fire({
    text: 'Are you sure you want to delete this book? This action cannot be undone.',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3b3b3b',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      $.post("/api/books/delete", {
        "title": title
      }, function(data) {
        if (data.errors !== undefined) {
          Swal.fire('Error', data.errors.join('\n'), 'error');
        } else {
          window.location.reload();
        }
      });
    }
  });
}