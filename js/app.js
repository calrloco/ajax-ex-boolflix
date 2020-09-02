$(document).ready(function () {
  // richiamo funzione ricerca al click 
  $(".search_movie__btn").click(function () {
    var titolo = $(".search_movie").val();
    $(".search_movie").val("");
    cercaFilm(titolo);
  });
  // richiamo funzione ricerca con invio sulla keybord
  $(".search_movie").keypress(function (event) {
    var titolo = $(".search_movie").val();
    if (event.which === 13 || event.keyCode === 13) {
      $(".search_movie").val("");
      cercaFilm(titolo);
    }
  });
});
// funzione ricerca Api che richiama la funzione che compila il template
function cercaFilm(titolo) {
  // svuoto ricerce se ce ne sono 
  if($(".movies__container-info").length > 0){
    $(".container").empty();
  }
  // api 
  $.ajax({
    url: "https://api.themoviedb.org/3/search/movie",
    method: "GET",
    data: {
      api_key: "911c39a0e26befb8fde97cb0a1c177cd",
      query: titolo,
      language: "it-IT",
    },
    success: function (risposta) {
      compileHandlebar(risposta.results);
    },
    error: function () {
      alert("Si e verificato un errore :( riprova piu tardi");
    },
  });
}
// funzione per compilare template
function compileHandlebar(risp) {
  for (i = 0; i < risp.length; i++) {
    var source = $("#movie_container").html();
    var template = Handlebars.compile(source);
    var context = {
      titolo: risp[i].title,
      titoloOriginale: risp[i].original_title,
      lang: risp[i].original_language,
      rating: risp[i].vote_average,
    };
    var html = template(context);
    $(".container").append(html);
  }
}
