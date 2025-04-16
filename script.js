
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
    { nom: "Salade d’avocat", prix: 6.00 },
    { nom: "Beignets de crabe", prix: 7.00 },
    { nom: "Alokos Fries ", prix: 6.00 },
    { nom: "Baton de Manioc Cuites", prix: 7.00 },
    { nom: "Piémontaise", prix: 5.50 }
  ],
   ACCOMPAGNEMENTS: [
    { nom: "Salade d’avocat", prix: 6.00 },
    { nom: "Beignets de crabe", prix: 7.00 },
    { nom: "Alokos Fries ", prix: 6.00 },
    { nom: "Baton de Manioc Cuites", prix: 7.00 },
    { nom: "Piémontaise", prix: 5.50 }
  ],
  plat: [
    { nom: "Yassa (poulet ou poisson)", prix: 13.50 },
    { nom: "Sauce Gombo", prix: 14.00 },
    { nom: "Poulet DG", prix: 14.50 },
    { nom: "Porc rôti", prix: 13.50 },
    { nom: "Ndolé (bœuf ou poisson)", prix: 14.00 },
    { nom: "Saka Saka", prix: 13.00 },
    { nom: "Sauce graine", prix: 13.00 },
    { nom: "Fumwa (viande fumée)", prix: 15.00 },
    { nom: "Riz Jolof", prix: 12.00 },
    { nom: "Mafé (boeuf ou poulet )", prix: 12.00 },
    { nom: "Madesu (haricots rouges)", prix: 11.50 }
  ],
  dessert: [
    { nom: "Thiakry", prix: 4.00 },
    { nom: "Malva Pudding", prix: 4.50 },
    { nom: "Mikate (beignets africains)", prix: 4.00 },
    { nom: "Pastel de nata", prix: 3.50 },
    { nom: "Quaker (bouillie sucrée)", prix: 3.50 },
    { nom: "Fondant au chocolat", prix: 5.00 }
  ],
  boisson: [
    { nom: "Eau plate (Evian, Cristaline…) 50 cl", prix: 2.00 },
    { nom: "Eau plate 1 L", prix: 3.50 },
    { nom: "Eau gazeuse (Perrier, Badoit…) 50 cl", prix: 2.50 },
    { nom: "Eau gazeuse 1 L", prix: 4.50 },
    { nom: "Coca-Cola / Coca Zéro 33 cl", prix: 3.00 },
    { nom: "Orangina / Schweppes 33 cl", prix: 3.00 },
    { nom: "Jus d’orange / Jus de pomme 25 cl", prix: 3.50 },
    { nom: "Ice Tea / Oasis 33 cl", prix: 3.00 },
    { nom: "Verre de vin rouge  12 cl", prix: 4.50 },
    { nom: "Verre de vin blanc 12 cl", prix: 4.50 },
    { nom: "Verre de rosé 12 cl", prix: 4.50 },
    { nom: "Bouteille vin rouge   75 cl", prix: 18.00 },
    { nom: "Bouteille vin blanc/rosé 75 cl", prix: 18.00 },
    { nom: "Bouteille de vin supérieur (sélection) 75 cl", prix: 30.00 },
    { nom: "Whisky (type JB, Ballantine’s) 4 cl", prix: 6.00 },
    { nom: "Whisky supérieur (Chivas, Jack Daniel’s…) 4 cl", prix: 8.00 },
    { nom: "Ricard / Pastis 2 cl", prix: 3.50 },
    { nom: "Rhum blanc / ambré 4 cl", prix: 5.50 }
  ]
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
