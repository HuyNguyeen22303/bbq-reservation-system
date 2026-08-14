// Set minimum date for reservation to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.querySelector('input[type="date"]');
    if(dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
    }
});
