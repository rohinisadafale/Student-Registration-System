document.addEventListener('DOMContentLoaded', function() {
    // Select the form and the container where student records will be displayed
    const form = document.getElementById('studentForm');
    const recordsContainer = document.getElementById('recordsContainer');

    // Retrieve existing students from local storage or initialize an empty array if none exist
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to save the student array to local storage
    const saveToLocalStorage = () => {
        localStorage.setItem('students', JSON.stringify(students));
    };

    // Function to render student records in the table
    const renderRecords = () => {
        recordsContainer.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="editBtn" data-index="${index}">Edit</button>
                    <button class="deleteBtn" data-index="${index}">Delete</button>
                </td>
            `;
            recordsContainer.appendChild(row);
        });
    };

    // Validation functions for each input field
    const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);
    const isValidId = (id) => /^\d+$/.test(id);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidContact = (contact) => /^\d{10}$/.test(contact);

    // Function to show an error message for an invalid input
    const showError = (input, message) => {
        const formControl = input.parentElement;
        formControl.className = 'form-control error';
        const small = formControl.querySelector('small');
        small.innerText = message;
    };

    // Function to show success styling for a valid input
    const showSuccess = (input) => {
        const formControl = input.parentElement;
        formControl.className = 'form-control success';
    };

    // Event listener for form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get and trim values from input fields
        const name = document.getElementById('studentName').value.trim();
        const id = document.getElementById('studentId').value.trim();
        const email = document.getElementById('emailId').value.trim();
        const contact = document.getElementById('contactNo').value.trim();

        let valid = true;

        // Validate each input and show corresponding error or success message
        if (!isValidName(name)) {
            showError(document.getElementById('studentName'), 'Name should contain only alphabetic characters.');
            valid = false;
        } else {
            showSuccess(document.getElementById('studentName'));
        }

        if (!isValidId(id)) {
            showError(document.getElementById('studentId'), 'Student ID should contain only numeric values.');
            valid = false;
        } else {
            showSuccess(document.getElementById('studentId'));
        }

        if (!isValidEmail(email)) {
            showError(document.getElementById('emailId'), 'Please enter a valid email address.');
            valid = false;
        } else {
            showSuccess(document.getElementById('emailId'));
        }

        if (!isValidContact(contact)) {
            showError(document.getElementById('contactNo'), 'Contact number should be 10 digits.');
            valid = false;
        } else {
            showSuccess(document.getElementById('contactNo'));
        }

        // If all inputs are valid, add the student record, save to local storage, render records, and reset the form
        if (valid) {
            students.push({ name, id, email, contact });
            saveToLocalStorage();
            renderRecords();
            form.reset();
            document.querySelectorAll('.form-control').forEach(control => control.className = 'form-control');
        }
    });

    // Event listener for edit and delete buttons in the student records table
    recordsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('editBtn')) {
            // Edit button functionality: populate the form with the student's data and remove the student from the array
            const index = event.target.dataset.index;
            const student = students[index];
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentId').value = student.id;
            document.getElementById('emailId').value = student.email;
            document.getElementById('contactNo').value = student.contact;
            students.splice(index, 1);
        } else if (event.target.classList.contains('deleteBtn')) {
            // Delete button functionality: remove the student from the array, save to local storage, and render records
            const index = event.target.dataset.index;
            students.splice(index, 1);
            saveToLocalStorage();
            renderRecords();
        }
    });

    // Initial render of student records when the page loads
    renderRecords();
});