document.addEventListener('DOMContentLoaded', () => {
    const meal = JSON.parse(localStorage.getItem('selectedMeal'));

    if (meal) {
        document.getElementById('mealId').value = meal._id;
        document.getElementById('name').value = meal.name;
        document.getElementById('description').value = meal.description;
        document.getElementById('quantity').value = meal.quantity;
        document.getElementById('price').value = meal.price;
    } else {
        console.error('No meal data found in localStorage');
    }

    document.getElementById('editMealForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch(`/update-meal/${document.getElementById('mealId').value}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Meal info updated successfully');
                window.location.href = '../views/available.ejs'; // Redirect back to the available meals page
            } else {
                console.error('Failed to update the meal');
                alert('Failed to update meal info');
            }
        })
        .catch(error => {const image = req.file ? req.file.path : null; // Handle image file
            console.error('Error updating meal:', error);
            alert('Error updating meal info');
        });
    });
});
