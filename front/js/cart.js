if (localStorage.getItem("addToCart") !== null) {
  addProductlocalStorage = JSON.parse(localStorage.getItem("addToCart"));
}
// Code JavaScript pour afficher les canapés sélectionnés dans le panier
document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart__items");

  // Obtenir les canapés sélectionnés et les quantités de localStorage
  let selectedProducts = [];
  let allProducts = [];
  showProducts();
  checkNameCustomer();
  submitFuction ();
  
  function showProducts() {
    if (localStorage.getItem("addToCart") !== null) {
      selectedProducts = JSON.parse(localStorage.getItem("addToCart"));
    }
    cartItemsContainer.innerHTML = "";
    fetch('http://localhost:3000/api/products/')
      .then(response => response.json())
      .then(data => {
        allProducts = data;
        let somme = 0;
        // Parcoure les canapés sélectionnés et générez dynamiquement des éléments de panier
        selectedProducts.forEach(function (sofa) {
          let selectedProduct = data.find(produit => produit._id == sofa.id);
          somme += Number(sofa.qantity) * Number(selectedProduct.price);//calcule + ajout à la somme
          const cartItem = document.createElement("article");
          cartItem.classList.add("cart__item");
          cartItem.setAttribute("data-id", sofa.id);
          cartItem.setAttribute("data-color", sofa.color);

          const cartItemImage = document.createElement("div");
          cartItemImage.classList.add("cart__item__img");
          const sofaImage = document.createElement("img");
          sofaImage.src = selectedProduct.imageUrl; // Remplacer par l'URL réelle de l'image du canapé.
          sofaImage.alt = selectedProduct.altTxt;
          cartItemImage.appendChild(sofaImage);
          cartItem.appendChild(cartItemImage);
          const cartItemContent = document.createElement("div");
          cartItemContent.classList.add("cart__item__content");

          const cartItemDescription = document.createElement("div");
          cartItemDescription.classList.add("cart__item__content__description");
          const sofaName = document.createElement("h2");
          sofaName.innerText = selectedProduct.name; // Remplacer par le vrai nom du canapé
          const sofaColor = document.createElement("p");
          sofaColor.innerText = sofa.color;
          const sofaPrice = document.createElement("p");
          sofaPrice.innerText = ("PU: " + selectedProduct.price + "€"); // Remplacer par le prix réel du canapé

          cartItemDescription.appendChild(sofaName);
          cartItemDescription.appendChild(sofaColor);
          cartItemDescription.appendChild(sofaPrice);
          cartItemContent.appendChild(cartItemDescription);
          const cartItemSettings = document.createElement("div");
          cartItemSettings.classList.add("cart__item__content__settings");
          const cartItemQuantity = document.createElement("div");
          cartItemQuantity.classList.add("cart__item__content__settings__quantity");
          const quantityLabel = document.createElement("p");
          quantityLabel.innerText = "Qté :";
          const quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.classList.add("itemQuantity");
          quantityInput.name = "itemQuantity";
          quantityInput.min = "1";
          quantityInput.setAttribute("identifiant", sofa.id);
          quantityInput.setAttribute("color", sofa.color);
          quantityInput.max = "100";
          quantityInput.value = sofa.qantity;
          cartItemQuantity.appendChild(quantityLabel);
          cartItemQuantity.appendChild(quantityInput);
          cartItemSettings.appendChild(cartItemQuantity);
          const cartItemDelete = document.createElement("div");
          cartItemDelete.classList.add("cart__item__content__settings__delete");
          const deleteText = document.createElement("p");
          deleteText.classList.add("deleteItem");
          deleteText.innerText = "Supprimer";
          deleteText.setAttribute("identifiant", sofa.id);
          deleteText.setAttribute("color", sofa.color);
          cartItemDelete.appendChild(deleteText);
          cartItemSettings.appendChild(cartItemDelete);
          cartItemContent.appendChild(cartItemSettings);
          cartItem.appendChild(cartItemContent);

          cartItemsContainer.appendChild(cartItem);
        });
        document.getElementById("totalPrice").innerHTML = somme;//Somme totale des canapés
        const deletesButton = document.getElementsByClassName("deleteItem");

        for (var i = 0; i < deletesButton.length; i++) {
          let currentButton = deletesButton[i];
          currentButton.addEventListener("click", () => {
            //alert("suppression");
            deleteProcduct(currentButton);//fonction de suppression du produit associé du panier
          }, false);
        }

        const quantityInputs = document.getElementsByClassName("itemQuantity");

        for (var i = 0; i < quantityInputs.length; i++) {
          let currentInput = quantityInputs[i];
          currentInput.addEventListener("change", () => {
            updateProcduct(currentInput);//mettre à jour le produit associé dans le panier avec la nouvelle quantité
          }, false);
        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function checkNameCustomer(){
    
    let firstNameInput = document.getElementById("firstName");
    firstNameInput.addEventListener("change", () => {
      if (!firstNameInput.value || !firstNameInput.value.match(/^([^0-9]*)$/)){//Mise en place de Regex
        document.getElementById("firstNameErrorMsg").innerHTML = "le prénom n'est pas renseigné. ";
      }
      else {
        document.getElementById("firstNameErrorMsg").innerHTML = "";
      }
      
    }, false);

    let lastNameInput = document.getElementById("lastName");
    lastNameInput.addEventListener("change", () => {
      if (!lastNameInput.value || !lastNameInput.value.match(/^([^0-9]*)$/)){//Mise en place de Regex
        document.getElementById("lastNameErrorMsg").innerHTML = "le nom n'est pas renseigné. ";
      }
      else {
        document.getElementById("lastNameErrorMsg").innerHTML = "";
      }
      
    }, false);
  }

  //Cette fonction est appelée lorsque la quantité d'un produit est mise à jour
  //Il récupère l'ID et la couleur du produit à partir de l' elementargument (qui est un champ de saisie).
  function updateProcduct(element) {

    let id = element.getAttribute("identifiant");
    let color = element.getAttribute("color");
    let updateProcductslocalStorage = []
    if (localStorage.getItem("addToCart") !== null) {
      updateProcductslocalStorage = JSON.parse(localStorage.getItem("addToCart"));
    }

    if (element.value.indexOf(".") > -1 || element.value.indexOf(",") > -1) {
      alert("Seule les nombres entiers sont autorisés.");
      return;
    }

    let productExsitant = updateProcductslocalStorage.find(produit => produit.id == id && produit.color == color);
    if (productExsitant) {
      productExsitant.qantity = element.value;
      if (Number(element.value) <= 0) {
        deleteProcduct(element);
        return;
      }
    }
    recalculateTotal(updateProcductslocalStorage);
    localStorage.removeItem('addToCart');
    localStorage.setItem("addToCart", JSON.stringify(updateProcductslocalStorage));


  }
  function submitFuction () {
    document.querySelector("form").addEventListener("submit", (e)=>{
      //document.getElementById("order").addEventListener("click", ()=>{
        //$(".cart__order__form").submit(function(e){
      let hasError = false;
      var fstName = document.getElementById("firstName").value;
      var lastName = document.getElementById("lastName").value;
      var address = document.getElementById("address").value;
      var city = document.getElementById("city").value;
      var email = document.getElementById("email").value;
      let regEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
    
      if (!email || email == "" || !email.match (regEmail)){
       // msg += "l'email n'est pas bien renseigné. " ;
       document.getElementById("emailErrorMsg").innerHTML = "l'email n'est pas bien renseigné. " ;
        hasError = true;
      }
      else {
        document.getElementById("emailErrorMsg").innerHTML = "";
      }
  
      if (!address || address == ""){
        //msg += "l'adresse n'est pas renseigné. ";
        document.getElementById("addressErrorMsg").innerHTML = "l'adresse n'est pas renseigné. ";
        hasError = true;
      }
      else {
        document.getElementById("addressErrorMsg").innerHTML = "";
      }
  
      if (!city || city == ""){
        //msg += "la ville n'est pas renseigné. ";
        document.getElementById("cityErrorMsg").innerHTML = "la ville n'est pas renseigné. ";
        hasError = true;
      }
      else {
        document.getElementById("cityErrorMsg").innerHTML = "";
      }
  
      if (!fstName || fstName == "" || !fstName.match (/^([^0-9]*)$/)){
        //msg += "le prénom n'est pas renseigné. ";
        document.getElementById("firstNameErrorMsg").innerHTML = "le prénom n'est pas renseigné. ";
        hasError = true;
      }
      else {
        document.getElementById("firstNameErrorMsg").innerHTML = "";
      }
  
      if (!lastName || lastName == "" || !lastName.match (/^([^0-9]*)$/)){
        //msg += "le nom n'est pas renseigné";
        document.getElementById("lastNameErrorMsg").innerHTML = "le nom n'est pas renseigné";
        hasError = true;
      }
      else {
        document.getElementById("lastNameErrorMsg").innerHTML = "";
      }
      let productsInCart = [];
      
      if (localStorage.getItem("addToCart") !== null) {
        let cart = JSON.parse(localStorage.getItem("addToCart"));
        for (var i = 0; i < cart.length; i++) {
          productsInCart.push(cart[i].id);
        }
      }
      if(productsInCart.length == 0){
        alert("Veuillez sélectionner un produits avant de passer à la commande.");
      }
      if (hasError || productsInCart.length == 0){
        e.preventDefault();
         return;
      }
      
  
      let customer = {
        firstName : fstName, 
        lastName : lastName,
        address : address,
        city : city,
        email : email
      };
      
      let cmd = {
        contact: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          address: customer.address,
          city: customer.city,
          email: customer.email,
        },
        products : productsInCart,
      };
    
      fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
         //  'Access-Control-Allow-Origin':'*'
          // 'Content-Type': 'application/x-www-form-urlencoded',
         },
        body: JSON.stringify(cmd),
      })
        .then(response => response.json())
        .then(data => {
            let orderId = data.orderId;
            var query = new URLSearchParams();
            query.append("orderId", orderId);
            localStorage.removeItem('addToCart');//Suppression de la donnée une fois la confirmation de la commande
            location.href = "/front/html/confirmation.html?" + query.toString();
        })
        .catch(data => {
          alert ("une erreur c'est produite");
      });
      e.preventDefault();
    });
  }

  function recalculateTotal(updateProcductslocalStorage){
    let somme = 0;
    updateProcductslocalStorage.forEach(function (sofa) {
      let selectedProduct = allProducts.find(produit => produit._id == sofa.id);
      somme += Number(sofa.qantity) * Number(selectedProduct.price);
    });
    document.getElementById("totalPrice").innerHTML = somme;//Somme totale des canapés
  }
  //Cette fonction est appelée lors du clic sur le bouton "Supprimer" pour un produit
  //Il récupère l'ID et la couleur du produit à partir de l' elementargument (qui est le bouton de suppression)
  //Il met ensuite à jour localStorage et appelle showProducts pour actualiser les produits affichés et le prix total.
  function deleteProcduct(element) {
    let id = element.getAttribute("identifiant");
    let color = element.getAttribute("color");
    let deleteProductlocalStorage = []
    if (localStorage.getItem("addToCart") !== null) {
      deleteProductlocalStorage = JSON.parse(localStorage.getItem("addToCart"));
    }

    let productExsitant = deleteProductlocalStorage.find(produit => produit.id == id && produit.color == color);
    if (productExsitant) {
      deleteProductlocalStorage.splice(deleteProductlocalStorage.indexOf(productExsitant), 1);
    }

    localStorage.removeItem('addToCart');
    localStorage.setItem("addToCart", JSON.stringify(deleteProductlocalStorage));
    document.querySelector("[data-id = '" + id + "'][data-color = '"+ color + "']").remove();
    recalculateTotal(deleteProductlocalStorage);
    //showProducts(); //Actualise les produits affichés et le prix total
  }
});


