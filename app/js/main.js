(function(){
  'use strict';

  $(document).ready(init);

  function init() {
    addSpaces();
    setupBoard();

    $('#start').click(setupBoard);
    $('#board').on('click','.piece.current', selectPiece);
    $('#board').on('click','.validMove', checkMove);
  }

  function selectPiece() {
    if(!forceJump()) {
      if(isSelected()) {
        $('.selected').removeClass('selected');
      }
      $(this).addClass('selected');

      setLegalMoves();
    }
  }

  function checkMove() {
    var player = getPlayer();

    if(isJump()) {
      $('.hintmsg').removeClass('forceJump');
      $('.hintmsg').addClass('hidemsg');

      move(this, player);
      switchTurns();
      $(this).addClass('selected');
      setLegalMoves();
      $('.validMove:not(.validJump)').removeClass('validMove');  // so user can ONLY jump
      if(!isJump()) { // is not another jump
        $(this).removeClass('selected');
        switchTurns();
      }
      else {  // is another jump
        $('.hintmsg').addClass('forceJump');
        $('.hintmsg').removeClass('hidemsg');
      }
    }
    else { // no jump, just regular move
      move(this, player);
    }

    if(isEndOfGame()) {
      alert('You Won!');
      setupBoard();
    }
  }

  function move(curr, p) {
    moveKing(curr);

    $(curr).addClass(p +' piece current');
    $('.selected').removeClass(p +' piece selected king current');
    switchTurns();
    $('.validMove').removeClass('validMove');
    $('.captured').removeClass(opponentOf(p) +' piece king current captured');
  }

  function setLegalMoves() {
    // returns false if there are no legal jumps, true if there are legal jumps
    var x = selPieceX();
    var y = selPieceY();
    var i;
    var result = false;

    clearLegalMoves();

    // checks two adjacent squares
    if($('.selected').hasClass('player1') || $('.selected').hasClass('king')) {
      for(i=-1; i<2; i+=2) {
        if(isUnoccupied(x-i,y-1) ) {
          setValidMove(x-i,y-1);
        }
        else if(isOpponent(x-i, y-1) && isUnoccupied(x-(i*2), y-2)) {
          addClassAtXY(x-i,y-1, 'captured');
          addClassAtXY(x-(i*2), y-2, 'validMove validJump');
          result = true;
        }
      }
    }
    // checks two jumpable squares
    if($('.selected').hasClass('player2') || $('.selected').hasClass('king') ) {
      for(i=-1; i<2; i+=2) {
        if(isUnoccupied(x-i,y+1) ) {
          setValidMove(x-i,y+1);
        }
        else if(isOpponent(x-i, y+1) && isUnoccupied(x-(i*2), y+2)) {
          addClassAtXY(x-i,y+1, 'captured');
          addClassAtXY(x-(i*2), y+2, 'validMove validJump');
          result = true;
        }

      }
    }
  }

  function clearLegalMoves() {
    $('.validMove').removeClass('validMove');
    $('.validJump').removeClass('validJump');
    $('.captured').removeClass('captured');
  }

  function moveKing(curr) {
    if($('.selected').hasClass('king') ||
      $(curr).data('y')===0 && $('.selected').hasClass('player1') ||
      $(curr).data('y')===7 && $('.selected').hasClass('player2')) {
        $(curr).addClass('king');
      }
    }

    function addClassAtXY(x,y, str) {
      $('td[data-x='+x+'][data-y='+y+']').addClass(str);
    }

    function isOpponent(x,y) {
      return $('td[data-x='+x+'][data-y='+y+']:not(.current)').length;
    }
    function isUnoccupied(x,y) {
      return $('td[data-x='+x+'][data-y='+y+']:not(.piece).validSpace').length;
    }

    function setValidMove(x,y) {
      $('td[data-x='+x+'][data-y='+y+']:not(.piece).validSpace').addClass('validMove');
    }

    function isJump() {
      return $('.captured').length;
    }

    function getPlayer() {
      return $('.selected').hasClass('player1')? 'player1' : 'player2';
    }

    function isSelected() {
      return ($('.selected').length > 0);
    }

    function selPieceX() {
      return $('.selected').data('x');
    }

    function selPieceY() {
      return $('.selected').data('y');
    }

    function opponentOf(p) {
      return (p==='player1') ? 'player2' : 'player1';
    }

    function switchTurns() {
      $('.player1').toggleClass('current');
      $('.player2').toggleClass('current');
    }

    function forceJump() {
      return $('.hintmsg').hasClass('forceJump');
    }
    function isEndOfGame() {
      if(!$('.player1').length || !$('.player2').length) {
        return true;
      }
      return false;
    }

    function setupBoard() {
      var spaces = $('.validSpace');
      for(var i=0; i< spaces.length; i++) {
        $(spaces[i]).removeClass('piece player1 player2 king current selected validMove captured');
      }
      for(i=0; i<12; i++) {
        $(spaces[i]).addClass('player2 piece');
      }

      for(i=20; i<32; i++) {
        $(spaces[i]).addClass('player1 piece current');
      }
    }

    function addSpaces() {
      $('tr:nth-child(2n) td:nth-child(2n+1)').addClass('validSpace');
      $('tr:nth-child(2n-1) td:nth-child(2n)').addClass('validSpace');
    }

  })();
