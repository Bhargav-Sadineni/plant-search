const plantForm = document.getElementById('plant-form');
const plantNameInput = document.getElementById('plant-name');
const plantDetailsDiv = document.getElementById('plant-details');

const wikipediaApiUrl = 'https://en.wikipedia.org/w/api.php';

plantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const plantName = plantNameInput.value.trim();
    if (plantName) {
        getPlantDetails(plantName);
    }
});

async function getPlantDetails(plantName) {
    try {
        const wikipediaResponse = await fetch(`${wikipediaApiUrl}?action=opensearch&search=${plantName}&limit=1&format=json&origin=*`);
        const wikipediaData = await wikipediaResponse.json();

        if (wikipediaData[1].length > 0) {
            const pageTitle = wikipediaData[1][0];
            const descriptionResponse = await fetch(`${wikipediaApiUrl}?action=query&prop=extracts&titles=${pageTitle}&exintro=1&explaintext=1&format=json&origin=*`);
            const descriptionData = await descriptionResponse.json();
            const pages = descriptionData.query.pages;
            const pageId = Object.keys(pages)[0];
            const plantDescription = pages[pageId].extract;

            displayPlantDetails(pageTitle, plantDescription);
        } else {
            plantDetailsDiv.innerHTML = 'No details found for this plant.';
        }
    } catch (error) {
        console.error(error);
        plantDetailsDiv.innerHTML = 'Error fetching plant details.';
    }
}

function displayPlantDetails(plantName, plantDescription) {
    if (!plantDescription) {
        plantDetailsDiv.innerHTML = 'No description available.';
        return;
    }
    const details = plantDescription.split('.').filter(detail => detail.trim() !== '');
    let html = `<h2>${plantName}</h2><ul>`;
    details.forEach(detail => {
        html += `<li>${detail.trim()}.</li>`;
    });
    html += `</ul>`;
    plantDetailsDiv.innerHTML = html;
}