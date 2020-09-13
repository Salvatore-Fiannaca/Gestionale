  var widthInProgress = document.getElementById("widthInProgress").value
  var widthCompleted = document.getElementById("widthCompleted").value
  
  document.getElementById("inProgress").style.width = widthInProgress + "%";
  document.getElementById("labelInProgress").innerText = widthInProgress + "%";

  document.getElementById("complete").style.width =  widthCompleted + "%";
  document.getElementById("labelCompleted").innerText = widthCompleted + "%";
