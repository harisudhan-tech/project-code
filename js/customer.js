// js/customer.js

// Check session
const userEmail = sessionStorage.getItem('loggedInUser');
const errorMsg = document.getElementById('errorMsg');
const loanCard = document.getElementById('loanCard');
const loanInfo = document.getElementById('loanInfo');

// Not logged in or is an admin
if (!userEmail || userEmail.endsWith('@admin')) {
  errorMsg.textContent = 'Access denied. Please log in as a customer.';
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
} else {
  const loanData = JSON.parse(localStorage.getItem('loanData')) || [];
  const customerLoan = loanData.find(loan => loan.email === userEmail);

  if (!customerLoan) {
    errorMsg.textContent = 'No loan record found for your account.';
  } else {
    // Display loan details
    loanCard.style.display = 'block';
    loanInfo.innerHTML = `
      <p><strong>Name:</strong> <span class="highlight">${customerLoan.name}</span></p>
      <p><strong>Account Number:</strong> ${customerLoan.accountNumber}</p>
      <p><strong>Loan Amount:</strong> ₹${customerLoan.loanAmount}</p>
      <p><strong>EMI Plan:</strong> ${customerLoan.emiPlan} months</p>
      <p><strong>Email:</strong> ${customerLoan.email}</p>
      <p><strong>Phone:</strong> ${customerLoan.phone}</p>
      <p><strong>Overdue Amount:</strong> ₹${customerLoan.overdue}</p>
    `;
  }
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
});
