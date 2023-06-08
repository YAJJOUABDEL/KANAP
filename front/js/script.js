// Fetch the JSON data
fetch('http://localhost:3000/api/products/')
  .then(response => response.json())
  .then(data => {
    const itemsContainer = document.getElementById('items');

    // Itérer sur les données produit
    data.forEach(product => {
      // Créer l'élément produit
      const productElement = document.createElement('a');
      productElement.href = `./product.html?id=${product._id}`;
      productElement.innerHTML = `
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      `;

      // Ajouter l'élément product au conteneur items
      itemsContainer.appendChild(productElement);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });