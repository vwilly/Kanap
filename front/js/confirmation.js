
//récupération de lid
function getIdFromUrl() {
    let params = new URL(document.location).searchParams;
    return params.get("id");
}

// affichage de l'id obtenu
function afficherID(id){
    let orderId = document.getElementById("orderId");
    orderId.textContent = id;
}
// fonction principale
function main() {
    let id= getIdFromUrl();
    afficherID(id);
    localStorage.clear();
}

main();