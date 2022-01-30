// For opening modal
var btn = document.getElementsByClassName("card");
for (var i = 0; i < btn.length; i++) {
    var thisBtn = btn[i];
    thisBtn.addEventListener("click", function(){
        var modal = document.getElementById(this.dataset.modal);
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }, false);
}

// For closing modal with (x)
var span = document.getElementsByClassName("close");
for (var i = 0; i < span.length; i ++) {
    var thisSpan = span[i];
    thisSpan.addEventListener("click", function(){
        var modal = document.getElementById(this.dataset.modal);
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }, false);
}

// For closing modal by clicking outside
var modals = document.getElementsByClassName("modal")
for (var i = 0; i < modals.length; i ++) {
    let thisModal = modals[i];
    thisModal.addEventListener("click", function(e){
        if (e.target === thisModal) {
            thisModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    })
}

