$(document).ready(function(){
  $('.search_movie__btn').click(function(){
     $('.container').empty();
     var titolo = $('.search_movie').val();
     $('.search_movie').val('');
     cercaFilm(titolo);
  });
});
function cercaFilm (titolo){
  $.ajax({
    url: "https://api.themoviedb.org/3/search/movie",
    method: "GET",
    data : {
        api_key : "911c39a0e26befb8fde97cb0a1c177cd",
        query: titolo,
        language: 'it-IT'
    },
    success: function (risposta){
      compileHandlebar(risposta.results);
      
    },
    error: function (){
        alert('Si e verificato un errore :( riprova piu tardi');
    },
  });
}
function compileHandlebar(risp){
  for (i=0;i<risp.length;i++){
   var source = $('#movie_container').html();
   var template = Handlebars.compile(source);
   var context = {
    titolo: risp[i].title,
    titoloOriginale: risp[i].original_title,
    lang: risp[i].original_language,
    rating: risp[i].vote_average
   }
   var html = template(context);
   $('.container').append(html);
  }
}
