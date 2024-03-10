/*APP.JS*/
// Initialize empty data arrays
let students = [];
let selectedStudent = null;

function addStudent() {
    const name = document.getElementById('name').value;
    const className = document.getElementById('class').value;
    const school = document.getElementById('school').value;
    const fees = document.getElementById('fees').value;
    const subjects = document.getElementById('subjects').value;
    const joiningDate = document.getElementById('joiningDate').value;

    // Create student object
    const student = {
        name: name,
        class: className,
        school: school,
        fees: fees,
        subjects: subjects,
        joiningDate: joiningDate,
        feesHistory: []  // Initialize fees history for the student
    };

    // Add student to the list
    students.push(student);

    // Display success message
    alert("Student added successfully!");

    // Reset the form
    resetAddStudentForm();

    // Display students in the "Display Students" menu
    displayStudents();

    // Update the list of students in the delete menu
    displayStudentsForDeletion();
}

function deleteStudent(student) {
    const confirmation = confirm(`Are you sure you want to delete ${student.name}?`);
    if (confirmation) {
        const index = students.findIndex(s => s.name === student.name);
        if (index !== -1) {
            students.splice(index, 1);
            alert(`${student.name} deleted successfully!`);
            displayStudentsForDeletion();
        }
    }
}

function displayStudentsForDeletion() {
    const deleteResult = document.getElementById('deleteResult');
    deleteResult.innerHTML = '';

    students.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('student-item');
        studentItem.textContent = `${student.name} - Class ${student.class}, School: ${student.school}, Fees: ${student.fees}, Subjects: ${student.subjects}, Joining Date: ${student.joiningDate}`;
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => deleteStudent(student));

        studentItem.appendChild(deleteButton);
        deleteResult.appendChild(studentItem);
    });
}

function displayStudents() {
    document.getElementById('displayResult').innerHTML = '';

    students.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('class-container');
        studentItem.textContent = `${student.name} - Class ${student.class}, School: ${student.school}, Fees: ${student.fees}, Subjects: ${student.subjects}, Joining Date: ${student.joiningDate}`;
        document.getElementById('displayResult').appendChild(studentItem);
    });
}

function showAddStudent() {
    hideAllPages();
    document.getElementById('addStudentPage').style.display = 'flex';
}

function showDisplayStudents() {
    hideAllPages();
    document.getElementById('displayStudentsPage').style.display = 'flex';
    displayStudents();
}

function showHomePage() {
    hideAllPages();
    document.getElementById('homePage').style.display = 'flex';
    // Hide the fees history page when switching to the home page
    document.getElementById('feesHistoryPage').style.display = 'none';
}

function hideAllPages() {
    const pages = ['homePage', 'addStudentPage', 'displayStudentsPage', 'feesMenu', 'deleteStudentPage'];
    pages.forEach(page => {
        document.getElementById(page).style.display = 'none';
    });
}

function searchStudentInFees() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchResult = students.filter(student => student.name.toLowerCase().includes(searchInput));

    const searchResultContainer = document.getElementById('searchResult');
    searchResultContainer.innerHTML = '';

    searchResult.forEach(student => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-item');
        resultItem.textContent = `${student.name} - Class ${student.class}, School: ${student.school}, Fees: ${student.fees}, Subjects: ${student.subjects}, Joining Date: ${student.joiningDate}`;
        resultItem.addEventListener('click', () => selectStudentForFees(student));
        
        // Add calendar option next to each student
        const calendarButton = document.createElement('button');
        calendarButton.textContent = "Add Fees Date";
        calendarButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the search result click event from being triggered
            selectStudentForFees(student);
        });

        resultItem.appendChild(calendarButton);
        searchResultContainer.appendChild(resultItem);
    });
}

function selectStudentForFees(student) {
    selectedStudent = student;
    document.getElementById('addFeesDateSection').style.display = 'block';
}

function addFeesSubmissionDateToStudent() {
    const feesDate = document.getElementById('feesDate').value;

    if (!feesDate) {
        alert("Invalid input. Please enter the fees submission date.");
        return;
    }

    // Check if the date already exists in the fees history
    const existingDate = selectedStudent.feesHistory.find(entry => entry.date === feesDate);
    if (existingDate) {
        const editConfirmation = confirm("Fees for this date already submitted. Do you want to edit?");
        if (!editConfirmation) {
            return;
        }
        // Remove the existing entry
        selectedStudent.feesHistory = selectedStudent.feesHistory.filter(entry => entry.date !== feesDate);
    }

    // Add fees submission date to the selected student's fees history
    const feesHistoryEntry = {
        month: getFormattedDateMonthYear(new Date(feesDate)),
        feesSubmitted: true,
        date: feesDate
    };
    selectedStudent.feesHistory.push(feesHistoryEntry);

    alert(`Fees submission date added for ${feesHistoryEntry.month}.`);
    hideAddFeesDate();
}

function displayFeesHistory() {
    const feesHistoryResult = document.getElementById('feesHistoryResult');
    feesHistoryResult.innerHTML = '';

    if (selectedStudent && selectedStudent.feesHistory) {
        selectedStudent.feesHistory.forEach((entry) => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('fees-item');
            historyItem.innerHTML = `Fees submitted on ${entry.date} <button onclick="editFeesSubmissionDate('${entry.date}')">Edit</button>`;
            feesHistoryResult.appendChild(historyItem);
        });
        // Show the fees history page only if there is history
        document.getElementById('feesHistoryPage').style.display = 'flex';
    } else {
        // Hide the fees history page if there is no history
        document.getElementById('feesHistoryPage').style.display = 'none';
    }
}

function viewFeesSubmissionHistory() {
    // Display fees history only in the fees menu
    if (selectedStudent && selectedStudent.feesHistory) {
        displayFeesHistory();
    } else {
        alert("No fees history available for the selected student.");
    }
}


function editFeesSubmissionDate(date) {
    const newDate = prompt("Enter new date:", date);
    if (!newDate) {
        alert("Invalid input. Please enter a valid date.");
        return;
    }

    // Check if the new date already exists in the fees history
    const existingDate = selectedStudent.feesHistory.find(entry => entry.date === newDate);
    if (existingDate) {
        alert("Fees for this date already submitted. Please choose a different date.");
        return;
    }

    // Update the date in the fees history
    const index = selectedStudent.feesHistory.findIndex(entry => entry.date === date);
    if (index !== -1) {
        selectedStudent.feesHistory[index].date = newDate;
        alert(`Fees submission date updated to ${newDate}.`);
        displayFeesHistory();
    } else {
        alert("Date not found in fees history.");
    }
}

function navigate(page) {
    hideAllPages();
    document.getElementById(page).style.display = 'flex';
    // Hide the fees history page when navigating to any page other than the fees history page
    if (page !== 'feesHistoryPage') {
        document.getElementById('feesHistoryPage').style.display = 'none';
    }
}

function getFormattedDateMonthYear(date) {
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

function showFeesMenu() {
    hideAllPages();
    document.getElementById('feesMenu').style.display = 'flex';
    // Hide the fees history page when switching to the fees menu
    document.getElementById('feesHistoryPage').style.display = 'none';
}

function showDeleteMenu() {
    hideAllPages();
    document.getElementById('deleteStudentPage').style.display = 'flex';
    displayStudentsForDeletion();
}

function resetAddStudentForm() {
    document.getElementById('name').value = '';
    document.getElementById('class').value = '7';
    document.getElementById('school').value = '';
    document.getElementById('fees').value = '';
    document.getElementById('subjects').value = 'Maths';
    document.getElementById('joiningDate').value = '';
}
