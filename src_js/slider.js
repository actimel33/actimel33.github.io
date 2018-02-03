let slideIndex = 1;

let timer;

let clickNext = () => {
    plusSlides(1);
};

let stopInterval = () => {
    clearInterval(timer);
};

let slideTimer = () => {
    timer = setInterval(() => {
        clickNext();
    }, 10000);

};

let plusSlides = (n) => {
    showSlides(slideIndex += n);
    stopInterval();
    slideTimer();
};

let currentSlide = (n) => {
    showSlides(slideIndex = n);
    stopInterval();
    slideTimer();
};

let showSlides = (n) => {
    let i;
    let slides = document.getElementsByClassName("slides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace('active', '');
    }

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += 'active';


};

showSlides(1);
currentSlide(1);



