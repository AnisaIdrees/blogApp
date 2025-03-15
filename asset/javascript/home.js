// // search-box open close js code
// let navbar = document.querySelector(".navbar");
// let searchBox = document.querySelector(".search-box .bx-search");
// // let searchBoxCancel = document.querySelector(".search-box .bx-x");
// searchBox.addEventListener("click", ()=>{
//   navbar.classList.toggle("showInput");
//   if(navbar.classList.contains("showInput")){
//     searchBox.classList.replace("bx-search" ,"bx-x");
//   }else {
//     searchBox.classList.replace("bx-x" ,"bx-search");
//   }
// });
// sidebar open close js code
let navLinks = document.querySelector(".nav-links");
let menuOpenBtn = document.querySelector(".navbar .bx-menu");
let menuCloseBtn = document.querySelector(".nav-links .bx-x");
console.log(document.querySelector(".nav-links .bx-x"));
menuOpenBtn.onclick = function() {
navLinks.style.left = "0";
}
menuCloseBtn.onclick = function() {
navLinks.style.left = "-100%";
}
// sidebar submenu open close js code
let htmlcssArrow = document.querySelector(".htmlcss-arrow");
htmlcssArrow.onclick = function() {
 navLinks.classList.toggle("show1");
}
let moreArrow = document.querySelector(".more-arrow");
moreArrow.onclick = function() {
 navLinks.classList.toggle("show2");
}
let jsArrow = document.querySelector(".js-arrow");
jsArrow.onclick = function() {
 navLinks.classList.toggle("show3");
}

// seraching filter
function filterPosts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let posts = document.getElementsByClassName("blog-post-card");
    
    for (let i = 0; i < posts.length; i++) {
        let title = posts[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        let content = posts[i].getElementsByTagName("p")[0].innerText.toLowerCase();
        
        if (title.includes(input) || content.includes(input)) {
            posts[i].style.display = "block";
        } else {
            posts[i].style.display = "none";

            
        }
    }
}