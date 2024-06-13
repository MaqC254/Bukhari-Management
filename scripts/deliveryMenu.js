const menuData = {
  mainDishes: [
      {
          image: '/home/mego/Documents/Project/Bukhari-Management-main/images/Chips Plain.jpg',
          name: 'Chips Plain',
          description: 'Crunchy French Fries',
          price: '2000'
      },
      {
          image: 'C:\Users\ADMIN\Desktop\Final Year Project\images\grilled chicken.jpg',
          name: 'Chicken',
          description: 'Spicy and Tasty, have a try!',
          price: '6000'
      },
      // Add more main dishes as needed
  ],
  snacks: [
      {
          image: 'path/to/snack1.jpg',
          name: 'Snack 1',
          description: 'Description of Snack 1',
          price: '5.00'
      },
      {
          image: 'path/to/snack2.jpg',
          name: 'Snack 2',
          description: 'Description of Snack 2',
          price: '6.00'
      },
      // Add more snacks as needed
  ],
  drinks: [
      {
          image: 'path/to/drink1.jpg',
          name: 'Drink 1',
          description: 'Description of Drink 1',
          price: '2.00'
      },
      {
          image: 'path/to/drink2.jpg',
          name: 'Drink 2',
          description: 'Description of Drink 2',
          price: '3.00'
      },
      // Add more drinks as needed
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const menuItemsContainer = document.getElementById('menu-items');
  const mainDishesBtn = document.getElementById('main-dishes-btn');
  const snacksBtn = document.getElementById('snacks-btn');
  const drinksBtn = document.getElementById('drinks-btn');

  // Function to display menu items
  function displayMenuItems(items) {
      // Clear current menu items
      menuItemsContainer.innerHTML = '';

      // Populate with new items
      items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('menu-item');

          itemDiv.innerHTML = `
              <img src="${item.image}" alt="${item.name}">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <div class="price">$${item.price}</div>
              <button class="add-to-cart">Add to Cart</button>
          `;

          menuItemsContainer.appendChild(itemDiv);
      });
  }

  // Event listeners for section buttons
  mainDishesBtn.addEventListener('click', () => displayMenuItems(menuData.mainDishes));
  snacksBtn.addEventListener('click', () => displayMenuItems(menuData.snacks));
  drinksBtn.addEventListener('click', () => displayMenuItems(menuData.drinks));

  // Load main dishes by default
  displayMenuItems(menuData.mainDishes);
});