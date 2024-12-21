$.get("/api/", function(data){
  console.log(data)
})

$.get("/api/books/", function(data){
  for (let i in data){
    $(".content").append('<div class="card"><h2 class="card-name">' + data[i].title + '</h2><img src="' + data[i].url + '" class="card-image"/><div class="card-body"><p class="card-description">' + '<h3>' + data[i].author + '</h3>' + '<h4>Find it on the shelf</h4><p class="card-details">' + data[i].call_number + '</p><p class="card-date-added">Date added: ' + data[i].date_added + '</p></div></div>')
  }
})