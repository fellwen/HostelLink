  document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const loginInput = document.getElementById('login').value.trim();
      const passInput = document.getElementById('password').value.trim();

      const ADMIN_LOGIN = "admin";
      const ADMIN_PASS = "admin123";

      if (loginInput === ADMIN_LOGIN && passInput === ADMIN_PASS) {
        localStorage.setItem('hostelink_admin_auth', 'true');
        window.location.href = 'admin.html';
      } else {
        document.getElementById('errorMsg').style.display = 'block';
      }
    });