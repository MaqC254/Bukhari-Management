document.addEventListener('DOMContentLoaded', () => {
    const meals = document.querySelectorAll('.meal');

    meals.forEach(meal => {
        meal.addEventListener('click', () => {
            const mealData = {
                name: meal.getAttribute('data-name'),
                description: meal.getAttribute('data-description'),
                quantity: meal.getAttribute('data-quantity'),
                image: meal.getAttribute('data-image')
            };

            // Store the meal data in localStorage
            let pendingOrders = JSON.parse(localStorage.getItem('pendingOrders')) || [];
            pendingOrders.push(mealData);
            localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));

            // Optionally, redirect to the pending orders page
            //window.location.href = '../pages/waiter_orders.html';
        });
    });
});
