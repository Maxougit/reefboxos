import Swal from "sweetalert2";

const sweetAlert = (error) => {
  let title = "";
  let text = "";
  let icon = "error"; // Défini par défaut sur "error"

  if (error === "insufficient_rights") {
    title = "Manque d'autorisation";
    text =
      "Vous n'avez pas les droits, veuillez accorder les droits dans les paramètres de la Freebox > Gestion des accès > Applications > ReefBoxOS";
  } else {
    // Ajoutez d'autres conditions pour gérer d'autres erreurs
    // Par exemple :
    // title = "Erreur inconnue";
    // text = "Une erreur inconnue est survenue.";
  }

  // Déclencher l'alerte SweetAlert
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: "Ok",
  });
};

export default sweetAlert;
