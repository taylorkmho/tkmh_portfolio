// equalHeights function
$.fn.equalHeights = function(px) {
  $(this).each(function(){
    var currentTallest = 0;
    $(this).children().each(function(i) {
      $(this).css('min-height','initial');
      if ($(this).innerHeight() > currentTallest) {
        currentTallest = $(this).innerHeight();
      }
    });
    $(this).children().css({'min-height': currentTallest});
  });
  return this;
};

var setHeights = function() {
  if ($('[data-equalheights]').length) {
    $('[data-equalheights]').equalHeights();
    console.log('equalHeights fired!');
  }
};
var id;
setHeights();
$(window).resize(function() {
  clearTimeout(id);
  id = setTimeout(setHeights, 500);
});