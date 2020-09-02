$(document).ready(function () {
  // all'ingresso del sito viene fornita una lista di film popolari questa settimana
  trendMoviesHomePage();
  // animazione poput e chiusura input al click della lente
  popSearch();
  // funzione per cercare in automatico mentre scrivi
  $(".search_movie").keyup(function () {
    var urlSearch = "https://api.themoviedb.org/3/search/movie";
    var titolo = $(".search_movie").val();
    if ($(this).val().length != 0) {
      cercaFilm(titolo, urlSearch);
    } else {
      trendMoviesHomePage();
    }
  });
});
// funzione ricerca Api che richiama la funzione che compila il template
function cercaFilm(titolo, url) {
  // svuoto ricerce se ce ne sono
  if ($(".movies__container-info").length > 0) {
    $(".container").empty();
  }
  // api
  $.ajax({
    url: url,
    method: "GET",
    data: {
      api_key: "911c39a0e26befb8fde97cb0a1c177cd",
      query: titolo,
      language: "it-IT",
      include_adult: true,
    },
    success: function (risposta) {
      // se ci sono risposte fa la funzione
      if (risposta.results.length != 0) {
        compileHandlebar(risposta.results);
      } else {
        $(".not-found").text(
          "Nessun risultato trovato per la ricerca di" +
            '"' +
            titolo +
            '"' +
            "prova con parole chiave diverse"
        );
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
    var rating = Math.round(risp[i].vote_average / 2);
    var context = {
      titolo: risp[i].title,
      titoloOriginale: risp[i].original_title,
      lang: risp[i].original_language,
      rating: rating,
    };
    var html = template(context);
    $(".container").append(html);
  }
}
// function homepage popular movies
function trendMoviesHomePage() {
  PopularThisWeek = "https://api.themoviedb.org/3/trending/movie/week";
  var titolo = "";
  cercaFilm(titolo, PopularThisWeek);
}
////////// animazioni//////////////////////////
function popSearch() {
  $(".search_movie__btn").click(function () {
    $(".search_movie").toggleClass("search-full");
    if($(this).hasClass('fa-times')){
      trendMoviesHomePage();
      $(".search_movie").val('');
    }
    if ($(this).hasClass("fa-search") == true) {
      $(this).removeClass("fa-search");
      $(this).addClass("fa-times");
      $('.search_movie').focus();
    } else {
      $(this).addClass("fa-search");
      $(this).removeClass("fa-times");
    }
  });
  //////scroll 
  $(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
      $('.header').removeClass('header-darker');
    }
    else {
      $('.header').addClass('header-darker');
    }
});
}
