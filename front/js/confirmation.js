const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let orderId = urlParams.get("orderId");
//alert(orderId);
document.getElementById("orderId").innerHTML = orderId;