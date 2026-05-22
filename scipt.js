const SEARCH_API_URL="https://www.themealdb.com/api/json/v1/1/search.php?s=";

const Searchform=document.getElementById("search-form");
const searchInput=document.getElementById("search-input");
const resultsGrid=document.getElementById("results-grid");
const messageArea=document.getElementById("message-area");

Searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    const searchTerm=searchInput.value.trim();
    console.log("SearchIterm:",searchTerm);

    if(searchTerm){
        searchRecipies(searchTerm);
    }else{
        showMessage("Please enter a search term",true);
    }
});

async function searchRecipies(query){
     showMessage(`Searching for "${query}"...`,false,true);
     resultsGrid.innerHTML="";

     try{
        const response=await fetch(`${SEARCH_API_URL}${query}`);

        if(!response.ok){
            throw new Error("NetworkError");
        }
          const data=await response.json();

          clearMessage();

          console.log(data);

          if(data.meals){
            displayRecipes(data.meals);
          }else{
            showMessage(`No recipes founnd for "${query}"`);
          }

     }catch(error){
        showMessage("something went wrong, Please try again.",true);
     }
}

function showMessage(message,isError=false,isLoading=false){
     clearMessage();
    messageArea.classList.add("error");

    if(isError){
        messageArea.textContent=message;
    }

    if(isLoading){
        messageArea.classList.add("loading");
    }
}

function clearMessage(){
    messageArea.textContent="";
    messageArea.className="message";
}

function displayRecipes(recipes){
    if(!recipes|| recipes.length===0){
        showMessage("No recipes to display");
        return;
    }
recipes.forEach((recipe)=>{
     const recipeDiv=document.createElement("div");
     recipeDiv.classList.add("recipe-item");
     recipeDiv.dataset.id=recipe.idMeal;

     recipeDiv.innerHTML=`
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">

    <div class="img-text">

        <h3 class="product-title">${recipe.strMeal}</h3>

        <span class="price">₹100</span>

        <i class="fa-solid fa-cart-plus add-cart"></i>

    </div>
`;

      resultsGrid.appendChild(recipeDiv);
});

}

const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
    cart.classList.add("active");
});

cartClose.addEventListener("click", () => cart.classList.remove("active"));

resultsGrid.addEventListener("click",(e)=>{

    if(e.target.classList.contains("add-cart")){

        const productBox=e.target.closest(".recipe-item");

        addToCart(productBox);
    }

});

const cartContent=document.querySelector(".cart-content");
 cartContent.addEventListener("click", (event) => {

    const cartItem = event.target.closest(".cart-box");
    if (!cartItem) return;

    const quantityElement = cartItem.querySelector(".number");

    let currentQuantity = Number(quantityElement.textContent);

    // Increase quantity
    if (event.target.classList.contains("increment")) {
        currentQuantity = currentQuantity + 1;
        quantityElement.textContent = currentQuantity;
        updateTotalPrice();
    }

    // Decrease quantity
    if (event.target.classList.contains("decrement")) {
        if (currentQuantity > 1) {
            currentQuantity = currentQuantity - 1;
            quantityElement.textContent = currentQuantity;
            updateTotalPrice();
        }
    }
});

const addToCart = (productBox) => {

    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;

    const cartItems = cartContent.querySelectorAll(".cart-product-title");

    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            alert("This item is already in the cart.");
            return;
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    cartBox.innerHTML = `
        <img src="${productImgSrc}" alt="">

        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>

            <div class="cart-quantity">
                <button class="decrement">-</button>
                <span class="number">1</span>
                <button class="increment">+</button>
            </div>
        </div>

        <i class="fa-solid fa-trash-can cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    // REMOVE
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateTotalPrice();
    });

    updateTotalPrice();
};
function updateTotalPrice(){

    let total = 0;

    document.querySelectorAll(".cart-box").forEach(item => {

        const price = Number(
            item.querySelector(".cart-price").textContent.replace("₹","")
        );

        const qty = Number(
            item.querySelector(".number").textContent
        );

        total += price * qty;
    });

    document.querySelector(".total-price").textContent = "₹" + total;
}