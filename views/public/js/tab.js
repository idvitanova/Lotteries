function setActiveTab(evt, codeTab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent")[0].style.display = "block";
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    evt.currentTarget.className += " active";
    document.location.assign('/home/' + codeTab);
}