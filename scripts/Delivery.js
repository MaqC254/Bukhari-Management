// JavaScript for image slider
let slideIndex = 0;
showSlides();

function showSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.style.display = 'none';
    });
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

// Redirect to menu page on clicking 'Order Now'
document.querySelectorAll('.order-now').forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'deliveryMenu.html'; // Assuming your menu page is menu.html
    });
});