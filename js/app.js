$(document).ready(function () {
  // funzione per cercare in automatico mentre scrivi
  $(".search_movie").keyup(function () {
    if ($(this).val().length != 0) {
      cercaFilm();
    }else{
      $(".container").empty();
    }
  });
});
// funzione ricerca Api che richiama la funzione che compila il template
function cercaFilm() {
  var titolo = $(".search_movie").val();
  // svuoto ricerce se ce ne sono
  if ($(".movies__container-info").length > 0) {
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
      // se ci sono risposte fa la funzione
      if (risposta.results.length != 0) {
        compileHandlebar(risposta.results);
      }else{
        $('.not-found').text('Nessun risultato trovato per la ricerca di'+'"'+titolo+'"'+
        'prova con parole chiave diverse');
      }
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
