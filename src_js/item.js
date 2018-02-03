let itemToDisplay = window.catalog.find( item =>  item.id == localStorage.getItem('id'))

let menuFunction = ()=>{
    let searchButton = document.body.querySelector('.header-search-btn')
    let searchInput = document.body.querySelector('.header-search > input')
    let openMenuBtn = document.getElementById('menuBtn')
    let menuContainer = document.body.querySelector('.header-nav-container')

    searchButton.addEventListener('click', () => {
        searchInput.classList.toggle('search-field-visible')
    })

    openMenuBtn.addEventListener('click', () => {
        openMenuBtn.classList.toggle('menu-opened-btn')
        openMenuBtn.classList.toggle('menu-closed-btn')
        menuContainer.classList.toggle('mobile-menu-not-active')
        menuContainer.classList.toggle('mobile-menu-active')
    })
}

let cleanLocalStorage = () => {
    localStorage.clear()
}

let addPriceToHTML = (price, count = 1) => {
    let bagMoney = document.body.querySelector('.bag-money')
    let itemCount = document.body.querySelector('#bag-item-count')
    bagMoney.innerText =  +bagMoney.innerText + price
    itemCount.innerText = +itemCount.innerText + count

}

let append = (element, inBlock) => {
    document.body.querySelector(inBlock).innerHTML = element
}

let getPrice = () => {
    let price = itemToDisplay.discountedPrice < itemToDisplay.price ? itemToDisplay.discountedPrice : itemToDisplay.price
    return price
}

let createTemplateFrom = (object) => {
    let mainImageTemplate = _.template('<img src=<%= preview[0] %> id="mainImage" alt="">')

    let thumbnailImageTemplate = _.template('<div><img src=<%= preview[1] %> alt=""></div>' +
        '<div><img src=<%= preview[2] %> alt=""></div>' +
        '<div><img src=<%= preview[3] %> alt=""></div>')

    let itemSizeTemplate = _.template('<% _.forEach(sizes, function(size) { %>' +
        '<li>' +
        '<input name="size" class="size-input" id=<%= size %> type="radio" value=<%= size %> required/>' +
        '<label for=<%= size %> class="item-btn size-btn"><%= size %> </label>' +
        '</li>' +
        '<% }) %>')

    let itemColorTemplate = _.template('<% _.forEach(colors, function(color) { %>' +
        '<li>' +
        '<input name="color" class="size-input" id=<%= color %> type="radio" value=<%= color %> required/>' +
        '<label for=<%= color %> class="item-btn size-btn"><%= color %> </label>' +
        '</li>' +
        '<% }) %>')


    let price = getPrice()

    append(mainImageTemplate(object), '.main-img')
    append(thumbnailImageTemplate(object), '.thumbnail')
    append(itemSizeTemplate(object), '.item-size > ul')
    append(itemColorTemplate(object), '.item-color > ul')

    let itemName = document.querySelector('.item-name')
    let itemText = document.querySelector('.item-text')
    let itemPrice = document.querySelector('.item-price')

    itemName.innerText = object.title
    itemText.innerText = object.description
    itemPrice.innerText ='£ ' + price
}

let addItemToLocalStorage = () => {
    let itemProperties = {}
    let itemsArray = []
    let form = document.body.querySelector('form')


    form.addEventListener('submit', (ev) => {
        ev.preventDefault()
        let inputs = Array.from(document.body.querySelectorAll('input')).filter(el => el.checked)
        let price = getPrice()

        itemProperties.sizes = inputs[0].value
        itemProperties.colors = inputs[1].value
        itemProperties.quantity = 1

        let itemStorageForBag = Object.assign({}, itemToDisplay, itemProperties)

        if(localStorage.getItem('items')){

            itemsArray = JSON.parse(localStorage.getItem('items'))
        }

        if ( itemsArray.length < 1) {
            itemsArray.push(itemStorageForBag)
        }else if (itemsArray.find(elem => {
            if ( elem.id == itemStorageForBag.id && elem.colors == itemStorageForBag.colors && elem.sizes == itemStorageForBag.sizes) {
                elem.quantity += 1
                return elem
            }
            })){
        }else itemsArray.push(itemStorageForBag)

        localStorage.setItem('items', JSON.stringify(itemsArray))


        addPriceToHTML(price)
    })

}

let changeMainImageClickEvent = () => {
    let thumbnailContainer = document.body.querySelector('.thumbnail')
    let mainImage = document.body.querySelector('.main-img img')
    let imgs = Array.from(document.body.querySelectorAll('.thumbnail > div'))

    thumbnailContainer.addEventListener('click', (event) => {
        let buffer = mainImage.getAttribute('src')

        mainImage.setAttribute('src', event.target.getAttribute('src'))
        event.target.setAttribute('src', buffer)

        imgs.forEach(el => el.classList.remove('active'))

        event.target.parentElement.classList.add('active')
    })
}

localStorage.removeItem('id')
menuFunction()
cleanLocalStorage()
createTemplateFrom(itemToDisplay)
changeMainImageClickEvent()
addItemToLocalStorage()


