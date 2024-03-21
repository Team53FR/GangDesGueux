// Fonction pour masquer ou afficher tous les éléments de la page
function toggleElements() 
{
    var elements = document.querySelectorAll('body > *:not(#toggleButton)');
    elements.forEach(function(element) 
    {
      element.classList.toggle('hidden');
    });
}
  
// Écouteur d'événement pour le bouton
document.getElementById('toggleButton').addEventListener('click', toggleElements);
  