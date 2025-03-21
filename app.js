// ------------------ About the Developer ------------------ //
// Developer: Hamza
// GitHub Profile: https://github.com/hamzawritescode
// Codédex Profile: https://www.codedex.io/@HamzaWritesCode
// Project Repository: https://github.com/yourprofile/plant-watering-reminder
// Codédex Project Link: https://www.codedex.io/community/project-showcase/yourprojectlink
//
// Your Name is a passionate developer with a focus on web development.
// With expertise in HTML, CSS, JavaScript, and front-end technologies, 
// they enjoy creating interactive and user-friendly applications.
// This Plant Watering Reminder app is one of their projects, designed 
// to help users track their plants' watering schedules with ease.

// ------------------ About the Project ------------------ //
// Project Name: Plant Watering Reminder 🌱
// Description:
// This web app helps users keep track of their plants' watering schedules.
// The app allows users to add plants, set their watering frequency, and 
// get reminders to ensure they never forget to water their plants.
//
// Key Features:
// - Add plants with names and watering frequencies.
// - Track when each plant was last watered and when it should be watered again.
// - Mark plants as watered and see their status.
// - Edit and delete plant entries.
// - Uses local storage to persist plant data even after page reloads.

// ------------------ Required Modules ------------------ //
// No external libraries are required for this project. 
// It uses vanilla JavaScript, HTML, and CSS.

document.getElementById('plant-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
  
    // Get the form values
    const plantName = document.getElementById('plant-name').value;
    const wateringFrequency = document.getElementById('watering-frequency').value;
  
    // Create a new plant object
    const plant = {
      name: plantName,
      frequency: parseInt(wateringFrequency), // Watering frequency in days
      lastWatered: new Date(), // Current date as the last watered date
    };
  
    // Add the plant to the list
    addPlantToList(plant);
    savePlants(); // Save the plant list to localStorage
  
    // Clear the form inputs
    document.getElementById('plant-name').value = '';
    document.getElementById('watering-frequency').value = '';
  });
  
  // Function to add a plant to the list
  function addPlantToList(plant) {
    const plantList = document.getElementById('plant-list'); // Get the plant list container
  
    // Create a new div for the plant card
    const plantCard = document.createElement('div');
    plantCard.classList.add('plant-card');
  
    // Calculate the next watering date based on the frequency
    const nextWateringDate = new Date(plant.lastWatered);
    nextWateringDate.setDate(nextWateringDate.getDate() + plant.frequency);
  
    // Determine if the plant is overdue, upcoming, or watered
    const currentDate = new Date();
    const isOverdue = currentDate > nextWateringDate;
  
    let plantStatusClass = isOverdue ? 'overdue' : 'upcoming'; // If overdue, use overdue class
    if (currentDate.toDateString() === nextWateringDate.toDateString()) {
      plantStatusClass = 'completed'; // Mark as watered if today is the watering day
    }
  
    // Plant card content
    plantCard.innerHTML = `
      <div class="plant-info">
        <strong>${plant.name}</strong>
        <p>Water every ${plant.frequency} day(s)</p>
        <p>Last watered: ${plant.lastWatered.toLocaleDateString()}</p>
        <p>Next watering: ${nextWateringDate.toLocaleDateString()}</p>
      </div>
      <button class="water-button" onclick="waterPlant(this, '${plant.name}')">Water</button>
      <button class="edit-button" onclick="editPlant('${plant.name}')">Edit</button>
      <button class="delete-button" onclick="deletePlant(this, '${plant.name}')">Delete</button>
    `;
  
    plantCard.classList.add(plantStatusClass); // Add the appropriate status class
  
    // Append the new plant card to the plant list
    plantList.appendChild(plantCard);
  }
  
  // Function to mark a plant as watered
  function waterPlant(button, plantName) {
    const plantCards = document.querySelectorAll('.plant-card');
    for (let card of plantCards) {
      if (card.querySelector('.plant-info strong').textContent === plantName) {
        card.classList.remove('overdue');
        card.classList.add('completed');
        card.querySelector('.plant-info').innerHTML += `<p>Watered on: ${new Date().toLocaleDateString()}</p>`;
        button.disabled = true; // Disable the "Water" button after watering
      }
    }
  
    savePlants(); // Save the updated plant list
  }
  
  // Function to edit a plant's name and frequency
  function editPlant(plantName) {
    const plantCards = document.querySelectorAll('.plant-card');
    for (let card of plantCards) {
      const nameElement = card.querySelector('.plant-info strong');
      if (nameElement && nameElement.textContent === plantName) {
        const newName = prompt('Enter new plant name:', nameElement.textContent);
        const newFrequency = prompt('Enter new watering frequency in days:', card.querySelector('.plant-info p').textContent.split(' ')[2]);
  
        if (newName && newFrequency) {
          nameElement.textContent = newName; // Update plant name
          card.querySelector('.plant-info p').textContent = `Water every ${newFrequency} day(s)`; // Update watering frequency
          savePlants(); // Save the updated plant list
        }
      }
    }
  }
  
  // Function to delete a plant
  function deletePlant(button, plantName) {
    const plantList = document.getElementById('plant-list');
    const plantCards = document.querySelectorAll('.plant-card');
    
    // Remove the plant card from the DOM
    for (let card of plantCards) {
      if (card.querySelector('.plant-info strong').textContent === plantName) {
        plantList.removeChild(card);
        break;
      }
    }
  
    // Save the updated plant list to localStorage
    savePlants();
  }
  
  // Function to load plants from localStorage
  function loadPlants() {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    plants.forEach(plant => addPlantToList(plant));
  }
  
  // Function to save plants to localStorage
  function savePlants() {
    const plantCards = document.querySelectorAll('.plant-card');
    const plants = [];
  
    // Gather plant data
    plantCards.forEach(card => {
      const name = card.querySelector('.plant-info strong').textContent;
      const frequency = parseInt(card.querySelector('.plant-info p').textContent.split(' ')[2]);
      const lastWatered = new Date(card.querySelector('.plant-info p').textContent.split(': ')[1]);
      
      plants.push({ name, frequency, lastWatered });
    });
  
    // Save the plant data to localStorage
    localStorage.setItem('plants', JSON.stringify(plants));
  }
  
  // Load plants from localStorage when the page loads
  loadPlants();
  