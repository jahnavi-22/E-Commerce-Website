//LOGIN
function login(){
    document.getElementById('loginform').addEventListener('submit', function(event) {
        event.preventDefault();

        var userType = document.querySelector('input[name="account"]:checked');
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var users = JSON.parse(localStorage.getItem('users')) || [];

        console.log(users);

        var authenticatedUser = users.find(function(user) {
            return user.userType === userType.id && user.username === username && user.password === password;
        });

        console.log(authenticatedUser);


        if (authenticatedUser) {
            localStorage.removeItem('username');

            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userType', userType);
            localStorage.setItem('username', username);

            localStorage.setItem('userId', username);

            if (userType.id === 'user') {
                window.location.href = 'user.html'; 
            } else if (userType.id === 'admin') {
                window.location.href = 'admin.html'; 
            }
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });
}





//ADMIN
function logout(){
    const userId = localStorage.getItem('userId');

    if(userId){
        localStorage.removeItem('userId');
        localStorage.setItem('loggedIn', 'false'); 
        alert('User signed out.')
        window.location.href = "login.html";
    } 
}

var data = JSON.parse(localStorage.getItem("Products")) || [];


let serialNumber;
if (Object.keys(data).length > 0 && data.every(item => typeof item.serialNumber === 'number')) {
  serialNumber = Math.max(...data.map(item => item.serialNumber)) + 1;
} else {
  serialNumber = 1;
}



let displayNumberOfProducts = 3;


function generateProductId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  const productId = `${timestamp}${randomNum}`;
  return productId;
}


function addProduct(){
    const productName = document.querySelector("#name").value;
    const productDescription = document.querySelector("#description").value;
    const productPrice = parseInt(document.querySelector("#price").value);
    const productQuantity = parseInt(document.querySelector("#quantity").value);
    const productImage = document.querySelector("#image").value;

    if(productName && productDescription && productPrice && !isNaN(productPrice) && productQuantity && !isNaN(productQuantity)){
        const alreadyexists = data.findIndex((x) => x.productName === productName);
        const pid = generateProductId();
        
        if(alreadyexists === -1){
            data.push({pid, serialNumber, productName, productImage, productDescription, productPrice, productQuantity});
            localStorage.setItem("Products", JSON.stringify(data));
            serialNumber++;
            document.querySelector("#name").value = "";
            document.querySelector("#description").value = "";
            document.querySelector("#price").value = "";
            document.querySelector("#quantity").value = "";
            document.querySelector("#image").value = "";
            displayList();
        }else{
            alert("Product already exists")
        }
    }else{
        alert("Please fill in all the fields.")
    }
}

function removeProduct(id){
    data = data.filter((item) => item.pid !== id);
    data.forEach((item, index) => {
        item.serialNumber = index+1;
    });
if(data.length > 0)
        serialNumber = data[data.length - 1].serialNumber + 1;
    else    
        serialNumber = 1;
    localStorage.setItem("Products", JSON.stringify(data));
    displayList();
}

function updateProduct(id){
    const modal = document.querySelector("#modal");

    const index = data.findIndex((x) => x.pid === id);
    if(index !== -1){
        const product = data[index];
        document.getElementById("updatedName").value = product.productName;
        document.getElementById("updatedPrice").value = product.productPrice;
        document.getElementById("updatedQuantity").value = product.productQuantity;
        document.getElementById("updatedDescription").value = product.productDescription;
        document.getElementById("updatedImage").value = product.productImage;

        modal.style.display = "block";

        document.querySelector("#updateButton").onclick = function(){
            const updatedName = document.getElementById("updatedName").value;
            const updatedDescription = document.getElementById("updatedDescription").value;
            const updatedPrice = parseFloat(document.getElementById("updatedPrice").value);
            const updatedQuantity = parseInt(document.getElementById("updatedQuantity").value);
            const updatedImage = document.getElementById("updatedImage").value;
 
            if(updatedName && updatedDescription && !isNaN(updatedPrice) && !isNaN(updatedQuantity) && updatedImage){
                data[index].productName = updatedName;
                data[index].productDescription = updatedDescription;
                data[index].productPrice = updatedPrice;
                data[index].productQuantity = updatedQuantity;
                data[index].productImage = updatedImage;

                localStorage.setItem("Products", JSON.stringify(data));
                modal.style.display = "none";
                displayList();
            }else{
                alert("Invalid input. Product was not updated.")
            }
        };
    }
}

function closeUpdateModal() {
    const modal = document.querySelector("#modal");
    modal.style.display = "none";
  }

function displayList(){
    var users = JSON.parse(localStorage.getItem('users')) || [];
    var username = localStorage.getItem('username');
     var currentUser = users.find(function(user) {
        return user.username === username;
    });


 

    const tableBody = document.querySelector("#productsBody");
    if(tableBody !== null)
        tableBody.innerHTML = "";
        
    
    data.forEach((item, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = index+1;
        row.style.textAlign = "center";

        const productImageCell = row.insertCell(1);
        productImageCell.innerHTML = `<img src="${item.productImage}" alt="Product Image" style="display: block; margin: 0 auto; width: 200px; height: 150px; object-fit: contain;">`;
        productImageCell.style.textAlign = "center"; 

        
        row.insertCell(2).innerText = item.productName;
        row.insertCell(3).innerText = item.productDescription;
        row.insertCell(4).innerText = `Rs.${item.productPrice}`;
        row.insertCell(5).innerText = item.productQuantity;

        console.log(currentUser);
        if(currentUser && currentUser.userType === 'admin'){
            const cell = row.insertCell(6);
            const removeButton = createButton("Remove", () => removeProduct(item.pid));
            const space = document.createTextNode("    ");
            const updateButton = createButton("Update", () => updateProduct(item.pid));
            cell.appendChild(removeButton);
            cell.appendChild(space);
            cell.appendChild(updateButton);
        }else {
            const cell = row.insertCell(6);
            const addToCartButton = createButton("Add to Cart", () => addToCart(item.pid));
            cell.appendChild(addToCartButton);
        }
    });
    localStorage.setItem("Products", JSON.stringify(data));
}

function createButton(text, onclick){
    const button = document.createElement("button");
    button.innerText = text;
    button.className = "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
    button.addEventListener('click', onclick);
    return button;
}





//USER
function checkLogin(){
    const isLoggedIn = localStorage.getItem('loggedIn');
    if(isLoggedIn === "true")
      window.location.href = "cart.html";
    else  
      alert("Please log in.")
  }

  function logout(){
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if(userId){
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.setItem('loggedIn', 'false'); 
        alert('User signed out.')
        window.location.href = "index.html";
    } 
}

function checkLoginforDisplay(){
    const isLoggedIn = localStorage.getItem('loggedIn');

     if (isLoggedIn === 'true') {
        document.getElementById('logOut').style.display = 'block';
    } else {
        document.getElementById('logOut').style.display = 'none';
    }
}


    document.addEventListener("DOMContentLoaded", function () {
        const currentPage = window.location.pathname.split("/").pop();
        var users = JSON.parse(localStorage.getItem('users')) || [];

        if(currentPage === "user.html"){
            displayList();
            checkLoginforDisplay();
        }

        if(currentPage === "cart.html"){
            displayCart();
          }

        if(currentPage === "admin.html"){
            displayList();
          }

        if (users.length === 0 && 
            currentPage !== "login.html" && currentPage !== "register.html" && currentPage !== "user.html" && currentPage !== "index.html"){
            window.location.href = "index.html";
          } 
      });




//CART
let cart = JSON.parse(localStorage.getItem("Cart")) || [];


function addToCart(id){
    const index = data.findIndex((x) => x.pid == id);
    const product = data[index];
    let maxQuantity = product.productQuantity;

    const isLoggedIn = localStorage.getItem('loggedIn');
    if(isLoggedIn === "false"){
        alert("Please login to add products to the cart.");
        return;
    }
    else{
        var username = localStorage.getItem('username');
        const existingCart = cart.find((item) => item.user === username);

        if(existingCart){
            const existingProduct = existingCart.cartProducts.find((x) => x.pid === product.id);
            if(existingProduct){
                if(existingProduct.productQuantity < maxQuantity){
                    existingProduct.productQuantity+=1;
                    alert('Product quantity increased.')
                }else{
                    alert('Maximum product quantity reached.')
                }
        }else{
            existingCart.cartProducts.push({
                pid : product.id,
                cartProductImage : product.productImage,
                cartProductName : product.productName,
                cartProductDescription : product.productDescription,
                cartProductPrice : product.productPrice,
                cartProductQuantity : 1,
            });
            alert("Product successfully added to cart.");
        }
      } else{
        cart.push({
            user: username,
            cartProducts : [{
                pid : product.id,
                cartProductImage : product.productImage,
                cartProductName : product.productName,
                cartProductDescription : product.productDescription,
                cartProductPrice : product.productPrice,
                cartProductQuantity : 1,
            }, ],
        });
        alert("Product successfully added to cart.");
      }
    } 
    localStorage.setItem("Cart", JSON.stringify(cart));
}


function displayCart(){
    const cartBody = document.querySelector("#cartBody");
    cartBody.innerHTML = "";

    var username = localStorage.getItem('username');
    const existingCart = cart.find((item) => item.user === username);

    existingCart.cartProducts.forEach((item, index) => {
        const product = data.find((x) => x.productName === item.cartProductName); 

        const row = cartBody.insertRow();
        row.insertCell(0).innerText = index+1;
        row.style.textAlign = "center";

        const productImageCell = row.insertCell(1);
        productImageCell.innerHTML = `<img src="${item.cartProductImage}" alt="Product Image" style="display: block; margin: 0 auto; width: 200px; height: 150px; object-fit: contain;">`; // Updated to use cartProductImage

        row.insertCell(2).innerText = item.cartProductName; 
        row.insertCell(3).innerText = item.cartProductDescription; 
        row.insertCell(4).innerText = `Rs.${item.cartProductPrice}`; 
        row.insertCell(5).innerText = item.cartProductQuantity; 

        const cell = row.insertCell(6);
        const deleteButton = createButton("Delete", () => deleteProduct(item.pid));
        cell.appendChild(deleteButton);
    })
    localStorage.setItem("Cart", JSON.stringify(cart));
}


function deleteProduct(id) {
    var username = localStorage.getItem('username');
    const existingCart = cart.find((item) => item.user === username);
    existingCart.cartProducts = existingCart.cartProducts.filter((x) => x.pid !== id);
    localStorage.setItem("Cart", JSON.stringify(cart));
    displayCart();
}





