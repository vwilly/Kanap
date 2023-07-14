// création de variables permettant de faire le lien entre les données de l'API et du local storage
let PRODUCTS_LS;
let PRODUCTS_API;

//récupération des données des produits depuis l'API
function getProductsFromAPI(url) {
    fetch(url)
        .then((initialiation) => initialiation.json())
        .then((produit) => {
            PRODUCTS_API = produit;
            affichePanier();
        });
}

//récupération des données du local storage
function getProductFromLS() {
    PRODUCTS_LS = JSON.parse(localStorage.getItem("panier"));
}

//fonction pour modifier le HTML et modifier les produits
function affiche1ProduitDuPannier(produit_ls, produit_api) {
    let affichage = document.getElementById("cart__items");
    console.log(affichage);
    //création de chaque élément du html

    let article = document.createElement("article");
    let img = document.createElement("img");
    let h2 = document.createElement("h2");
    let pColors = document.createElement("p");
    let pPrix = document.createElement("p");
    let pQuantité = document.createElement("p");
    let pDeleteItem = document.createElement("p");
    let cart__item__img = document.createElement("div");
    let cart__item__content = document.createElement("div");
    let cart__item__content__description = document.createElement("div");
    let cart__item__content__settings = document.createElement("div");
    let cart__item__content__settings__quantity = document.createElement("div");
    let cart__item__content__settings__delete = document.createElement("div");
    let input = document.createElement("input");

    //incorporation du contenu du localstrage ou de l'api dans les éléments html html avec les data
    article.setAttribute("data-id", produit_ls.id);
    article.setAttribute("data-color", produit_ls.colors);
    article.setAttribute("data-quantité", produit_ls.quantity);
    article.setAttribute("data-prix", produit_api.price); 

    img.setAttribute("src", produit_api.imageUrl);
    img.setAttribute("alt", produit_api.altTxt);

    h2.textContent = produit_api.name;

    pColors.textContent = produit_ls.colors;
    pPrix.textContent = produit_api.price;

    pDeleteItem.setAttribute("data-color", produit_ls.colors);
    pDeleteItem.setAttribute("data-id", produit_ls.id);

    pQuantité.textContent = "Qté : ";

    input.setAttribute("type", "number");
    input.setAttribute("name", produit_ls.quantity);
    input.setAttribute("min", 1);
    input.setAttribute("max", 100);
    input.setAttribute("value", produit_ls.quantity);

    pDeleteItem.textContent = "Supprimer";
    //incorporation des classes
    article.classList.add("cart__item");
    cart__item__img.classList.add("cart__item__img");
    cart__item__content.classList.add("cart__item__content");
    cart__item__content__description.classList.add(
        "cart__item__content__description"
    );
    cart__item__content__settings.classList.add(
        "cart__item__content__settings"
    );
    cart__item__content__settings__quantity.classList.add(
        "cart__item__content__settings__quantity"
    );
    cart__item__content__settings__delete.classList.add(
        "cart__item__content__settings__delete"
    );
    pDeleteItem.classList.add("deleteItem");
    input.classList.add("itemQuantity");

    //organisation du html 
    affichage.appendChild(article);
    article.appendChild(cart__item__img);
    cart__item__img.appendChild(img);
    article.appendChild(cart__item__content);
    cart__item__content.appendChild(cart__item__content__description);
    cart__item__content__description.appendChild(h2);
    cart__item__content__description.appendChild(pColors);
    cart__item__content__description.appendChild(pPrix);
    cart__item__content.appendChild(cart__item__content__settings);
    cart__item__content__settings.appendChild(
        cart__item__content__settings__quantity
    );
    cart__item__content__settings__quantity.appendChild(pQuantité);
    cart__item__content__settings__quantity.appendChild(input);
    cart__item__content__settings.appendChild(
        cart__item__content__settings__delete
    );
    cart__item__content__settings__delete.appendChild(pDeleteItem);
}

// fonction pour obtenir uniquement les donn"es produits dont l'id est contenu dans le local storage
function findProduitFromApi(produitId) {
    for (let i = 0; i < PRODUCTS_API.length; i++) {
        // on fait correspondre les données de l'api en passant par l'id enregistré du produit
        if (produitId === PRODUCTS_API[i]._id) {
            return PRODUCTS_API[i];
        }
    }
}

// fonction general regroupant les foncions d'affichage et d'interaction avec le panier pour chaque produit
function affichePanier() {
    for (let produitls of PRODUCTS_LS) {
        let produitApi = findProduitFromApi(produitls.id);
        affiche1ProduitDuPannier(produitls, produitApi);
        quantiteTotal();
        modifquantite();
        suppression();
        prixTotal();
    }
}

// fonction servant a calculer et mettre a jour la quantité de produit
function quantiteTotal() {
    let totalArticle = null;
    const produit = document.querySelectorAll(".cart__item");
    // pour chaque canap
    produit.forEach((produit) => {
        //je récupère les quantité des prod par dataset
        totalArticle += JSON.parse(produit.dataset.quantité);
    });
    document.getElementById("totalQuantity").textContent = totalArticle;
}

// fonction servant a calculer et mettre a jour le prix total des produits
function prixTotal() {
    let totalPrix = null;
    const produit = document.querySelectorAll(".cart__item");
    produit.forEach((produit) => {
        totalPrix +=
            JSON.parse(produit.dataset.quantité) * produit.dataset.prix;
    });
    document.getElementById("totalPrice").textContent = totalPrix;
}

//fonction appelé si le panier est vide pour en informer l'utilisteur
function PasDePanier() {
    console.log(PRODUCTS_LS);
    if (PRODUCTS_LS == null || PRODUCTS_LS.length == 0) {
        console.log("panier vide");
        const questionnaire = document.querySelector(".cart__order");
        questionnaire.remove();
        document.querySelector("h1").innerHTML = "votre panier est vide";
        return true;
    }
    return false;
}

//SUPPRESSION

function suppression() {
    // déclaration de constante
    const cartSupprime = document.querySelectorAll(".cart__item .deleteItem");
    // pour chaque élément cartsup
    cartSupprime.forEach((cartSupprime) => {
        // si on clic
        cartSupprime.addEventListener("click", () => {
            //action sur le panier
            let panier = JSON.parse(localStorage.getItem("panier"));
            let nouveauPanier = JSON.parse(localStorage.getItem("panier"));
            //on recupère la position de l'élément a suppriemr

            for (let j = 0, y = panier.length; j < y; j++)
                if (
                    panier[j].id === cartSupprime.dataset.id &&
                    panier[j].colors === cartSupprime.dataset.color
                ) {
                    //supression avec splice a l'aide de la valeur de j
                    const num = [j];

                    nouveauPanier.splice(num, 1);
                }
            localStorage.panier = JSON.stringify(nouveauPanier);
            document.location.reload();
        });
    });
}

//QUANTITE MODIFICATION

function modifquantite() {
    const cart = document.querySelectorAll(".cart__item");
    // On écoute ce qu'il se passe dans itemQuantity de l'article concerné

    cart.forEach((cart) => {
        cart.addEventListener("change", (event) => {
            console.log("panier");
            let panier = JSON.parse(localStorage.getItem("panier"));
            let nouveauPanier = JSON.parse(localStorage.getItem("panier"));
            // on modifier la quantité du produit du panier grace à la nouvelle valeur
            for (let k = 0, y = panier.length; k < y; k++)
                if (
                    panier[k].id === cart.dataset.id &&
                    panier[k].colors === cart.dataset.color
                ) {
                    //supression avec splice a l'aide de la valeur de j
                    const num = [k];

                    nouveauPanier[k].quantity = event.target.value;
                }
            localStorage.panier = JSON.stringify(nouveauPanier);
            document.location.reload();

        });
    });
}

        //FORMULAIRE

//fonction permettant de réagire au  remplissage de chaque partie du formulaire et a sa validation en fonction de a validation des regEx
function AddEventForForm() {
    const form = document.querySelector(".cart__order__form");
    const prenom = document.querySelector("#firstName");
    const nom = document.querySelector("#lastName");
    const ville = document.querySelector("#city");
    const adresse = document.querySelector("#address");
    const email = document.querySelector("#email");
    prenom.addEventListener("blur", function () {
        checkFieldFirstName();
    });
    nom.addEventListener("blur", function () {
        checkFieldLastName();
    });
    ville.addEventListener("blur", function () {
        checkFieldCity();
    });
    adresse.addEventListener("blur", function () {
        checkFieldAddresse();
    });
    email.addEventListener("blur", function () {
        checkFieldMail();
    });
    form.addEventListener("submit", function (e) {
        handleSubmitForm(e);
    });
}

// réaction a une erreur de remplissage apres avoir validé le formulaire
function handleSubmitForm(e) {
    e.preventDefault();
    if (!checkField()) {
        console.log("erreur de checkfield");
        return;
    }
    envoieObjet();
    console.log(" checlfield ok");
}

//fonction permettant de verifier que toutes les parties du formulaire soient valides
function checkField() {
    return (
        checkFieldFirstName() &&
        checkFieldLastName() &&
        checkFieldCity() &&
        checkFieldAddresse() &&
        checkFieldMail()
    );
}

// regEx pour le prenom (lettres + lettres speciales jusqu'a 31 caractères)
function checkFieldFirstName() {
    const regexLettre = /^[a-zA-Záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{2,31}$/i;
    const regExPrenom = (value) => {
        return regexLettre.test(value);
    };
    const prenom = document.querySelector("#firstName").value;
    const prenomError = document.querySelector("#firstNameErrorMsg");
    prenomError.textContent = "";
    //si le test regEx n'est pas compatible avec la valeur rentrée pa l'utilisateur on renvoie un message d'erreur
    if (regExPrenom(prenom)) {
        return true;
    } else {
        prenomError.textContent = "Merci de renseigner le prénom";
        return false;
    }
}

// regEx pour le pnom (lettres + lettres speciales jusqu'a 31 caractères)
function checkFieldLastName() {
    const regexLettre = /^[a-zA-Záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{2,31}$/i;
    const regExNom = (value) => {
        return regexLettre.test(value);
    };
    const nomErrorMsg = document.getElementById("lastNameErrorMsg");
    const nom = document.querySelector("#lastName").value;
    nomErrorMsg.textContent = "";
    if (regExNom(nom)) {
        return true;
    } else {
        nomErrorMsg.textContent = "Merci de renseigner le nom";
        return false;
    }
}

// regEx pour la ville (lettres + lettres speciales jusqu'a 31 caractères)
function checkFieldCity() {
    let regexLettre = /^[a-zA-Záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{2,31}$/i;
    const regExVille = (value) => {
        return regexLettre.test(value);
    };
    const villeErrorMsg = document.getElementById("cityErrorMsg");
    const ville = document.querySelector("#city").value;
    villeErrorMsg.textContent = "";
    if (regExVille(ville)) {
        return true;
    } else {
        console.log("falsecity");
        villeErrorMsg.textContent = "Merci de renseigner la ville";
        return false;
    }
}

// regEx pour l'adresse (lettres + lettres speciales + nombres, jusqu'a 60 caractères)
function checkFieldAddresse() {
    let regexChiffreLettre =
        /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{3,60}$/i;
    const regExAdresse = (value) => {
        return regexChiffreLettre.test(value);
    };
    const adresseErrorMsg = document.getElementById("addressErrorMsg");
    const adresse = document.querySelector("#address").value;
    adresseErrorMsg.textContent = "";
    if (regExAdresse(adresse)) {
        return true;
    } else {
        adresseErrorMsg.textContent = "Merci de renseigner l'adresse";
        return false;
    }
}

// regEx pour l'email (lettres + lettres speciales + nombre +  caractères spéciaux, @ obligatoire suivi de lettres puis . et 2 a 4 lettres)
function checkFieldMail() {
    let regMatchEmail =
        /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
    const regExMail = (value) => {
        return regMatchEmail.test(value);
    };

    const emailErrorMsg = document.getElementById("emailErrorMsg");
    const email = document.querySelector("#email").value;
    emailErrorMsg.textContent = "";
    if (regExMail(email)) {
        return true;
    } else {
        emailErrorMsg.textContent = "Merci de renseigner un email valide";
        return false;
    }
}

            // ENVOIE A L'API

// création des objets que l'on va envoyer a l'api (les valeurs du formulaire + un liste d'id des produits désiré)
function objetsPourApi() {
    let ValeursFormulaire = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
    };

    let idProduit = [];
    let panier = JSON.parse(localStorage.getItem("panier"));
    // récupération des id produit dans panierId
    if (panier && panier.length > 0) {
        for (let indice of panier) {
            idProduit.push(indice.id);
        }
    }
    infoClient={
        contact: ValeursFormulaire,
        products: idProduit,
    };
    return infoClient;
}

// envoi de l'objet créé a l'API et récupération du numero de commande envoyé a l'url vers la page de confirmation et nettoyage du localstorage
function envoieObjet() {
    console.log("ValeursFormulaire");
    let order= objetsPourApi();
    fetch("http://localhost:3000/api/products/order",{
        method: "POST",
        body: JSON.stringify(order),
        headers: { 
        "Accept": "application/json",
        'Content-Type': 'application/json' 
        },
      })
          .then((res) => res.json())
          .then((data) => {
            let orderId = data.orderId;

            
            window.location.assign("confirmation.html?id=" + orderId)
            
          });
};

main();

//fonction principale d'ou partent les utres fonctions
function main() {
    let url = "http://localhost:3000/api/products";
    getProductFromLS();

    if (PasDePanier()) {
        return;
    }
    getProductsFromAPI(url);
    AddEventForForm();
}
