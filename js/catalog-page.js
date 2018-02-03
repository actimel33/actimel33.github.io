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

var dataDivisionDependOnScreens = function dataDivisionDependOnScreens(array) {
    var screenWidth = screen.width;
    var dividedData = void 0;
    if (screenWidth > 1024) {
        dividedData = _.chunk(_.filter(_.sortBy(array, function (obj) {
            return new Date(obj.dateAdded);
        }), 'price', { 'category': 'women', 'fashion': 'Casual style' }), 8);
    } else if (screenWidth > 768) {
        dividedData = _.chunk(_.filter(_.sortBy(array, function (obj) {
            return new Date(obj.dateAdded);
        }), 'price', { 'category': 'women', 'fashion': 'Casual style' }), 6);
    } else dividedData = _.chunk(_.filter(_.sortBy(array, function (obj) {
        return new Date(obj.dateAdded);
    }), 'price', { 'category': 'women', 'fashion': 'Casual style' }), 4);

    return dividedData;
};

var index = 0;

var createItemHTML = function createItemHTML(object) {
    var divContainer = document.createElement("div");
    var figure = document.createElement("figure");
    var imgContainer = document.createElement("div");
    var link = document.createElement("a");
    var img = document.createElement("img");
    var text = document.createElement("p");
    var figcaption = document.createElement("figcaption");
    var breakLine = document.createElement("br");
    var spanPrice = document.createElement("span");
    var newPrice = void 0;

    divContainer.className = 'item mobile';
    divContainer.dataset.id = object.id;
    imgContainer.className = 'img-container';
    link.setAttribute('href', 'item.html');
    img.className = 'item-photo';
    img.setAttribute('src', object.thumbnail);
    text.className = 'view-item';
    text.innerText = 'View item';
    figcaption.innerText = object.title;
    if (object.discountedPrice < object.price) {
        spanPrice.innerText = '£ ' + object.discountedPrice;
    } else spanPrice.innerText = '£ ' + object.price;

    divContainer.appendChild(figure);
    figure.appendChild(imgContainer);
    imgContainer.appendChild(link);
    link.appendChild(img);
    link.appendChild(text);
    figure.appendChild(figcaption);
    figcaption.appendChild(breakLine);
    figcaption.appendChild(spanPrice);

    if (object.hasNew) {
        newPrice = document.createElement("span");
        newPrice.className = 'new-price';
        newPrice.innerText = 'New';
        spanPrice.appendChild(newPrice);
    }

    return divContainer;
};

var appendItem = function appendItem(item, inBlock) {
    var block = document.body.querySelector(inBlock);
    block.appendChild(item);
};

var displayItemsIn = function displayItemsIn(block, array) {
    index === array.length ? index = NaN : array[index].forEach(function (item) {
        var template = createItemHTML(item);
        appendItem(template, block);
    });

    index++;
};

var initDisplayItems = function initDisplayItems() {

    displayItemsIn('.arrivals-block', dataDivisionDependOnScreens(window.catalog));
};

var insertPromoBlock = function insertPromoBlock() {
    var itemToDisplay = void 0;

    if (screen.width > 1024) {
        itemToDisplay = 4;
    } else if (screen.width > 768) {
        itemToDisplay = 3;
    } else itemToDisplay = 2;

    var promo = document.body.querySelector('.promo-container');
    var block = document.body.querySelector('.arrivals-block');
    var items = Array.from(document.body.querySelectorAll('.item'));

    block.insertBefore(promo, items[itemToDisplay]);
};

var storageClickedItem = function storageClickedItem() {
    var items = Array.from(document.body.querySelectorAll('.item'));
    items.forEach(function (item) {
        item.addEventListener('click', function (ev) {
            localStorage.setItem('id', ev.currentTarget.dataset.id);
        });
    });
};

var addPriceToHTML = function addPriceToHTML() {
    var bagMoney = document.body.querySelector('.bag-money');
    var itemCount = document.body.querySelector('#bag-item-count');
    bagMoney.innerText = localStorage.getItem('money') || 0;
    itemCount.innerText = localStorage.getItem('count') || 0;
};

var filterEvents = function filterEvents() {
    var categoryList = document.querySelector('.category-list');
    var categoryListLi = Array.from(document.querySelectorAll('.category-list li'));

    var closeIconContainer = document.querySelector('.close-icon-container');
    var filter = document.querySelector('.filter');
    var filterLists = Array.from(document.querySelectorAll('.filter-list'));

    document.querySelector('.mobile-selected-category-container').addEventListener('click', function (event) {
        if (event.target != closeIconContainer) {
            categoryList.classList.add('active');
            filter.classList.add('active');
        } else {
            categoryList.classList.remove('active');
            filter.classList.remove('active');
        }
    });

    filterLists.forEach(function (el, i) {
        el.addEventListener('click', function (event) {

            var siblings = Array.from(event.target.parentNode.children);
            siblings.forEach(function (el) {
                el.classList.remove('active');
            });

            event.target.classList.toggle('active');
            event.target.parentNode.previousSibling.previousElementSibling.classList.add('active');
            event.target.parentNode.previousSibling.previousSibling.previousElementSibling.classList.add('active');

            if (event.target.innerText == 'Not selected') {
                event.target.parentNode.previousSibling.previousElementSibling.classList.remove('active');
                event.target.parentNode.previousSibling.previousSibling.previousElementSibling.classList.remove('active');
            }

            event.target.parentNode.previousSibling.previousElementSibling.childNodes[1].innerText = event.target.innerText;
            categoryListLi[i].innerText = event.target.innerText + ',';
            categoryListLi[i].classList.add('active');

            if (event.target.innerText == 'Not selected') {
                categoryListLi[i].classList.remove('active');
            }
        });
    });
};

var init = function init() {
    var resizeEnd = void 0;

    menuFunction();
    initDisplayItems();
    insertPromoBlock();
    filterEvents();

    window.addEventListener('resize', function () {
        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(initDisplayItems, 500);
        document.body.querySelector('.arrivals-block').innerHTML = '';
        index = 0;
        resizeEnd();
    });

    window.addEventListener('onload', insertPromoBlock);
    document.body.querySelector('.show-more-arrivals').addEventListener('click', initDisplayItems);

    storageClickedItem();
    addPriceToHTML();
};

init();