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
            id:data._id,
            quantity:0,
            color:[],
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
          if(quantityElement){
            quantityElement.addEventListener("change",function(){
              userChoice.quantity = quantityElement.value;
              console.log(userChoice);
            })
          }
          
          data.colors.map((color)=>{
            var newOption = document.createElement("option");
            newOption.value = color;
            newOption.text = color;
            colorElement.appendChild(newOption);
        });})
    };
        //Condition clic
    const addToCart = document .getElementById("addToCart");
    addToCart.addEventListener("click", () => {
      const addProduct ={
        qantity : document.getElementById("quantity").value,
        color : document.getElementById("colors").value,
        id : id
      }
    

   let addProductlocalStorage = []
    if(localStorage.getItem("addToCart") !==null){
        addProductlocalStorage = JSON.parse(localStorage.getItem("addToCart"))
        addProductlocalStorage.push(addToCart)
        localStorage.setItem("addToCart", JSON.stringify(addProductlocalStorage))
    }else {
      addProductlocalStorage.push(addProduct)
      localStorage.setItem("addToCart", JSON.stringify(addProductlocalStorage))

    }
  })
    getArticle();