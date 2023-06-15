if (localStorage.getItem("addToCart") !== null) {
  addProductlocalStorage = JSON.parse(localStorage.getItem("addToCart"));
}
// Code JavaScript pour afficher les canapés sélectionnés dans le panier
document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart__items");

  // Obtenir les canapés sélectionnés et les quantités de localStorage
  let selectedProducts = [];
 
  showProducts();
  function showProducts() {
    if (localStorage.getItem("addToCart") !== null) {
      selectedProducts = JSON.parse(localStorage.getItem("addToCart"));
    }
    cartItemsContainer.innerHTML = "";
    fetch('http://localhost:3000/api/products/')
      .then(response => response.json())
      .then(data => {
        let somme = 0;
        // Parcourez les canapés sélectionnés et générez dynamiquement des éléments de panier
        selectedProducts.forEach(function (sofa) {
          let selectedProduct = data.find(produit => produit._id == sofa.id);
          somme += Number(sofa.qantity) * Number(selectedProduct.price);
          const cartItem = document.createElement("article");
          cartItem.classList.add("cart__item");
          cartItem.setAttribute("data-id", sofa.id);
          cartItem.setAttribute("data-color", sofa.color);

          const cartItemImage = document.createElement("div");
          cartItemImage.classList.add("cart__item__img");
          const sofaImage = document.createElement("img");
          sofaImage.src = selectedProduct.imageUrl; // Remplacer par l'URL réelle de l'image du canapé
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
          deleteText.setAttribute("id", "deleteItem");
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
            deleteProcduct(currentButton);
          }, false);
        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
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

    showProducts();
  }


});

