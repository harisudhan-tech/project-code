// js/admin.js

// Check if logged in as admin
const loggedInUser = sessionStorage.getItem('loggedInUser');
if (!loggedInUser || !loggedInUser.endsWith('@admin')) {
  alert('Access denied. Please log in as admin.');
  window.location.href = 'index.html';
}

const loanTableBody = document.querySelector('#loanTable tbody');
const addLoanForm = document.getElementById('addLoanForm');
const searchInput = document.getElementById('searchInput');
const logoutBtn = document.getElementById('logoutBtn');

let loanData = JSON.parse(localStorage.getItem('loanData')) || [];

// Utility function to save to localStorage
function saveData() {
  localStorage.setItem('loanData', JSON.stringify(loanData));
}

// Render loans into table, optionally filtered by search term
function renderTable(filter = '') {
  loanTableBody.innerHTML = '';

  const filteredLoans = loanData.filter(loan => {
    return (
      loan.name.toLowerCase().includes(filter.toLowerCase()) ||
      loan.accountNumber.toString().includes(filter)
    );
  });

  if (filteredLoans.length === 0) {
    loanTableBody.innerHTML = `<tr><td colspan="8">No records found.</td></tr>`;
    return;
  }

  filteredLoans.forEach((loan, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${loan.name}</td>
      <td>${loan.accountNumber}</td>
      <td>${loan.loanAmount}</td>
      <td>${loan.emiPlan}</td>
      <td>${loan.email}</td>
      <td>${loan.phone}</td>
      <td>${loan.overdue}</td>
      <td>
        <button class="editBtn" data-index="${index}">Edit</button>
        <button class="deleteBtn" data-index="${index}">Delete</button>
      </td>
    `;

    loanTableBody.appendChild(row);
  });
}

// Add loan handler
addLoanForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Read form values
  const newLoan = {
    name: document.getElementById('name').value.trim(),
    accountNumber: Number(document.getElementById('accountNumber').value),
    loanAmount: Number(document.getElementById('loanAmount').value),
    emiPlan: Number(document.getElementById('emiPlan').value),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    overdue: Number(document.getElementById('overdue').value)
  };

  // Validate unique accountNumber and email
  if (loanData.some(loan => loan.accountNumber === newLoan.accountNumber)) {
    alert('Account Number must be unique!');
    return;
  }
  if (loanData.some(loan => loan.email === newLoan.email)) {
    alert('Email must be unique!');
    return;
  }

  loanData.push(newLoan);
  saveData();
  renderTable();
  addLoanForm.reset();
});

// Delete loan handler (using event delegation)
loanTableBody.addEventListener('click', function (e) {
  if (e.target.classList.contains('deleteBtn')) {
    const idx = e.target.dataset.index;
    if (confirm('Are you sure you want to delete this loan record?')) {
      loanData.splice(idx, 1);
      saveData();
      renderTable(searchInput.value);
    }
  }
});

// Edit loan handler (event delegation)
loanTableBody.addEventListener('click', function (e) {
  if (e.target.classList.contains('editBtn')) {
    const idx = e.target.dataset.index;
    const row = e.target.closest('tr');
    const loan = loanData[idx];

    // Replace row cells with editable inputs
    row.innerHTML = `
      <td><input type="text" id="editName" value="${loan.name}" /></td>
      <td><input type="number" id="editAccountNumber" value="${loan.accountNumber}" disabled /></td>
      <td><input type="number" id="editLoanAmount" value="${loan.loanAmount}" /></td>
      <td><input type="number" id="editEmiPlan" value="${loan.emiPlan}" /></td>
      <td><input type="email" id="editEmail" value="${loan.email}" disabled /></td>
      <td><input type="text" id="editPhone" value="${loan.phone}" /></td>
      <td><input type="number" id="editOverdue" value="${loan.overdue}" /></td>
      <td>
        <button class="saveBtn" data-index="${idx}">Save</button>
        <button class="cancelBtn" data-index="${idx}">Cancel</button>
      </td>
    `;
  }
});

// Save edited loan handler
loanTableBody.addEventListener('click', function (e) {
  if (e.target.classList.contains('saveBtn')) {
    const idx = e.target.dataset.index;
    const row = e.target.closest('tr');

    const updatedLoan = {
      name: row.querySelector('#editName').value.trim(),
      accountNumber: loanData[idx].accountNumber, // not editable
      loanAmount: Number(row.querySelector('#editLoanAmount').value),
      emiPlan: Number(row.querySelector('#editEmiPlan').value),
      email: loanData[idx].email, // not editable
      phone: row.querySelector('#editPhone').value.trim(),
      overdue: Number(row.querySelector('#editOverdue').value),
    };

    // Basic validation
    if (!updatedLoan.name || !updatedLoan.phone) {
      alert('Name and Phone cannot be empty.');
      return;
    }

    loanData[idx] = updatedLoan;
    saveData();
    renderTable(searchInput.value);
  }
});

// Cancel editing handler
loanTableBody.addEventListener('click', function (e) {
  if (e.target.classList.contains('cancelBtn')) {
    renderTable(searchInput.value);
  }
});

// Search input handler
searchInput.addEventListener('input', () => {
  renderTable(searchInput.value);
});

// Logout button handler
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
});

// Initial render
renderTable();
