$(document).ready(function () {
  // all'ingresso del sito viene fornita una lista di film popolari questa settimana
  trendMoviesHomePage();
  // animazione poput e chiusura input al click della lente
  popSearch();
  // funzione per cercare in automatico mentre scrivi
  $(".logo__img").click(trendMoviesHomePage);
  $(".search_movie").keyup(function () {
    var urlSearch = "https://api.themoviedb.org/3/search/multi";
    var titolo = $(".search_movie").val();
    if ($(this).val().length != 0) {
      cercaFilm(titolo, urlSearch);
    } else {
      trendMoviesHomePage();
    }
  });
  /// film popolari al click del tasto trend mocies sulla nav;
  $(".trending").click(trendMoviesHomePage);
});
// funzione ricerca Api che richiama la funzione che compila il template
function cercaFilm(titolo, url) {
  // svuoto ricerce se ce ne sono
  if ($(".movies__container-info").length > 0) {
    $(".container").empty();
    $(".container").append('<p class="not-found"></p>');
  }
  // api
  $.ajax({
    url: url,
    method: "GET",
    data: {
      api_key: "911c39a0e26befb8fde97cb0a1c177cd",
      query: titolo,
      language: "it-IT",
      include_adult: false,
    },
    success: function (risposta) {
      // se ci sono risposte fa la funzione
      if (risposta.results.length != 0) {
        $(".not-found").hide();
        compileHandlebar(risposta.results);
      } else {
        $(".not-found").text(
          "Nessun risultato trovato per la ricerca di" +
            '"' +
            titolo +
            '"' +
            "prova con parole chiave diverse."
        );
      }
    },
    error: function () {
      alert("Si e verificato un errore :( riprova piu tardi");
    },
  });
}
/// funxione per inserie gli attori nella card
function cercaCast(url, id) {
  // api
  $.ajax({
    url: url,
    method: "GET",
    data: {
      api_key: "911c39a0e26befb8fde97cb0a1c177cd",
    },
    success: function (risposta) {
      // se ci sono risposte fa la funzione
      var cast = "";
      if (risposta.cast.length != 0) {
        for (var i = 0; i < 3; i++) {
          if (i <= 1) {
            cast += " " + risposta.cast[i].name + ", ";
          } else {
            cast += " " + risposta.cast[i].name + ".";
          }
        }
        $(".cast")
          .find("[data-cast='" + id + "']")
          .append(cast);
      } else {
        cast = "Non ci sono informazioni";
      }
    },
    error: function () {
      console.log(arguments);
    },
  });
}
// funzione per compilare template
function compileHandlebar(risp) {
  var titolo;
  var titoloOriginale;
  var source = $("#movie_container").html();
  var template = Handlebars.compile(source);
  for (i = 0; i < risp.length; i++) {
    var filmId = risp[i].id;
    var urlCast = "https://api.themoviedb.org/3/movie/" + filmId + "/credits";
    if (risp[i].media_type != "person") {
      if (risp[i].media_type == "tv") {
        titolo = risp[i].name;
        titoloOriginale = risp[i].original_name;
      } else if (risp[i].media_type == "movie") {
        titolo = risp[i].title;
        titoloOriginale = risp[i].original_title;
      }
      var rating = risp[i].vote_average;
      var lingua = risp[i].original_language;
      var posterPrefix = "https://image.tmdb.org/t/p/w342";
      var context = {
        titolo: titolo,
        titoloOriginale: titoloOriginale,
        lang: nationFlag(lingua),
        rating: addStar(rating),
        poster: posterPrefix + risp[i].poster_path,
        overview: troncaStringa(risp[i].overview),
        cast: filmId,
        media: risp[i].media_type,
      };
      var html = template(context);
      $(".container").append(html);
      //cercacast
      cercaCast(urlCast, filmId);
    }
  }
  function compileGenre(){

  }
  brokenImg();
  // alla fine del ciclo con la prima chiamta ajax cerca il cast con la seconda chiamata per il cast
}
//// funzioni per filtrare la ricerca fatta tra film e serie tv
$(".nav__menu__list-items.film").click(function () {
  $("[data-media='" + "tv" + "']").hide();
});
$(".nav__menu__list-items.serie").click(function () {
  $("[data-media='" + "movie" + "']").hide();
});
// function homepage popular movies
function trendMoviesHomePage() {
  PopularThisWeek = "https://api.themoviedb.org/3/trending/movie/week";
  var titolo = "";
  cercaFilm(titolo, PopularThisWeek);
}
// aggiungistella
function addStar(rat) {
  var voto = rat / 2;
  var resto = rat % 2;
  var stars = "";
  for (var i = 0; i < 5; i++) {
    if (i <= voto) {
      var star = '<i class="fas fa-star rating yellow"></i>';
    } else if (resto != 0) {
      var star = '<i class="fas fa-star-half-alt yellow"></i>';
      resto = 0;
    } else {
      var star = '<i class="far fa-star rating yellow"></i>';
    }
    stars += star;
  }
  return stars;
}
// ritorna bandiera
function nationFlag(lingua) {
  if (lingua == "en") {
    lingua =
      "<img src='https://svgshare.com/i/PHa.svg' alt=\"UK-flag\" class=\"flags\" title='' />";
  } else if (lingua == "it") {
    lingua =
      "<img src='https://svgshare.com/i/PGP.svg'' alt=\"IT-flag\" class=\"flags\" title=''/>";
  }
  return lingua;
}
/// broken image sostituzione//////////////
function brokenImg() {
  $("img.poster").on("error", function () {
    this.src = "https://i.ibb.co/hKqm2mZ/Untitled-1.png";
  });
}
/////////// tronca stringa ////////////////////
function troncaStringa(stringa) {
  var shortText = "";
  for (var i = 0; i < stringa.length; i++) {
    if (stringa[i] == " " && i < 200) {
      var shortText = $.trim(stringa).substring(0, i) + "...";
    }
  }
  return shortText;
}
////////// animazioni//////////////////////////
function popSearch() {
  $(".search_movie__btn").click(function () {
    $(".search_movie").toggleClass("search-full");
    if ($(this).hasClass("fa-times")) {
      trendMoviesHomePage();
      $(".search_movie").val("");
    }
    if ($(this).hasClass("fa-search") == true) {
      $(this).removeClass("fa-search");
      $(this).addClass("fa-times");
      $(".search_movie").focus();
    } else {
      $(this).addClass("fa-search");
      $(this).removeClass("fa-times");
    }
  });
  //////scroll cabio bg-color nav///////////
  $(window).bind("mousewheel", function (event) {
    if (event.originalEvent.wheelDelta >= 0) {
      $(".nav").removeClass("nav-darker");
    } else {
      $(".nav").addClass("nav-darker");
    }
  });
}
