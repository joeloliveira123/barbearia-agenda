const DEFAULT_SHOP = {
  name: "Sua Barbearia",
  sub: "Barbearia Clássica & Visagismo",
  address: "Rua Augusta, 980 · Vila Nova",
  whatsapp: "5511999999999",
  color: "#C97A34",
  barbers: [
    {
      id: "b1",
      name: "Lucas Ferreira",
      role: "Visagismo & Degradê",
      bio: "8 anos de experiência em cortes masculinos modernos, degradê navalhado e consultoria de estilo."
    },
    {
      id: "b2",
      name: "Bruno Martins",
      role: "Barba Terapia & Navalha",
      bio: "Especialista em desenho de barba, toalha quente e tratamentos para pele sensível."
    },
    {
      id: "b3",
      name: "Thiago Alves",
      role: "Corte Clássico & Tesoura",
      bio: "Referência em cortes sociais na tesoura, penteados clássicos e acabamento preciso."
    },
    {
      id: "any",
      name: "Primeiro barbeiro livre",
      role: "Menor tempo de espera",
      bio: ""
    }
  ],
  services: [
    {
      id: "s1",
      category: "Cabelo",
      categoryLabel: "Cabelo",
      name: "Corte Masculino",
      desc: "Você escolhe o estilo — degradê, social ou tesoura. Fazemos o corte alinhado ao seu cabelo, lavamos e finalizamos com pomada.",
      price: 40,
      duration: 30
    },
    {
      id: "s2",
      category: "Barba",
      categoryLabel: "Rosto",
      name: "Sobrancelha na Navalha ou Pinça",
      desc: "Limpeza rápida do contorno e entre as sobrancelhas para deixar o olhar mais limpo, sem afinar nem perder o desenho natural.",
      price: 10,
      duration: 10
    },
    {
      id: "s3",
      category: "Barba",
      categoryLabel: "Barba",
      name: "Barba Terapia com Toalha Quente",
      desc: "Desenho na navalha com duas toalhas quentes aromáticas, esfoliação leve e óleo hidratante para evitar irritação na pele.",
      price: 35,
      duration: 20
    },
    {
      id: "s4",
      category: "Combos",
      categoryLabel: "Combo",
      name: "Combo Corte + Barba Completa",
      desc: "Cabelo do jeito que você pediu combinado com a Barba Terapia completa na toalha quente em um único atendimento.",
      price: 70,
      duration: 50
    },
    {
      id: "s5",
      category: "Cabelo",
      categoryLabel: "Tratamento",
      name: "Hidratação & Secagem Modelada",
      desc: "Para tirar o ressecamento e controlar o volume: aplicação rápida no lavatório seguida de secagem e modelagem.",
      price: 40,
      duration: 25
    },
    {
      id: "s6",
      category: "Barba",
      categoryLabel: "Acabamento",
      name: "Pezinho & Contorno",
      desc: "Manutenção rápida para limpar a nuca, o contorno da orelha e o desenho da barba entre um corte e outro.",
      price: 20,
      duration: 15
    }
  ]
};

const SLOTS = ["09:00", "09:40", "10:20", "11:00", "13:30", "14:15", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const CFG_KEY = "barbearia_mvp_cfg_v3";
const BKG_KEY = "barbearia_mvp_bkg_v3";
const BARBER_PHOTOS = {
  b1: "images/barber-lucas.webp",
  b2: "images/barber-bruno.webp",
  b3: "images/barber-thiago.webp"
};

function buildDays() {
  const days = [];
  const names = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    days.push({
      iso: d.toISOString().slice(0, 10),
      label: i === 0 ? "Hoje" : names[d.getDay()],
      shortDate: `${dd}/${mm}`
    });
  }
  return days;
}

const DAYS = buildDays();

function loadShopConfig() {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return structuredClone(DEFAULT_SHOP);
}

function loadShopBookings(cfg) {
  try {
    const raw = localStorage.getItem(BKG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: "r1",
      clientName: "Gabriel Souza",
      clientPhone: "(11) 99123-4455",
      serviceName: cfg.services[3].name,
      price: cfg.services[3].price,
      barberName: cfg.barbers[0].name,
      date: DAYS[0].iso,
      dateLabel: `${DAYS[0].label} (${DAYS[0].shortDate})`,
      time: "10:20",
      status: "Confirmado"
    },
    {
      id: "r2",
      clientName: "Matheus Prado",
      clientPhone: "(11) 98234-7788",
      serviceName: `${cfg.services[0].name} + ${cfg.services[1].name}`,
      price: cfg.services[0].price + cfg.services[1].price,
      barberName: cfg.barbers[1].name,
      date: DAYS[0].iso,
      dateLabel: `${DAYS[0].label} (${DAYS[0].shortDate})`,
      time: "16:00",
      status: "Pendente"
    }
  ];
}

let shop = loadShopConfig();
let bookings = loadShopBookings(shop);
let selectedServices = [shop.services[0]];
let selectedBarber = shop.barbers[0];
let selectedDay = DAYS[0];
let selectedSlot = null;
let serviceCat = "all";
let statusFilter = "all";

function persist() {
  localStorage.setItem(CFG_KEY, JSON.stringify(shop));
  localStorage.setItem(BKG_KEY, JSON.stringify(bookings));
}

function formatBRL(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function hexAlpha(hex, a) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) || 201;
  const g = parseInt(c.slice(2, 4), 16) || 122;
  const b = parseInt(c.slice(4, 6), 16) || 52;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "SB";
}

function getTotals() {
  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + Number(s.duration || 0), 0);
  const names = selectedServices.map((s) => s.name).join(" + ");
  return { totalPrice, totalDuration, names };
}

function applyShopBrand() {
  document.documentElement.style.setProperty("--brand", shop.color);
  document.documentElement.style.setProperty("--brand-soft", hexAlpha(shop.color, 0.14));

  document.getElementById("shop-logo").textContent = initials(shop.name);
  document.getElementById("shop-name").textContent = shop.name;
  document.getElementById("shop-sub").textContent = shop.sub;
  document.getElementById("hero-shop-span").textContent = shop.name;
  document.getElementById("admin-shop-name").textContent = shop.name;
  document.getElementById("footer-name").textContent = shop.name;
  document.getElementById("shop-address").textContent = shop.address;
  document.getElementById("footer-address").textContent = shop.address;
  document.querySelectorAll(".shop-inline-name").forEach((el) => {
    el.textContent = shop.name;
  });
  document.title = `${shop.name} | Corte, Barba e Agendamento`;

  const quickInput = document.getElementById("quick-shop-name");
  if (document.activeElement !== quickInput) {
    quickInput.value = shop.name === DEFAULT_SHOP.name ? "" : shop.name;
  }

  document.getElementById("cfg-name").value = shop.name;
  document.getElementById("cfg-sub").value = shop.sub;
  document.getElementById("cfg-address").value = shop.address;
  document.getElementById("cfg-whatsapp").value = shop.whatsapp;
  document.getElementById("cfg-color").value = shop.color;
  renderServices();
}

function updateSummary() {
  const { totalPrice, totalDuration, names } = getTotals();
  const count = selectedServices.length;

  document.getElementById("sum-service").textContent = count > 0 ? names : "Selecione ao lado";
  document.getElementById("sum-duration").textContent = count > 0 ? `~${totalDuration} min` : "—";
  document.getElementById("sum-barber").textContent = selectedBarber ? selectedBarber.name : "—";
  document.getElementById("sum-datetime").textContent = selectedSlot
    ? `${selectedDay.label} (${selectedDay.shortDate}) às ${selectedSlot}`
    : `${selectedDay.label} · escolha o horário`;
  document.getElementById("sum-price").textContent = formatBRL(totalPrice);

  const inlineEl = document.getElementById("selected-summary-inline");
  if (count === 0) {
    inlineEl.textContent = "Nenhum serviço selecionado — clique nos cartões acima para montar seu atendimento";
  } else {
    const label = count === 1 ? "1 serviço selecionado" : `${count} serviços selecionados`;
    inlineEl.textContent = `${label} · ~${totalDuration} min · ${formatBRL(totalPrice)}`;
  }
}

function renderServices() {
  const grid = document.getElementById("services-grid");
  grid.innerHTML = "";
  const list = shop.services.filter((s) => serviceCat === "all" || s.category === serviceCat);
  const selectedIds = new Set(selectedServices.map((s) => s.id));

  list.forEach((s) => {
    const isSelected = selectedIds.has(s.id);
    const card = document.createElement("div");
    card.className = `service-card${isSelected ? " selected" : ""}`;
    card.innerHTML = `
      <div>
        <span class="service-cat">${s.categoryLabel}</span>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
      </div>
      <div class="service-foot">
        <span class="service-price">${formatBRL(s.price)} · ~${s.duration} min</span>
        <span class="service-toggle-pill">${isSelected ? "Selecionado ✓" : "Adicionar +"}</span>
      </div>
    `;
    card.addEventListener("click", () => {
      if (selectedIds.has(s.id)) {
        selectedServices = selectedServices.filter((item) => item.id !== s.id);
      } else {
        selectedServices = [...selectedServices, s];
      }
      renderServices();
      updateSummary();
    });
    grid.appendChild(card);
  });
}

function renderBarbers() {
  const list = document.getElementById("barbers-list");
  const team = document.getElementById("team-showcase");
  list.innerHTML = "";
  team.innerHTML = "";

  shop.barbers.forEach((b) => {
    const photoUrl = BARBER_PHOTOS[b.id];
    const avatarHtml = photoUrl
      ? `<img src="${photoUrl}" alt="" class="barber-avatar-sm" decoding="async" />`
      : `<span class="barber-avatar-fallback" aria-hidden="true">${initials(b.name)}</span>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `barber-btn${selectedBarber?.id === b.id ? " selected" : ""}`;
    btn.innerHTML = `
      <span class="barber-btn-inner">
        ${avatarHtml}
        <span>
          <strong>${b.name}</strong>
          <span>${b.role}</span>
        </span>
      </span>
    `;
    btn.addEventListener("click", () => {
      selectedBarber = b;
      renderBarbers();
      updateSummary();
    });
    list.appendChild(btn);

    if (b.bio) {
      const card = document.createElement("article");
      card.className = "team-card";
      const headerMedia = photoUrl
        ? `<div class="team-photo-wrap"><img src="${photoUrl}" alt="Retrato do barbeiro ${b.name}" class="team-photo" decoding="async" /></div>`
        : `<div class="team-monogram">${initials(b.name)}</div>`;

      card.innerHTML = `
        ${headerMedia}
        <div class="team-card-body">
          <h3>${b.name}</h3>
          <span class="team-role">${b.role}</span>
          <p>${b.bio}</p>
        </div>
      `;
      team.appendChild(card);
    }
  });
}

function renderDays() {
  const grid = document.getElementById("days-grid");
  grid.innerHTML = "";
  DAYS.forEach((day) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `day-btn${selectedDay.iso === day.iso ? " selected" : ""}`;
    btn.innerHTML = `<span>${day.label}</span><strong>${day.shortDate}</strong>`;
    btn.addEventListener("click", () => {
      selectedDay = day;
      selectedSlot = null;
      renderDays();
      renderSlots();
      updateSummary();
    });
    grid.appendChild(btn);
  });
}

function renderSlots() {
  const grid = document.getElementById("slots-grid");
  grid.innerHTML = "";
  const busy = new Set(
    bookings
      .filter((b) => b.date === selectedDay.iso && b.status !== "Cancelado")
      .map((b) => b.time)
  );

  SLOTS.forEach((slot) => {
    const isBusy = busy.has(slot);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `slot-btn${isBusy ? " busy" : ""}${selectedSlot === slot ? " selected" : ""}`;
    btn.textContent = slot;
    btn.disabled = isBusy;
    if (!isBusy) {
      btn.addEventListener("click", () => {
        selectedSlot = slot;
        renderSlots();
        updateSummary();
      });
    }
    grid.appendChild(btn);
  });
}

function renderAgenda() {
  const active = bookings.filter((b) => b.status !== "Cancelado");
  const confirmed = bookings.filter((b) => b.status === "Confirmado");
  const pending = bookings.filter((b) => b.status === "Pendente");
  const revenue = active.reduce((sum, b) => sum + Number(b.price || 0), 0);

  document.getElementById("shop-badge").textContent = active.length;
  document.getElementById("kpi-active").textContent = active.length;
  document.getElementById("kpi-confirmed").textContent = confirmed.length;
  document.getElementById("kpi-pending").textContent = pending.length;
  document.getElementById("kpi-revenue").textContent = formatBRL(revenue);

  const list = document.getElementById("agenda-list");
  list.innerHTML = "";
  const filtered = bookings.filter((b) => statusFilter === "all" || b.status === statusFilter);
  if (filtered.length === 0) {
    list.innerHTML = `<p style="color: #B6ADA2; margin: 0;">Nenhum agendamento nesta categoria.</p>`;
    return;
  }

  filtered.forEach((b) => {
    const item = document.createElement("div");
    item.className = "agenda-item";
    item.innerHTML = `
      <div class="agenda-info">
        <strong>${b.clientName} · ${b.serviceName} (${formatBRL(b.price)})</strong>
        <span>${b.dateLabel} às ${b.time} · ${b.barberName} · ${b.clientPhone}</span>
      </div>
      <div class="agenda-actions">
        <span class="status-badge status-${b.status}">${b.status}</span>
        ${b.status !== "Confirmado" ? `<button class="act-btn" data-act="confirm" data-id="${b.id}">Confirmar</button>` : ""}
        ${b.status !== "Cancelado" ? `<button class="act-btn" data-act="cancel" data-id="${b.id}">Cancelar</button>` : ""}
      </div>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll(".act-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = bookings.find((b) => b.id === btn.dataset.id);
      if (!target) return;
      target.status = btn.dataset.act === "confirm" ? "Confirmado" : "Cancelado";
      persist();
      renderAgenda();
      renderSlots();
    });
  });
}

// VIEW SWITCH
document.querySelectorAll(".switch-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".switch-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    const isClient = btn.dataset.view === "client";
    document.getElementById("client-view").classList.toggle("hidden", !isClient);
    document.getElementById("shop-view").classList.toggle("hidden", isClient);
  });
});

// CATEGORY TABS
document.querySelectorAll(".cat-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".cat-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    serviceCat = tab.dataset.cat;
    renderServices();
  });
});

// QUICK NAME
document.getElementById("quick-shop-name").addEventListener("input", (e) => {
  shop.name = e.target.value.trim() || DEFAULT_SHOP.name;
  persist();
  applyShopBrand();
});

// FORM SUBMIT
document.getElementById("client-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const errEl = document.getElementById("form-error");
  if (selectedServices.length === 0 || !selectedSlot) {
    errEl.textContent = "Selecione pelo menos um serviço e um horário disponível antes de confirmar.";
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");

  const clientName = document.getElementById("c-name").value.trim();
  const clientPhone = document.getElementById("c-phone").value.trim();
  const notes = document.getElementById("c-notes").value.trim();
  const { totalPrice, totalDuration, names } = getTotals();

  const record = {
    id: "r" + Date.now(),
    clientName,
    clientPhone,
    notes,
    serviceName: names,
    price: totalPrice,
    duration: totalDuration,
    barberName: selectedBarber.name,
    date: selectedDay.iso,
    dateLabel: `${selectedDay.label} (${selectedDay.shortDate})`,
    time: selectedSlot,
    status: "Pendente"
  };

  bookings.unshift(record);
  persist();
  renderSlots();
  renderAgenda();

  const msg = encodeURIComponent(
    `Olá *${shop.name}*! Acabei de reservar meu horário pelo site:\n• Serviços: ${record.serviceName}\n• Tempo estimado: ~${record.duration} min\n• Barbeiro: ${record.barberName}\n• Data: ${record.dateLabel} às ${record.time}\n• Cliente: ${record.clientName}`
  );
  const wa = shop.whatsapp.replace(/\D/g, "") || "5511999999999";

  document.getElementById("success-text").textContent =
    `${record.serviceName} (~${record.duration} min) com ${record.barberName} em ${record.dateLabel} às ${record.time}.`;
  document.getElementById("wa-btn").href = `https://wa.me/${wa}?text=${msg}`;

  document.getElementById("client-form").classList.add("hidden");
  document.getElementById("booking-success").classList.remove("hidden");
});

document.getElementById("another-btn").addEventListener("click", () => {
  selectedSlot = null;
  document.getElementById("client-form").reset();
  document.getElementById("client-form").classList.remove("hidden");
  document.getElementById("booking-success").classList.add("hidden");
  renderSlots();
  updateSummary();
});

// ADMIN FILTERS
document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    statusFilter = chip.dataset.status;
    renderAgenda();
  });
});

// DRAWER
const drawer = document.getElementById("customizer-drawer");
document.getElementById("open-customizer").addEventListener("click", () => drawer.classList.remove("hidden"));
document.getElementById("close-customizer").addEventListener("click", () => drawer.classList.add("hidden"));
document.getElementById("drawer-backdrop").addEventListener("click", () => drawer.classList.add("hidden"));

document.getElementById("cfg-name").addEventListener("input", (e) => {
  shop.name = e.target.value.trim() || DEFAULT_SHOP.name;
  persist();
  applyShopBrand();
});
document.getElementById("cfg-sub").addEventListener("input", (e) => {
  shop.sub = e.target.value;
  persist();
  applyShopBrand();
});
document.getElementById("cfg-address").addEventListener("input", (e) => {
  shop.address = e.target.value;
  persist();
  applyShopBrand();
});
document.getElementById("cfg-whatsapp").addEventListener("input", (e) => {
  shop.whatsapp = e.target.value;
  persist();
});
document.getElementById("cfg-color").addEventListener("input", (e) => {
  shop.color = e.target.value;
  persist();
  applyShopBrand();
});
document.querySelectorAll(".swatch").forEach((sw) => {
  sw.addEventListener("click", () => {
    shop.color = sw.dataset.color;
    persist();
    applyShopBrand();
  });
});

document.getElementById("add-svc-btn").addEventListener("click", () => {
  const name = document.getElementById("new-svc-name").value.trim();
  const price = Number(document.getElementById("new-svc-price").value);
  const duration = Number(document.getElementById("new-svc-dur").value) || 30;
  if (!name || !price) return;
  const newSvc = {
    id: "s" + Date.now(),
    category: "Combos",
    categoryLabel: "Personalizado",
    name,
    desc: "Serviço adicionado especialmente para o seu atendimento.",
    price,
    duration
  };
  shop.services.unshift(newSvc);
  selectedServices = [...selectedServices, newSvc];
  document.getElementById("new-svc-name").value = "";
  document.getElementById("new-svc-price").value = "";
  persist();
  renderServices();
  updateSummary();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  shop = structuredClone(DEFAULT_SHOP);
  selectedServices = [shop.services[0]];
  selectedBarber = shop.barbers[0];
  selectedSlot = null;
  persist();
  applyShopBrand();
  renderServices();
  renderBarbers();
  renderSlots();
  updateSummary();
});

// INIT
applyShopBrand();
renderServices();
renderBarbers();
renderDays();
renderSlots();
updateSummary();
renderAgenda();
