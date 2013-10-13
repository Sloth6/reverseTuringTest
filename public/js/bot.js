function init() {
  var eliza = new ElizaBot();
  var elizaLines = new Array();
  var displayCols = 60;
  var displayRows = 20;

  function elizaReset() {
    eliza.reset();
    elizaLines.length = 0;
    elizaStep();
  }

  function elizaStep(userinput) {
    if (eliza.quit) {
      userinput = '';
      if (confirm("This session is over.\nStart over?")) elizaReset();
      return;
    }
    else if (userinput != '') {
      var usr = 'YOU:   ' + userinput;
      var rpl = eliza.transform(userinput);
      elizaLines.push(usr);
      elizaLines.push('ELIZA: '+rpl);
      // display nicely
      // (fit to textarea with last line free - reserved for extra line caused by word wrap)
      // var temp  = new Array();
      // var l = 0;
      // for (var i=elizaLines.length-1; i>=0; i--) {
      //   l += 1 + Math.floor(elizaLines[i].length/displayCols);
      //   if (l >= displayRows) break
      //   else temp.push(elizaLines[i]);
      // }
      // elizaLines = temp.reverse();
      return rpl;
    }
    else if (elizaLines.length == 0) {
      // no input and no saved lines -> output initial
      var initial = 'ELIZA: ' + eliza.getInitial();
      elizaLines.push(initial);
      return initial + '\n';
    }
    return '';
  }

  function incomingMessage (name, message) {
    
    $('#messages').prepend('<b>' + name + '</b><br />' + message + '<hr />');
  }
  var msgCount = 0;
  function sendMessage() {
    var outgoingMessage = $('#outgoingMessage').val();
    $('#outgoingMessage').val('');
    if (msgCount < 5) {
      incomingMessage('patient', outgoingMessage);
      var eliza = elizaStep(outgoingMessage);
      setTimeout(function(){
        incomingMessage('Eliza', eliza);
      }, 4000);
      msgCount++;
    } else {
      alert('You have sent your maximum number of messages!');
    }
    
    
  }
  function accused(){
    alert('Incorrect! I am just a robot.')
  }

  /*
   If user presses Enter key on textarea, call sendMessage if there
   is something to share
   */
  function outgoingMessageKeyDown(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($('#outgoingMessage').val().trim().length <= 0) {
        return;
      }
      sendMessage();
      $('#outgoingMessage').val('');
    }
  }

  function outgoingMessageKeyUp() {
    var outgoingMessageValue = $('#outgoingMessage').val();
    $('#send').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
  }

  $('#outgoingMessage').on('keydown', outgoingMessageKeyDown);
  $('#outgoingMessage').on('keyup', outgoingMessageKeyUp);
  $('#send').on('click', sendMessage);
  $('#accuse').on('click', accused);
}



$(document).on('ready', init);
