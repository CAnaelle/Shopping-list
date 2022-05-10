// Creer tableau d'objet vide
//demander à l'utilisateur de rentrer le produit et le nbre à acheter
//rentrer les valeurs dans le tableau
//afficher la liste de course et le nbre de produit total et individuel

//Déclarations variables
let listeCourse = [];

let nbreProduit;
let form;
let save;
let buttonAdd;
let suppress;
let input;
let message;
let trashLine;

//Déclarations fonctions

//effet toggle pour les champs d'entrées et les vide
function hideShow() {
  form = document.querySelector('form');
  form.classList.toggle('hide');
  clear();
  message.innerHTML = '';
}

//efface les champs du formulaire
function clear() {
  form.reset();
}

//ajoute un produit à la liste
function addProduit() {
  let produit = document.getElementById('nameProduct').value.toLowerCase(); //insère la valeur nom du produit dans la variable produit
  let quantite = parseInt(document.getElementById('quantity').value); //insère la valeur quantité dans la variable quantite
  let indexCategorie = document.getElementById('category'); //récupère l'élément select
  let categorie = indexCategorie.options[indexCategorie.selectedIndex].text; //récupère la valeur de l'option select
  let unite = document.getElementById('unity').value.toLowerCase();
  //console.log(typeof quantite, typeof produit, categorie);

  if (quantite == '' || produit == '') {
    message.innerHTML =
      '<p>Les champs sont vides ou ne sont pas correctement remplis.</p>'; //demander saisie d'un produit et d'une quantité
    //si quantite n'est pas un nbre
  } else if (isNaN(quantite)) {
    message.innerHTML = "<p>Le champs quantité n'est pas valide.</p>"; //demander nouvelle saisie nombre
  } else {
    message.innerHTML = ''; //on vide l'erreur champs quand tous les champs sont correctement remplis et on insère les valeurs dans le tableau
    //sinon insérer dans le tableau listeCourse une classe list contenant les valeurs entrées par l'utilisateur
    let list = {
      nom: produit,
      quantite: quantite,
      unite: unite,
      categorie: categorie,
    };
    listeCourse.push(list);
    //console.log(list);

    /* fonction pour trier selon ordre alphabétique des catégories */
    listeCourse = listeCourse.sort(function (a, b) {
      return a.categorie.localeCompare(b.categorie);
    });
  }

  saveList();
  loadStorage();
  refresh(); //affiche les données
  details();
  clear();
}

//enregistrer dans localStorage en JSON
function saveList() {
  listeCourse = JSON.stringify(listeCourse); //tableau -> json
  //console.log(listeCourse);
  localStorage.setItem('liste', listeCourse);
}

//récupère les données en JS
function loadStorage() {
  //récupére les données pour les retransformer ensuite au format tableau
  listeCourse = localStorage.getItem('liste');

  if (listeCourse != null) {
    listeCourse = JSON.parse(listeCourse); // json -> tableau
  } else {
    //on gère le cas où listeCourse est null, on vide le tableau
    listeCourse = [];
  }
}

//rafraichit (après fermeture page reprend les données) et affiche
function refresh() {
  //vider la balise table --> empty jquery
  //let bodyTable = document.querySelector('.bodyTab');
  /*bodyTable.empty(); */
  /* document.querySelector('.bodyTab').lenght = 0; */

  //vider la balise table --> empty jquery
  $('.bodyTab').empty(); //permet de ne pas ajouter les valeurs précédentes 2 fois

  // parcourir le tableau global pour afficher produit par produit
  for (let i = 0; i < listeCourse.length; i++) {
    $('.bodyTab').append(
      "<tr id='" +
        i +
        "'><td data-label='Mis au panier'><input type='checkbox' name='checkbox' id='checkbox' data-id='" +
        i +
        "'/></td><td data-label='Produit' class='supp' id='" +
        listeCourse[i].nom +
        "'>" +
        listeCourse[i].nom +
        "</td><td data-label='Quantité'>" +
        listeCourse[i].quantite +
        "</td><td data-label='Unité'>" +
        listeCourse[i].unite +
        "</td><td data-label='Catégorie'>" +
        listeCourse[i].categorie +
        "</td><td data-label='Supprimer'><i class='fas fa-trash' data-id='" +
        i +
        "'></i></td></tr>"
    );
  }

  details();

  input = document.querySelectorAll('input[type=checkbox'); //sélection dans la fonction refresh car sinon pas pris en compte puisque les input crée ici
  for (let i = 0; i < listeCourse.length; i++) {
    input[i].addEventListener('change', barreProduit); //EVENT BARRE PRODUIT
  }

  trashLine = document.querySelectorAll('.fa-trash');
  for (let j = 0; j < listeCourse.length; j++) {
    trashLine[j].addEventListener('click', eraseLine);
  }
}

//barre la ligne du tableau si mis au panier
function barreProduit() {
  let indice = $(this).data('id'); //récupère l'attribut de l'input checkbox
  //console.log(indice);
  let line = document.getElementById(indice); //on récupère la ligne entière possédant le même indice que la checkbox
  if (input[indice].checked) {
    line.classList.add('barred');
  } else {
    line.classList.remove('barred');
  }
}

//fonction qui supprime 1 ligne
function eraseLine() {
  let indiceTrash = $(this).data('id'); //récupère l'attribut de l'icon
  listeCourse.splice(indiceTrash, 1); //enlève la ligne du tableau ayant l'indice
  saveList(); //on enregistre de nouveau dans le localstorage le nouveau tableau
  loadStorage();
  refresh(); //on rafraichit
}

//fonction pour dire que si la taille du tableau est sup à 1 on affiche le nbre d'articles au pluriel sinon au singulier
function details() {
  if (listeCourse.length > 1) {
    nbreProduit.textContent = listeCourse.length + ' articles';
  } else {
    nbreProduit.textContent = listeCourse.length + ' article';
  }
}

//fonction qui vide la liste
function removeList() {
  let rep = confirm(
    'Etes-vous sûr.e de vouloir vider votre liste de courses ?'
  );
  if (rep) {
    $('.bodyTab').empty();
    listeCourse = [];
    localStorage.clear();
    details();
    hideShow();
  } else {
    return false;
  }
}

// code principal

document.addEventListener('DOMContentLoaded', function () {
  //sélection éléments
  nbreProduit = document.querySelector('#shoppingList span');
  buttonAdd = document.getElementById('addButton');
  save = document.getElementById('submit');
  suppress = document.getElementById('reset');
  message = document.getElementById('target');

  //FONCTION
  loadStorage(); // récupérer les produits déjà enregistrés
  refresh(); // rafraichir la liste avec les produits déjà enregistrés et affiche

  //installation events
  buttonAdd.addEventListener('click', hideShow);
  save.addEventListener('click', addProduit);
  suppress.addEventListener('click', removeList);
});
