document.addEventListener('DOMContentLoaded', () => {
  const mainDishesBtn = document.getElementById('main-dishes-btn');
  const snacksBtn = document.getElementById('snacks-btn');
  const drinksBtn = document.getElementById('drinks-btn');
  const menuItemsContainer = document.getElementById('menu-items');

  mainDishesBtn.addEventListener('click', () => loadMenuItems('Main Dishes'));
  snacksBtn.addEventListener('click', () => loadMenuItems('Snacks'));
  drinksBtn.addEventListener('click', () => loadMenuItems('Drinks'));

  function loadMenuItems(category) {
    fetch(`/api/menu/${category}`)
      .then(response => response.json())
      .then(data => {
        displayMenuItems(data);
      })
      .catch(error => console.error('Error:', error));
  }

  function displayMenuItems(items) {
    menuItemsContainer.innerHTML = '';
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'menu-item';
      itemElement.innerHTML = `
        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <p>Price: $${item.price}</p>
      `;
      menuItemsContainer.appendChild(itemElement);
    });
  }
});
