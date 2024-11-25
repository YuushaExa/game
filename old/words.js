// Sample JSON data
const jsonData = [
    { "text": "Apple", "description": "A sweet red or green fruit." },
    { "text": "Banana", "description": "A long yellow fruit." }
];

// Function to make words clickable
function makeWordsClickable() {
    const contentElement = document.getElementById('text-content');
    let content = contentElement.innerHTML;

    jsonData.forEach(item => {
        const regex = new RegExp(`\\b${item.text}\\b`, 'g'); // Match whole words only
        content = content.replace(regex, `<span class="text-link" data-text="${item.text}">${item.text}</span>`);
    });

    contentElement.innerHTML = content;

    // Add click event listeners to the newly created links
    const links = document.querySelectorAll('.text-link');
    links.forEach(link => {
        link.addEventListener('click', () => openModal(link.dataset.text));
    });
}

// Function to open modal
function openModal(text) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    // Find the corresponding description in jsonData
    const item = jsonData.find(item => item.text === text);
    if (item) {
        modalTitle.textContent = item.text;
        modalDescription.textContent = item.description;
        modal.style.display = "block";
    }
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
}

// Event listener for closing the modal
document.querySelector('.close').onclick = closeModal;
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize the clickable words
makeWordsClickable();
