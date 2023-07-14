// Je fais ici une fonction main() d'ou vont partir mes autres fonctions
function main() {
    // récupération de l'id du produit dans l'URL et création de id pour l'utiliser
    let id = getIdFromUrl();
    let url = "http://localhost:3000/api/products/" + id;
    getProductsFromAPI(url);
    choixQuantite();
    Validation();
}

main();

// Récupération de l'id de l'objet depuis l'url
function getIdFromUrl() {
    let params = new URL(document.location).searchParams;
    return params.get("id");
}

//récupération des informations de notre produit depuis l'API
function getProductsFromAPI(url) {
    fetch(url)
        .then((initialiation) => initialiation.json())

        .then((produit) => {
            affichageCanape(produit);
        });
}

//affichage du produit on créer les variables relié a l'html qui seront définies par les valeurs données par l'API
function affichageCanape(objet) {
    let image = document.getElementsByClassName("item__img")[0];
    let titre = document.getElementById("title");
    let description = document.getElementById("description");
    let couleurOption = document.getElementById("colors");
    let prix = document.getElementById("price");

    //on fait en sorte que les variables soient définit par l'API et modifient le html

    image.innerHTML = `<img src="${objet.imageUrl}" alt="${objet.altTxt}">`;
    titre.innerHTML = `${objet.name}`;
    prix.innerHTML = `${objet.price}`;
    description.innerHTML = `${objet.description}`;

    // choix de couleur, on fait une boucle pour avoir chaque couleurs
    for (let i = 0; i < objet.colors.length; i++) {
        couleurOption.innerHTML += `<option value=${objet.colors[i]}>${objet.colors[i]}</option>`;
    }
}


// création de monObjet qui integrera les valeurs modifiables de l'objet par le client
let monObjet = {
    id: null,
    colors: null,
    quantity: null,
};
// fonction pour modifié le nombre d'objet
function choixQuantite() {
    //on lie quantitéObjet au html
    let quantitéObjet = document.getElementById("quantity");
    //on écoute l'input
    quantitéObjet.addEventListener("input", function (evenement) {
        let quantitéCanap = quantitéObjet.value;
        console.log(quantitéCanap);
        console.log(evenement);
        //envoie vers le storage
        monObjet.quantity = parseInt(quantitéCanap);
        console.log(monObjet);
    });
}
// Fonction servant a véridfier si le choix du produit est intégralement fait avant d'appeler a la sauvegarde
function Validation() {
    //on lie le button au localStorage et on cree l'objet monObjet pour enregistrer plusieurs info
    document.getElementById("addToCart").addEventListener("click", function () {
        //on lie la couleur a notre objet
        let couleurCanap = document.getElementById("colors").value;
        console.log(couleurCanap);
        monObjet.colors = couleurCanap;
        monObjet.id = getIdFromUrl();

        //si tout est seléctionné correctement
        if (
            monObjet.quantity < 1 ||
            monObjet.quantity > 100 ||
            monObjet.quantity === undefined ||
            monObjet.colors === undefined ||
            monObjet.colors === ""
        ) {
            alert(
                "Veuillez renseigner la couleur et une quantité de canapé entre 1 et 100."
            );
        } else {
            //on peut ajouter notre objet au panier
            save();

            alert("Produit ajouté au panier");
            console.log("click");
        }
    });
}
//fonction pour ajouter un objet au panier (localstorage)
function save() {
    let trouver = 0;
    let id = getIdFromUrl();
    let panier = JSON.parse(localStorage.getItem("panier"));
    console.log(monObjet);
    console.log(panier);
    if (panier == null) {
        console.log("création panier");
        panier = [];
  
    } else {
        //si il n'y a pas de panier
        console.log("panier existant");
        console.log(panier);
        for (let i = 0; i < panier.length; i++) {
            //recherche si le produit existe deja (par couleur et id) 
            if (
                panier[i].id === id &&
                panier[i].colors === document.getElementById("colors").value
            ) {
                trouver = 1;
                console.log("prod existant");
                //si le canapé existe je calcule le totale de canap identique avant de remplacer l'ancienne valeur par celle ci
                let additionQuantité =
                    parseInt(panier[i].quantity) +
                    parseInt(document.getElementById("quantity").value);
                console.log(additionQuantité);
                //je remplace la quantité de l'objet "produit" et je ne dépasse pas 100
                panier[i].quantity =
                    additionQuantité > 100 ? 100 : additionQuantité;
            }
        }
    }
    // si le canapé n'existe pas deja alors on peut l'ajouter directement
    if (trouver == 0) {
        console.log("non trouvé");
        console.log(panier);
        panier.push(monObjet);
        console.log(panier);
    }
    console.log(JSON.stringify(panier));

    localStorage.setItem("panier", JSON.stringify(panier));
}
