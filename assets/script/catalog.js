    // === БАЗА ДАННЫХ НОМЕРОВ С ИЗОБРАЖЕНИЯМИ ===
    const defaultRooms = [
      {
        id: 1,
        name: "Апарт-Риэлти",
        category: "Комфорт",
        price: 7200,
        img: "assets/img/Rectangle 10 (1).png",
        features: ["Wi-Fi", "Кондиционер", "ТВ", "1-комн."],
        desc: "Уютный номер с современной мебелью и всеми удобствами."
      },
      {
        id: 2,
        name: "Близко к центру",
        category: "Стандарт",
        price: 4140,
        img: "assets/img/Rectangle 10 (2).png",
        features: ["Wi-Fi", "ТВ", "Душ"],
        desc: "Экономичный номер с базовыми удобствами в центре города."
      },
      {
        id: 3,
        name: "Шато Сити 3★",
        category: "Люкс",
        price: 15800,
        img: "assets/img/Rectangle 10 (3).png",
        features: ["Wi-Fi", "Мини-бар", "Балкон", "2-комн."],
        desc: "Роскошный номер с балконом и видом на город."
      },
      {
        id: 4,
        name: "Дисней",
        category: "Семейный",
        price: 12000,
        img: "assets/img/Rectangle 10 (4).png",
        features: ["Wi-Fi", "Детская", "Кухня", "2-комн."],
        desc: "Просторный семейный номер с детской зоной и мини-кухней."
      },
      {
        id: 5,
        name: "Норт",
        category: "Стандарт",
        price: 3500,
        img: "assets/img/Rectangle 10 (4).png",
        features: ["Wi-Fi", "Душ", "ТВ"],
        desc: "Простой и чистый номер для бюджетного путешествия."
      },
      {
        id: 6,
        name: "Панорама",
        category: "Делюкс",
        price: 18000,
        img: "assets/img/Rectangle 10 (4).png",
        features: ["Wi-Fi", "Джакузи", "Вид на город", "Люкс"],
        desc: "Премиум номер с панорамными окнами и джакузи."
      },
      {
        id: 7,
        name: "Тишина",
        category: "Комфорт",
        price: 6500,
        img: "assets/img/Rectangle 10 (4).png",
        features: ["Wi-Fi", "Шумоизоляция", "ТВ"],
        desc: "Тихий номер вдали от шума. Идеально для отдыха."
      }
    ];

    // Инициализация БД
    if (!localStorage.getItem('rooms_db')) {
      localStorage.setItem('rooms_db', JSON.stringify(defaultRooms));
    }

    const allRooms = JSON.parse(localStorage.getItem('rooms_db'));

    // Отрисовка карточек
    function render(roomsToShow) {
      const grid = document.getElementById('grid');
      const count = document.getElementById('count');
      grid.innerHTML = '';

      if (roomsToShow.length === 0) {
        grid.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <p>Номера с выбранными фильтрами не найдены</p>
          </div>`;
        count.textContent = '(0 номеров)';
        return;
      }

      const num = roomsToShow.length;
      const word = num === 1 ? 'номер' : (num < 5 ? 'номера' : 'номеров');
      count.textContent = `(${num} ${word})`;

      roomsToShow.forEach(room => {
        grid.innerHTML += `
          <div class="card">
            <div class="card-img-wrap">
              <img src="${room.img}" alt="${room.name}" loading="lazy">
              <div class="card-badge">${room.category}</div>
            </div>
            <div class="card-body">
              <div class="card-name">${room.name}</div>
              <div class="card-desc">${room.desc}</div>
              <div class="card-features">
                ${room.features.map(f => `<span class="card-feature">${f}</span>`).join('')}
              </div>
              <div class="card-footer">
                <div class="card-price">${room.price.toLocaleString('ru-RU')} ₽ <span>/ ночь</span></div>
                <a href="booking.html?room_id=${room.id}" class="btn-book">Забронировать</a>
              </div>
            </div>
          </div>
        `;
      });
    }

    // Случайная выборка 5 номеров
    function getRandomRooms(arr, n) {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    }

    // Инициализация — показываем 5 случайных
    render(getRandomRooms(allRooms, 5));

    // Фильтрация
    function applyFilter() {
      const cat = document.getElementById('filterCat').value;
      const price = parseInt(document.getElementById('filterPrice').value) || 999999;

      const filtered = allRooms.filter(r => {
        const matchCat = cat ? r.category === cat : true;
        const matchPrice = r.price <= price;
        return matchCat && matchPrice;
      });
      render(filtered);
    }

    // Сброс фильтра
    function resetFilter() {
      document.getElementById('filterCat').value = '';
      document.getElementById('filterPrice').value = '';
      render(getRandomRooms(allRooms, 5));
    }