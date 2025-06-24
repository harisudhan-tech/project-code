const users = [
  { username: "hari@admin", password: "admin123", role: "admin" },
  { username: "alice", password: "alice123", role: "customer", email: "alice@example.com" },
  { username: "bob", password: "bob123", role: "customer", email: "bob@example.com" }
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    document.getElementById("error").innerText = "Invalid username or password!";
    return;
  }

  const role = username.endsWith("@admin") ? "admin" : "customer";

  sessionStorage.setItem("loggedInUser", JSON.stringify({
    username: user.username,
    role: role,
    email: user.email || null
  }));

  window.location.href = "dashboard.html";
});
