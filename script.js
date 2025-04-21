let tableCount = 0;
let currentTable = null;
let tablesData = {};
let tablesStatus = {};
let tableTotals = {};
let weekKey = getCurrentWeekKey();

if (localStorage.getItem('weekKey') !== weekKey) {
  localStorage.clear();
  localStorage.setItem('weekKey', weekKey);
}

tablesData = JSON.parse(localStorage.getItem('tablesData')) || {};
tablesStatus = JSON.parse(localStorage.getItem('tablesStatus')) || {};
tableTotals = JSON.parse(localStorage.getItem('tableTotals')) || {};
tableCount = Object.keys(tablesData).length;

const produits = {
  entree: [
    { nom: "Salade d’avocat", prix: 3.50 },
    { nom: "Beignets salé", prix: 4.00 },
    { nom: "Pastel Thon", prix: 4.00 },
    { nom: "Pastel Boeuf", prix: 4.00}
  ],
  
   Accompagnements: [
    { nom: "Alokos Fries", prix: 5.00 },
    { nom: "Pomme de Terre Fries", prix: 5.00 },
    { nom: "Riz Disponible", prix: 4.50 },
    { nom: "Riz Suplement ", prix: 2.50 },
    { nom: "Sauce Rouge", prix: 7.00 },
    { nom: "Foufou", prix: 7.00 },
    { nom: "La Sauce Du Chef", prix: 5.00 }
  ],
  
  plat: [
    { nom: "Yassa (poulet ou poisson)", prix: 15.00 },
    { nom: "Sauce Gombo", prix: 15.00 },
    { nom: "Attiéké (Poisson) ", prix: 16.50 },
    { nom: "Attiéké (Poulet) ", prix: 16.50 },
    { nom: "Poulet DG", prix: 18.00 },
    { nom: "Ndolé (bœuf ou poisson)", prix: 15.00 },
    { nom: "Saka Saka ", prix: 15.00 },
    { nom: "Foufou", prix: 15.00 },
    { nom: "Mafé (boeuf)", prix: 15.00 },
    { nom: "Mafé (poulet)", prix: 16.00 }
  ],
  
   Grillades: [
    { nom: "Ailes De Poulet", prix: 10.00 },
    { nom: "Brochette de Boeuf", prix: 10.00 },
    { nom: "Sole Braise à la poéle", prix: 10.00 }, 
    { nom: "Maquereau Braisé à la Poéle", prix: 10.00 },
    { nom: "Carpe Braisé à la poele", prix: 10.00 } 
   ],
    
  PetiteFaim: [
    { nom: "Emince de boeuf / Sauce jardiniere ", prix: 8.00 },
    { nom: "Pattes sautés", prix: 8.00 },
    { nom: "Accompagné de sauce jardinière", prix: 8.00 },
    { nom: "Omelette avec banane plantain", prix: 8.00 },
  ],
  
  dessert: [
    { nom: "Thiakry", prix: 4.00 },
    { nom: "Mikate (beignets africains)", prix: 4.00 },
    { nom: "Pastel de nata", prix: 3.50 },
    { nom: "Quaker (bouillie sucrée)", prix: 3.50 },
  ],
  
  boisson: [
    { nom: "Eau plate (Evian, Cristaline…) 50 cl", prix: 2.00 },
    { nom: "Eau plate 1 L", prix: 3.50 },
    { nom: "Eau gazeuse Perrier 50 cl", prix: 2.50 },
    { nom: "Eau gazeuse 1 L", prix: 4.50 },
    { nom: "Coca-Cola 33 cl", prix: 3.00 },
    { nom: "Coca Zéro 33 cl", prix: 3.00 },
    { nom: "Orangina  33 cl", prix: 3.00 },
    { nom: "Schweppes 33 cl", prix: 3.00 },
    { nom: "Oasis 33 cl", prix: 3.00 },
    { nom: "Ice Tea 33 cl", prix: 3.00 },
    
    ],
  
  boisson_Avec_Alcool:[
    { nom: "Verre de vin 12 cl", prix: 4.50 },
    { nom: "Bouteille vin rouge 75 cl", prix: 15.00 },
    { nom: "Bouteille vin blanc/rosé 75 cl", prix: 15.00 },
    { nom: "Whisky (Ballantine’s) 4 cl", prix: 6.00 },
    { nom: "Whisky (JB )4 cl", prix: 6.00 },
    { nom: "Whisky supérieur (Jack Daniel) 4 cl", prix: 8.00 }, 
    { nom: "Whisky supérieur (Chivas) 4 cl", prix: 8.00 },
    { nom: "Ricard / Pastis 2 cl", prix: 3.50 },
    { nom: "Bière", prix: 3.50 },
    { nom: "Rhum blanc / ambré 4 cl", prix: 5.50 }
    
    ],
};

const addTableBtn = document.getElementById('addTableBtn');
const tablesContainer = document.getElementById('tablesContainer');
const tableView = document.getElementById('tableView');
const currentTableTitle = document.getElementById('currentTableTitle');
const tabContent = document.getElementById('tabContent');
const panierListe = document.getElementById('panierListe');
const panierTotal = document.getElementById('panierTotal');
const btnTotal = document.getElementById('btnTotal');
const messageTotal = document.getElementById('messageTotal');
let totalClickCount = 0;

Object.keys(tablesData).forEach(num => {
  createTableButton(parseInt(num));
});

addTableBtn.addEventListener('click', () => {
  tableCount++;
  tablesData[tableCount] = [];
  tablesStatus[tableCount] = false;
  createTableButton(tableCount);
  saveData();
});

function createTableButton(number) {
  const tableBtn = document.createElement('button');
  tableBtn.textContent = `Table ${number}`;
  tableBtn.dataset.table = number;
  tableBtn.id = `btnTable${number}`;
  tableBtn.addEventListener('click', () => openTable(number));
  tablesContainer.appendChild(tableBtn);
}

function openTable(number) {
  currentTable = number;
  tableView.classList.remove('hidden');
  currentTableTitle.textContent = `Table ${number}`;
  tabContent.textContent = "Sélectionnez un onglet pour voir les produits.";
  totalClickCount = 0;
  messageTotal.textContent = tablesStatus[number] ? `Table ${number} est fermée.` : '';
  updatePanier();
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    if (tablesStatus[currentTable]) return;
    afficherProduits(btn.dataset.tab);
  });
});

function afficherProduits(type) {
  tabContent.innerHTML = '';
  produits[type].forEach(produit => {
    const btn = document.createElement('button');
    btn.textContent = `${produit.nom} - ${produit.prix.toFixed(2).replace(".", ",")} €`;
    btn.addEventListener('click', () => {
      ajouterAuPanier(produit);
    });
    tabContent.appendChild(btn);
  });
}

function ajouterAuPanier(produit) {
  if (!currentTable || tablesStatus[currentTable]) return;
  tablesData[currentTable].push(produit);
  updatePanier();
  saveData();
}

function updatePanier() {
  if (!currentTable) return;
  const panier = tablesData[currentTable] || [];
  panierListe.innerHTML = '';
  let total = 0;

  panier.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.nom} - ${item.prix} €`;

    if (!tablesStatus[currentTable]) {
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Supprimer';
      removeBtn.style.marginLeft = '10px';
      removeBtn.addEventListener('click', () => {
        panier.splice(index, 1);
        updatePanier();
        saveData();
      });
      li.appendChild(removeBtn);
    }

    panierListe.appendChild(li);
    total += item.prix;
  });

  panierTotal.textContent = `${total} €`;
}

btnTotal.addEventListener('click', () => {
  if (!currentTable || tablesStatus[currentTable]) return;

  totalClickCount++;
  if (totalClickCount >= 4) {
    const total = tablesData[currentTable].reduce((acc, item) => acc + item.prix, 0);
    messageTotal.textContent = `Table ${currentTable} fermée. Total : ${total} €. Merci !`;

    tablesStatus[currentTable] = true;
    tableTotals[currentTable] = total;
    saveData();
    totalClickCount = 0;
    updatePanier();
  } else {
    messageTotal.textContent = `Cliquez encore ${4 - totalClickCount} fois pour fermer la table.`;
  }
});

function saveData() {
  localStorage.setItem('tablesData', JSON.stringify(tablesData));
  localStorage.setItem('tablesStatus', JSON.stringify(tablesStatus));
  localStorage.setItem('tableTotals', JSON.stringify(tableTotals));
}

function getCurrentWeekKey() {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${now.getFullYear()}_week${week}`;
}


// Afficher message quand produit ajouté
function showNotifAjout() {
  const notif = document.getElementById('notifAjout');
  notif.textContent = "Produit ajouté !";
  notif.style.display = "block";
  setTimeout(() => notif.style.display = "none", 2000);
}

// Scroll vers panier après ajout
function ajouterAuPanier(produit) {
  if (!currentTable || tablesStatus[currentTable]) return;
  tablesData[currentTable].push(produit);
  updatePanier();
  saveData();
  showNotifAjout();
  document.getElementById('panierContainer').scrollIntoView({ behavior: 'smooth' });
}

// Retour à la vue liste de tables
document.getElementById('btnRetour').addEventListener('click', () => {
  tableView.classList.add('hidden');
  currentTable = null;
});

// Affichage dynamique de la table (modifié pour btn retour et état onglet)
function openTable(number) {
  currentTable = number;
  tableView.classList.remove('hidden');
  currentTableTitle.textContent = `Commande en cours – Table ${number}`;
  document.getElementById('btnRetour').classList.remove('hidden');

  const tabSection = document.querySelector('.tabs');
  if (tablesStatus[number]) {
    tabSection.classList.add('disabled');
    messageTotal.textContent = `Table ${number} est fermée.`;
  } else {
    tabSection.classList.remove('disabled');
    messageTotal.textContent = '';
  }

  totalClickCount = 0;
  tabContent.textContent = "Sélectionnez un onglet pour voir les produits.";
  updatePanier();
}
