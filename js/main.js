//*HTML'den alınan elemanlara Globalde değişken atama;
const productList = document.querySelector("#productList");
const cardItemsElement = document.getElementById("cardItems");
const cardTotalElement = document.getElementById("cardTotal");
const cardIcon = document.getElementById("card-icon");
const menuIcon = document.getElementById("menu-icon")
const navMenu = document.getElementById("navMenu")

let card = JSON.parse(localStorage.getItem("card")) || [];

//* Ürünler;
const products = [
  {
    id: 1,
    title: "Autumn Hoodie",
    price: 264.9,
    image:
      "https://pangaia.com/cdn/shop/products/Recycled-Nylon-NW-Flwrdwn-Quilted-Collarless-Jacket-Cerulean-Blue-Female-1_bf4b2a54-8a7f-4174-bc49-8ef22b24bfdd.jpg?v=1666708230&width=1426",
  },
  {
    id: 2,
    title: "Fusion Hoodie",
    price: 295,
    image:
      "https://images.undiz.com/on/demandware.static/-/Sites-ZLIN-master/default/dw2264d914/merch/BTS/654206666_x.jpg?sw=1250",
  },
  {
    id: 3,
    title: "Chestnut Brown",
    price: 74.9,
    image:
      "https://pangaia.com/cdn/shop/products/Recycled-Cashmere-Core-Hoodie-Chestnut-Brown-Male-1.jpg?v=1663947464&width=1426",
  },
  {
    id: 4,
    title: "Nike Sportswear",
    price: 80,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/sportswear-club-mens-french-terry-crew-neck-sweatshirt-tdFDRc.png",
  },
  {
    id: 5,
    title: "Champion BASIC",
    price: 48.99,
    image:
      "https://img01.ztat.net/article/spp-media-p1/7067458719b744fe81ffee62d3d0b912/abad421e7d8e47f08a2abc1c6ffe07dc.jpg?imwidth=1800",
  },
  {
    id: 6,
    title: "Cotton Hoodie",
    price: 395,
    image:
      "https://pangaia.com/cdn/shop/files/Reclaim-3.0-Hoodie-Reclaim-Jade-Womens-3.jpg?v=1693398673&width=1426",
  },
  {
    id: 7,
    title: "CLASSIC CREWNECK",
    price: 48.99,
    image:
      "https://img01.ztat.net/article/spp-media-p1/10cea44041564f81ac585fc6c8978907/c4c32dbc45dd4dbc9d15087c846538f2.jpg?imwidth=1800",
  },
  {
    id: 8,
    title: "TAPE HOODED",
    price: 79.99,
    image:
      "https://img01.ztat.net/article/spp-media-p1/d391f90be278469ebfdff731800cfccc/6d2101bd672f4e059501f01fe726f315.jpg?imwidth=1800",
  },
];

//*Ürünleri ekrana yazdırma;
function renderProducts() {
  productList.innerHTML = products
    .map(
      (product) =>
        `<div class="product">
        <img
          src="${product.image}"
          alt=""
          class="product-img"
        />
       <div class="product-info">
         <h3>${product.title}</h3>
         <p>${product.price}</p>
       </div>
       <a href="" class="addToCard" data-id="${product.id}">Add To Card</a>
      </div>`
    )
    .join("");
   

  const addToCardButtons = document.getElementsByClassName("addToCard");
  //*Tıklama olayı(add to card)
  for (let i = 0; i < addToCardButtons.length; i++) {
    const addToCardButton = addToCardButtons[i];
    addToCardButton.addEventListener("click", addToCard);
    
  }
  
}

//*Cartın içerisindeki toplam miktarı yansıtma,
function calculateCardTotal() {
  const total = card.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cardTotalElement.innerHTML = `
  <h2><span>Total: </span>$${total.toFixed(2)}</h2>
  `;
}

//*Sepete ekleme işlemi;
function addToCard(e) {
  e.preventDefault();
  const buttonAdded = e.target;
  /// 'Added' olarak değiştir ve arka plan rengini kırmızı yap
  buttonAdded.innerText = 'Added';
  buttonAdded.style.backgroundColor = "crimson"
  buttonAdded.style.boxShadow = "0 0 10px black"

  // 1 saniye sonra 'Add To Cart' olarak geri döndür
  setTimeout(() => {
    buttonAdded.innerText = 'Add To Cart';
    buttonAdded.style.backgroundColor = "";// Varsayılan veya önceden belirlenmiş bir renge döner
    buttonAdded.style.boxShadow ="";
  }, 1000);
  //*Ekle butonuna tıkladığımızda sepete ekleyeceğimiz ürünün id'sine erişme,
  const productID = parseInt(e.target.dataset.id);
  //*Dizinin içinden tıkladığımız elemanı bulmak için find metodunu kullandık.
  const product = products.find((product) => product.id === productID);

  if (product) {
    //*sepete eklediğimiz ürün var mı yok mu?
    const exixtingItem = card.find((item) => item.id === productID);
    //*Sepete eklediğimiz ürün varsa miktarı bir arttır.
    if (exixtingItem) {
      exixtingItem.quantity++;
    } else {
      //*Tıklanan ürün sepette yoksa yeni ürün şeklinde ekleriz.
      const cardItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
      //*Yeni oluşturduğumuz ürünü card dizisine ekleriz.
      card.push(cardItem);
    }
    updateCardIcon();
  }

  //*sayfayı günceller;
  saveToLocalStorage();
  //*ürün toplam fiyatı günceller;
  calculateCardTotal();
  //*Toplam miktarı günceller
  updateCardIcon();
}

//**Card dizisinden ve Local storage'dan silmek istediğimiz ürünü sildik ve güncelledik. */
function removeFromCard(e) {
  const productID = parseInt(e.target.dataset.id);
  //*Card ve Local'den silmek istediğimiz ürünü filter metodu ile sildik,
  card = card.filter((item) => item.id !== productID);
  //*LocalStorage update edildi.
  saveToLocalStorage();
  //*Sepet update edildi.
  renderCardItems();
  //*ürün toplam fiyatı günceller;
  calculateCardTotal();
  //*Toplam miktarı günceller
  updateCardIcon();
}

//*İnputun içerisimdeki miktar değişince çalışacak fonksiyon;
function changeQuantity(e) {
  const productID = parseInt(e.target.dataset.id);
  const quantity = parseInt(e.target.value);

  if (quantity > 0) {
    const cardItem = card.find((item) => item.id === productID);
    if (cardItem) {
      cardItem.quantity = quantity;
      saveToLocalStorage();
      calculateCardTotal();
      updateCardIcon();
    }
  }
}

//*Local storage'a verileri eklemek için kullandık.
function saveToLocalStorage() {
  localStorage.setItem("card", JSON.stringify(card));
}
//* Sepette card objelerini oluşturmak için kullandık,
function renderCardItems() {
  cardItemsElement.innerHTML = card
    .map(
      (item) =>
        `
    <div class="card-item">
        <img
            src="${item.image}"
            alt="${item.title}"
        />
        <div class="card-info">
            <h2 class="card-item-title">${item.title}</h2>
            <input
            type="number"
            min="1"
            value="${item.quantity}"
            class="card-item-quantity"
            data-id="${item.id}"
            />
        </div>
        <h2 class="card-price">$${item.price}</h2>
        <button class="remove-from-card" data-id="${item.id}">REMOVE</button>
    </div>
    `
    )
    .join("");

  //*sepetteki carta tıklanma olayı ekleme;
  const removeButtons = document.getElementsByClassName("remove-from-card");
  for (let i = 0; i < removeButtons.length; i++) {
    const removeButton = removeButtons[i];
    removeButton.addEventListener("click", removeFromCard);
  }

  const quantityInputs = document.getElementsByClassName("card-item-quantity");

  for (let i = 0; i < quantityInputs.length; i++) {
    const quantityInput = quantityInputs[i];
    quantityInput.addEventListener("change", changeQuantity);
  }
}

// *Hangi sayfada ise o fonksiyonun aktif olasını sağladık.
if (window.location.pathname.includes("card.html")) {
  renderCardItems();
  //*ürün toplam fiyatı günceller;
  calculateCardTotal();
  updateCardIcon()
} else {
  renderProducts();
}

function updateCardIcon() {
  const totalQuantity = card.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-icon-quantity").textContent = totalQuantity;
}
//*menu iconu tıklanma olayı;

function toggleNavbarDisplay(){
  navMenu.classList.toggle('navbarDisplay');
};

menuIcon.addEventListener("click", (e)=>{
  //*menuyü göster
  toggleNavbarDisplay();
  //*event bublingi durdur
  e.stopPropagation();
});

document.addEventListener("click", ()=>{
  if (navMenu.classList.contains("navbarDisplay")){
    navMenu.classList.remove("navbarDisplay")
  }
});

//*Menu içindeki tıklanmaların menuyü kapatmaması için;
navMenu.addEventListener("click", (e)=>{
  e.stopPropagation();
})


renderProducts();
updateCardIcon();
