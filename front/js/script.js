main();

//fonction générale lors du chargement de la page
function main() {
    let url = "http://localhost:3000/api/products";
    getProductsFromAPI(url);
}

// récupération des produits depuis le backend
function getProductsFromAPI(url) {
    fetch(url)
        .then((initialiation) => initialiation.json())

        .then((produits) => {
            afficheProduits(produits);
        })
        .catch((e) => {
            console.log("getProductsFromAPI : Le back ne fonctionne pas", e);
            let affichage = document.getElementById("items");
            affichage.textContent =
                "Une erreur est apparue, merci de revenir plus tard";
        });
}
// fontion sevant a appeler l'affichage de produit ou alerter si aucun produit n'est a afficher
function afficheProduits(produits) {
    if (produits == [] || produits == null) {
        alert("Aucun produit à afficher");
        console.log("afficheProduits : la variable produit est vide");
        return;
    }
	// on utilise la fonction afficheProduit pour chaque produit de l'API
    for (let produit of produits) {
        afficheProduit(produit);
    }
}

// on affiche le produit en créant chaque partie de son html en fonction des données de l'API
function afficheProduit(produit) {
    let a = document.createElement("a");
    let affichage = document.getElementById("items");
    let article = document.createElement("article");
    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");

    if (produit === null) {
        alert("Aucun produit à afficher");
        console.log("afficheProduit : la variable produit est vide");
        return;
    }

    a.href = `./product.html?id=${produit._id}`;

    img.setAttribute("src", produit.imageUrl);
    img.setAttribute("alt", produit.altTxt);

    h3.classList.add("productName");
    h3.textContent = produit.name;

    p.classList.add("productDescription");
    p.textContent = produit.description;

    affichage.appendChild(a);
    a.appendChild(article);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
}
