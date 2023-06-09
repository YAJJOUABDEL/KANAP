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

          titleElement.innerHTML = data.name;
          priceElement.innerHTML = data.price;
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

    getArticle();