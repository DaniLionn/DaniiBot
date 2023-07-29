function image() {
    var img = document.createElement("img");
    img.src = "Baby-giphy-3.gif";
    img.width = "150";
    img.height = "150";
    document.body.appendChild(img);
}
setTimeout(function(){    
    image()
    setInterval(image, 499)
}, 8300)
