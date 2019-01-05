var slideIndex;
var isRunning = false;
function create_home_page(){
    const container = $('#information_container');
    container.empty();
		const welcome = $('<h2 id="welcome" align="left"> Welcome, ' + login_account.first_name + ' ' + login_account.last_name + '</h2>');
		// container.append(welcome);

		let image1 = $('<img class="mySlides" src="./Graphical_Assets/Home Page Pictures/image1.png" style="width:100%">');
		let image2 = $('<img class="mySlides" src="./Graphical_Assets/Home Page Pictures/image2.png" style="width:100%">');
		let image3 = $('<img class="mySlides" src="./Graphical_Assets/Home Page Pictures/image3.png" style="width:100%">');
		let image4 = $('<img class="mySlides" src="./Graphical_Assets/Home Page Pictures/image4.png" style="width:100%">');

		let left_button = $('<button class="w3-button w3-black w3-display-left" onclick="plusDivs(-1)">&#10094;</button>')
  	let right_button = $('<button class="w3-button w3-black w3-display-right" onclick="plusDivs(1)">&#10095;</button>')

		let image_slider = $('<div class="w3-content slider w3-display-container" >');
		image_slider.append(image1, image2, image3, image4, left_button, right_button);
		container.append(image_slider)
		slideIndex = 0;
		carousel();

	}

function carousel() {
	if (!isRunning) {
		try {
			isRunning = true;
	    var i;
	    var x = document.getElementsByClassName("mySlides");
			console.log(x)
	    for (i = 0; i < x.length; i++) {
	      x[i].style.display = "none";
	    }
	    slideIndex++;
	    if (slideIndex > x.length) {slideIndex = 1}
	    x[slideIndex-1].style.display = "block";

	    setTimeout(() => {
				isRunning = false;
				carousel()
			}, 4000); // Change image every 2 seconds
		}
		catch (err) {
			isRunning = false;
		}
	}
}

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}
