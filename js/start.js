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
    var dividedData = [];
    if (screenWidth > 1024) {
        dividedData = _.chunk(_.filter(array, 'price'), 8);
    } else if (screenWidth > 768) {
        dividedData = _.chunk(_.filter(array, 'price'), 6);
    } else dividedData = _.chunk(_.filter(array, 'price'), 4);

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
    spanPrice.innerText = '£ ' + object.price;

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
        newPrice.innerText = 'new';
        spanPrice.appendChild(newPrice);
    }

    return divContainer;
};

var appendItem = function appendItem(item, inBlock) {
    var block = document.body.querySelector(inBlock);
    block.appendChild(item);
};

var createAndAddItemIn = function createAndAddItemIn(block, array) {
    index === array.length ? index = NaN : array[index].forEach(function (item) {
        var template = createItemHTML(item);
        appendItem(template, block);
    });

    index++;
};

var initDisplayItems = function initDisplayItems() {

    createAndAddItemIn('.arrivals-block', dataDivisionDependOnScreens(window.catalog));
};

var addPriceToHTML = function addPriceToHTML() {
    var bagMoney = document.body.querySelector('.bag-money');
    var itemCount = document.body.querySelector('#bag-item-count');
    bagMoney.innerText = localStorage.getItem('money') || 0;
    itemCount.innerText = localStorage.getItem('count') || 0;
};

var init = function init() {
    menuFunction();
    initDisplayItems();

    var resizeEnd = void 0;

    window.addEventListener('resize', function () {
        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(initDisplayItems, 100);
        document.body.querySelector('.arrivals-block').innerHTML = '';
        index = 0;
        resizeEnd();
    });

    document.body.querySelector('.show-more-arrivals').addEventListener('click', initDisplayItems);
    addPriceToHTML();
};

init();