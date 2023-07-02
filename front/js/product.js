const params = new URL(document.location).searchParams;
const id = params.get("id");
const url = `http://localhost:3000/api/products/${id}`;

const getArticle = () => {
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var userChoice = {
        id: data._id,
        quantity: 0,
        color: [],
      }
      const titleElement = document.getElementById("title");
      const priceElement = document.getElementById("price");
      const colorElement = document.getElementById("colors");
      const addButtonElement = document.getElementById("addToCart");
      const quantityElement = document.getElementById("itemQuantity");
      const addImg = document.createElement("img");
      document.querySelector(".item__img").appendChild(addImg);
      addImg.setAttribute("src", `${data.imageUrl}`);
      const addDescription = (document.getElementById("description").innerHTML = data.description);

      titleElement.innerHTML = data.name;
      priceElement.innerHTML = data.price;

      //Choix de la quantité 
      if (quantityElement) {
        quantityElement.addEventListener("change", function () {
          userChoice.quantity = quantityElement.value;
          console.log(userChoice);
        })
      }

      data.colors.map((color) => {
        var newOption = document.createElement("option");
        newOption.value = color ;
        newOption.text = color ;
        colorElement.appendChild(newOption);
      });
    })
};
//Condition clic
const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
  const addProduct = {
    qantity: document.getElementById("quantity").value,
    color: document.getElementById("colors").value,
    id: id
  }
  if (areInputsError(addProduct)) {
    //Je remonte un message lors de la sélèction de quantité de produit
    return;
  }
  let quantity = addProduct.qantity;
  let addProductlocalStorage = []
  if (localStorage.getItem("addToCart") !== null) {
    addProductlocalStorage = JSON.parse(localStorage.getItem("addToCart"));
  }
  let productExsitant = addProductlocalStorage.find(produit => produit.id == addProduct.id && produit.color == addProduct.color);
  if (productExsitant) {
    productExsitant.qantity = (Number(productExsitant.qantity) + Number(addProduct.qantity)).toString();
    if (areInputsError(productExsitant)) {
      //Je remonte un message lors de la sélèction de quantité de produit
      return;
    }
  }
  else {
    addProductlocalStorage.push(addProduct); }
  localStorage.removeItem('addToCart');
  localStorage.setItem("addToCart", JSON.stringify(addProductlocalStorage));

})

function areInputsError(productExsitant) {
  let message = "";
  let isError = false;
  if (!productExsitant.color || productExsitant.color == ""){
    message += "Vous n'avez pas choisi la couleur. ";
    isError = true;
  }

  if (Number(productExsitant.qantity) > 100) {
    message += "Vous avez dépassé la limite de commande. ";
    isError = true;
  }
  if (Number(productExsitant.qantity) < 1) {
    message += "Votre saisie est incorrect les chiffres nuls ou négatifs ne sont pas autorisés. ";
    isError = true;
  }
  if (productExsitant.qantity.indexOf(".") > -1 || productExsitant.qantity.indexOf(",") > -1) {
    message += "Seule les nombres entiers sont autorisés.";
    isError = true;
  }
  if (message != "") {
    alert(message);
  }
  return isError;
  //return (Number(productExsitant.qantity) > 100 || Number(productExsitant.qantity) < 1 || productExsitant.qantity.indexOf(".") >-1 ||productExsitant.qantity.indexOf(",") >-1 )
}
getArticle();