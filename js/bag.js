'use strict';

var menuFunction = function menuFunction() {
    var searchButton = document.body.querySelector('.header-search-btn');
    var searchInput = document.body.querySelector('.header-search > input');
    var openMenuBtn = document.getElementById('menuBtn');
    var menuContainer = document.body.querySelector('.header-nav-container');

    searchButton.addEventListener('click', function () {
        searchInput.classList.toggle('search-field-visible');
    });

    openMenuBtn.addEventListener('click', function () {
        openMenuBtn.classList.toggle('menu-opened-btn');
        openMenuBtn.classList.toggle('menu-closed-btn');
        menuContainer.classList.toggle('mobile-menu-not-active');
        menuContainer.classList.toggle('mobile-menu-active');
    });
};

menuFunction();

var itemsToDisplay = {};
itemsToDisplay.items = JSON.parse(localStorage.getItem('items')).map(function (item, i) {
    item.id = item.id + '_' + i;
    return item;
});

var template = function template(array) {
    var template = _.template('<% _.forEach(items, function(obj) { %>' + '<div class="item">' + '    <figure>' + '                <div class="img-container">' + '                    <a href="item.html"><img class="item-photo" src=<%= obj.thumbnail %> > </a>' + '                    <p class="view-item">View item</p>' + '                </div>' + '                <figcaption data-id = <%= obj.id%>><%= obj.title %>' + '                    <p class="item-price">&pound; <%- obj.discountedPrice < obj.price ? obj.discountedPrice : obj.price %> </p>' + '                    <p class="item-color">Color: <span> <%= obj.colors %> </span></p>' + '                    <p class="item-size">Size: <span><%= obj.sizes %></span></p>' + '                    <p class="quantity">Quantity: <span class="qntMinus">-</span> <span> <%= obj.quantity %> </span> <span class="qntPlus">+</span></p>' + '                    <button type="button" class="remove-item-btn"> Remove item</button>' + '                </figcaption>' + '    </figure>' + '</div>' + '<% }) %>');

    return template(array);
};

var displayItems = function displayItems(array) {
    var itemsHTML = template(array);
    var itemsContainer = document.body.querySelector('.bag-item-container');
    itemsContainer.innerHTML = itemsHTML;

    var bindButtonsClick = function bindButtonsClick() {
        var deleteItem = Array.from(document.body.querySelectorAll('.remove-item-btn'));
        var increaseQuantity = Array.from(document.body.querySelectorAll('.qntPlus'));
        var decreaseQuantity = Array.from(document.body.querySelectorAll('.qntMinus'));
        var clearBag = document.body.querySelector('#bag-btn-clear');
        var buyBtn = document.body.querySelector('#buy-bag-btn');

        increaseQuantity.forEach(function (elem) {
            elem.addEventListener('click', function (event) {
                var elementId = event.target.parentElement.parentNode.dataset.id;
                var objItem = itemsToDisplay.items.find(function (item) {
                    return item.id == elementId;
                });

                objItem.quantity += 1;
                displayItems(itemsToDisplay);
                total(itemsToDisplay);
            });
        });

        decreaseQuantity.forEach(function (elem) {
            elem.addEventListener('click', function (event) {
                var elementId = event.target.parentElement.parentNode.dataset.id;
                var objItem = itemsToDisplay.items.find(function (item) {
                    return item.id == elementId;
                });
                if (objItem.quantity > 1) {
                    objItem.quantity -= 1;
                    displayItems(itemsToDisplay);
                    total();
                    total(itemsToDisplay);
                } else {
                    objItem.quantity = 1;
                    displayItems(itemsToDisplay);
                    total();
                    total(itemsToDisplay);
                }
            });
        });

        deleteItem.forEach(function (elem) {
            elem.addEventListener('click', function (event) {
                var elementId = event.target.parentNode.dataset.id;

                itemsToDisplay.items = _.filter(itemsToDisplay.items, function (obj) {
                    return obj.id != elementId;
                });

                displayItems(itemsToDisplay);
                total();
                total(itemsToDisplay);
            });
        });

        clearBag.addEventListener('click', function () {
            itemsToDisplay.items = [];
            document.querySelector('#emptyBagMsg').classList.remove('d-none');
            document.querySelector('.stock').classList.add('d-none');
            displayItems(itemsToDisplay);
            total();
            total(itemsToDisplay);
        });

        buyBtn.addEventListener('click', function () {
            itemsToDisplay.items = [];
            document.querySelector('#orderCompleteMsg').classList.remove('d-none');
            document.querySelector('.stock').classList.add('d-none');
            displayItems(itemsToDisplay);
            total();
            total(itemsToDisplay);
        });
    };

    bindButtonsClick();
};

var total = function total(arr) {
    var price = 0;
    var quantity = 0;
    if (arr) {

        arr.items.forEach(function (item) {
            price += (item.discountedPrice < item.price ? item.discountedPrice : item.price) * +item.quantity;
            quantity += item.quantity;
        });

        addPriceToHTML(price, quantity);
    } else addPriceToHTML();
};

var addPriceToHTML = function addPriceToHTML() {
    var price = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var bagMoney = document.body.querySelector('.bag-money');
    var totalPrice = document.body.querySelector('.total-price');
    var itemCount = document.body.querySelector('#bag-item-count');
    bagMoney.innerText = price;
    itemCount.innerText = count;
    totalPrice.innerText = "£ " + +bagMoney.innerText || 0;
};

displayItems(itemsToDisplay);
total(itemsToDisplay);