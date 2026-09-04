    const params = new URLSearchParams(window.location.search);
    const roomId = parseInt(params.get('room_id'));

    const rooms = JSON.parse(localStorage.getItem('rooms_db'));
    const room = rooms.find(r => r.id === roomId);

    if (!room) {
      alert('Номер не найден');
      window.location.href = 'index.html';
    } else {
      document.getElementById('roomName').textContent = room.name;
      document.getElementById('roomPrice').textContent = room.price.toLocaleString();
    }

    // === ФУНКЦИЯ ПРОВЕРКИ ПЕРЕСЕЧЕНИЯ ДАТ ===
    function checkDateOverlap(rId, dIn, dOut) {
        const bookings = JSON.parse(localStorage.getItem('bookings_db') || '[]');
        
        for (const b of bookings) {
            // Игнорируем отклоненные заявки
            if (b.status === 'rejected') continue;
            // Проверяем только брони этого номера
            if (b.room_id !== rId) continue;
            
            // Формула пересечения: (НоваяЗаезда < СтаройВыезда) И (НоваяВыезда > СтаройЗаезда)
            if (dIn < b.dateOut && dOut > b.dateIn) {
                return { 
                    overlap: true, 
                    message: `Даты пересекаются с бронью (${b.dateIn} — ${b.dateOut})` 
                };
            }
        }
        return { overlap: false, message: '' };
    }
    // ========================================

    document.getElementById('bookingForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
      document.querySelectorAll('input').forEach(el => el.classList.remove('error'));

      let hasError = false;

      const setError = (id, msg) => {
        document.getElementById('err-' + id).textContent = msg;
        document.getElementById(id).classList.add('error');
        hasError = true;
      };

      const fname = document.getElementById('fname').value.trim();
      if (!fname || !/^[а-яА-ЯёЁa-zA-Z\s.\-]+$/.test(fname)) setError('fname', 'Только буквы кириллицы');

      const lname = document.getElementById('lname').value.trim();
      if (!lname || !/^[а-яА-ЯёЁa-zA-Z\s.\-]+$/.test(lname)) setError('lname', 'Только буквы кириллицы');

      const phone = document.getElementById('phone').value.trim();
      if (!/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)) setError('phone', 'Формат: +7(999)123-45-67');

      const email = document.getElementById('email').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setError('email', 'Некорректный Email');

      const dateIn = document.getElementById('dateIn').value;
      const dateOut = document.getElementById('dateOut').value;
      const today = new Date().toISOString().split('T')[0];

      if (!dateIn || dateIn < today) setError('dateIn', 'Неверная дата');
      if (!dateOut || dateOut <= dateIn) setError('dateOut', 'Выезд должен быть позже заезда');

      // === ПРОВЕРКА НА ПЕРЕСЕЧЕНИЕ (НОВОЕ ТРЕБОВАНИЕ) ===
      if (!hasError && dateIn && dateOut) {
          const overlap = checkDateOverlap(roomId, dateIn, dateOut);
          if (overlap.overlap) {
              setError('dateOut', overlap.message);
              hasError = true;
          }
      }
      // ================================================

      if (!hasError) {
        const booking = {
          id: Date.now(),
          room_id: room.id,
          room_name: room.name,
          fname, lname, phone, email,
          dateIn, dateOut,
          status: 'pending',
          created: new Date().toLocaleString()
        };

        let bookings = JSON.parse(localStorage.getItem('bookings_db')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings_db', JSON.stringify(bookings));

        document.getElementById('successModal').classList.add('active');
      }
    });

    document.getElementById('phone').addEventListener('input', function(e) {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (!x[2] && x[1] !== '') {
        e.target.value = '+7(' + x[1]; 
      } else {
        e.target.value = !x[2] ? x[1] : '+7(' + x[2] + (x[3] ? ')' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
      }
    });
