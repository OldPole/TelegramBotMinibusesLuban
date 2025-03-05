let currentDates = [];
let lastCheckedDate = new Date().toDateString();

setInterval(() => {
    const today = new Date().toDateString();

    if(today !== lastCheckedDate) {
        lastCheckedDate = today;
        
        updateDate();
    }
}, 60000);

function updateDate() {
    const today = new Date();
    currentDates = [];

    for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i); // Add i days
        currentDates.push(formatDate(date)); // Format and add to the array
    }
}

function formatDate(date) {
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

updateDate();

module.exports = {
    getCurrentDates: () => currentDates,
};