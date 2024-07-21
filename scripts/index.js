document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const introText = document.getElementById('intro-text');
        introText.style.opacity = 1;
        introText.style.transform = 'translateY(0)';
    }, 100); // slight delay to ensure styles are applied
});

document.addEventListener("DOMContentLoaded", function() {
    const introText = document.getElementById('intro-text');
    // const footer = document.getElementById('footer');
    const textReveal = document.createElement('div');
    textReveal.className = 'text-reveal';
    introText.parentNode.insertBefore(textReveal, introText);

    // Array of different text contents
    const texts = [
        "Indulge your senses in a culinary journey that tantalizes your taste buds and delights your palate. Welcome aboard.",
        "Savor the blend of tradition and innovation at Bukhari Restaurant, where each dish is a masterpiece crafted with passion and expertise.",
        "Embark on a culinary adventure with our chef-inspired creations that promise to tantalize your taste buds and leave a lasting impression.",
        "Experience the essence of fine dining at Bukhari Restaurant, where every meal tells a story of dedication to quality and culinary excellence.",
        "We believe every meal should be a memorable experience. Our menu is a culinary journey that combines the freshest ingredients with the artistry of our chefs."
    ];

    let currentIndex = 0;

    function changeText() {
        // Update text content
        introText.textContent = texts[currentIndex];
        // Reset textReveal position
        textReveal.style.transform = 'translateY(0)';

        setTimeout(() => {
            // Animate text and textReveal
            introText.style.opacity = 1;
            introText.style.transform = 'translateY(0)';
            // textReveal.style.transform = 'translateY(-100%)';
        }, 300); // Slight delay to ensure styles are applied
    }

    // Initial text change
    changeText();

    // Interval to change text every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        changeText();
    }, 5000);
});
