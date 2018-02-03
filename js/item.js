'use strict';

var itemToDisplay = window.catalog.find(function (item) {
    return item.id == localStorage.getItem('id');
});

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

var cleanLocalStorage = function cleanLocalStorage() {
    localStorage.clear();
};

var addPriceToHTML = function addPriceToHTML(price) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var bagMoney = document.body.querySelector('.bag-money');
    var itemCount = document.body.querySelector('#bag-item-count');
    bagMoney.innerText = +bagMoney.innerText + price;
    itemCount.innerText = +itemCount.innerText + count;
};

var append = function append(element, inBlock) {
    document.body.querySelector(inBlock).innerHTML = element;
};

var getPrice = function getPrice() {
    var price = itemToDisplay.discountedPrice < itemToDisplay.price ? itemToDisplay.discountedPrice : itemToDisplay.price;
    return price;
};

var createTemplateFrom = function createTemplateFrom(object) {
    var mainImageTemplate = _.template('<img src=<%= preview[0] %> id="mainImage" alt="">');

    var thumbnailImageTemplate = _.template('<div><img src=<%= preview[1] %> alt=""></div>' + '<div><img src=<%= preview[2] %> alt=""></div>' + '<div><img src=<%= preview[3] %> alt=""></div>');

    var itemSizeTemplate = _.template('<% _.forEach(sizes, function(size) { %>' + '<li>' + '<input name="size" class="size-input" id=<%= size %> type="radio" value=<%= size %> required/>' + '<label for=<%= size %> class="item-btn size-btn"><%= size %> </label>' + '</li>' + '<% }) %>');

    var itemColorTemplate = _.template('<% _.forEach(colors, function(color) { %>' + '<li>' + '<input name="color" class="size-input" id=<%= color %> type="radio" value=<%= color %> required/>' + '<label for=<%= color %> class="item-btn size-btn"><%= color %> </label>' + '</li>' + '<% }) %>');

    var price = getPrice();

    append(mainImageTemplate(object), '.main-img');
    append(thumbnailImageTemplate(object), '.thumbnail');
    append(itemSizeTemplate(object), '.item-size > ul');
    append(itemColorTemplate(object), '.item-color > ul');

    var itemName = document.querySelector('.item-name');
    var itemText = document.querySelector('.item-text');
    var itemPrice = document.querySelector('.item-price');

    itemName.innerText = object.title;
    itemText.innerText = object.description;
    itemPrice.innerText = '£ ' + price;
};

var addItemToLocalStorage = function addItemToLocalStorage() {
    var itemProperties = {};
    var itemsArray = [];
    var form = document.body.querySelector('form');

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var inputs = Array.from(document.body.querySelectorAll('input')).filter(function (el) {
            return el.checked;
        });
        var price = getPrice();

        itemProperties.sizes = inputs[0].value;
        itemProperties.colors = inputs[1].value;
        itemProperties.quantity = 1;

        var itemStorageForBag = Object.assign({}, itemToDisplay, itemProperties);

        if (localStorage.getItem('items')) {

            itemsArray = JSON.parse(localStorage.getItem('items'));
        }

        if (itemsArray.length < 1) {
            itemsArray.push(itemStorageForBag);
        } else if (itemsArray.find(function (elem) {
            if (elem.id == itemStorageForBag.id && elem.colors == itemStorageForBag.colors && elem.sizes == itemStorageForBag.sizes) {
                elem.quantity += 1;
                return elem;
            }
        })) {} else itemsArray.push(itemStorageForBag);

        localStorage.setItem('items', JSON.stringify(itemsArray));

        addPriceToHTML(price);
    });
};

var changeMainImageClickEvent = function changeMainImageClickEvent() {
    var thumbnailContainer = document.body.querySelector('.thumbnail');
    var mainImage = document.body.querySelector('.main-img img');
    var imgs = Array.from(document.body.querySelectorAll('.thumbnail > div'));

    thumbnailContainer.addEventListener('click', function (event) {
        var buffer = mainImage.getAttribute('src');

        mainImage.setAttribute('src', event.target.getAttribute('src'));
        event.target.setAttribute('src', buffer);

        imgs.forEach(function (el) {
            return el.classList.remove('active');
        });

        event.target.parentElement.classList.add('active');
    });
};

localStorage.removeItem('id');
menuFunction();
cleanLocalStorage();
createTemplateFrom(itemToDisplay);
changeMainImageClickEvent();
addItemToLocalStorage();