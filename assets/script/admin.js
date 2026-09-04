   // === ЗАЩИТА АДМИНКИ ===
    if (localStorage.getItem('hostelink_admin_auth') !== 'true') {
      window.location.href = 'admin_login.html';
    }
    // ======================

    let bookings = JSON.parse(localStorage.getItem('bookings_db')) || [];

    function render() {
      const tbody = document.querySelector('#bookingsTable tbody');
      tbody.innerHTML = '';
      
      let pendingCount = 0;

      bookings.forEach((b, index) => {
        if (b.status === 'pending') pendingCount++;

        let actions = '';
        if (b.status === 'pending') {
          actions = `
            <button class="btn-action btn-approve" onclick="changeStatus(${index}, 'approved')">✓</button>
            <button class="btn-action btn-reject" onclick="changeStatus(${index}, 'rejected')">✗</button>
          `;
        } else {
          actions = '<span style="color:#aaa; font-size:12px;">Обработана</span>';
        }

        const badgeClass = b.status;
        const statusText = b.status === 'approved' ? 'Утверждена' : (b.status === 'rejected' ? 'Отклонена' : 'Ожидание');

        tbody.innerHTML += `
          <tr>
            <td>${b.id}</td>
            <td><b>${b.room_name}</b></td>
            <td>${b.fname} ${b.lname}</td>
            <td>${b.phone}<br><small>${b.email}</small></td>
            <td>${b.dateIn} → ${b.dateOut}</td>
            <td><span class="badge ${badgeClass}">${statusText}</span></td>
            <td>${actions}</td>
          </tr>
        `;
      });

      document.getElementById('countAll').textContent = bookings.length;
      document.getElementById('countPending').textContent = pendingCount;
    }

    function changeStatus(index, newStatus) {
      if(confirm('Вы уверены?')) {
        bookings[index].status = newStatus;
        localStorage.setItem('bookings_db', JSON.stringify(bookings));
        render();
      }
    }

    function logout() {
        localStorage.removeItem('hostelink_admin_auth');
        window.location.href = 'index.html';
    }

    render();