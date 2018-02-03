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

menuFunction()


let itemsToDisplay = {}
itemsToDisplay.items = JSON.parse(localStorage.getItem('items')).map((item, i) => {
    item.id = item.id + '_' + i
    return item
})


let template = (array) => {
    let template = _.template(
        '<% _.forEach(items, function(obj) { %>' +
        '<div class="item">' +
        '    <figure>' +
        '                <div class="img-container">' +
        '                    <a href="item.html"><img class="item-photo" src=<%= obj.thumbnail %> > </a>' +
        '                    <p class="view-item">View item</p>' +
        '                </div>' +
        '                <figcaption data-id = <%= obj.id%>><%= obj.title %>' +
        '                    <p class="item-price">&pound; <%- obj.discountedPrice < obj.price ? obj.discountedPrice : obj.price %> </p>' +
        '                    <p class="item-color">Color: <span> <%= obj.colors %> </span></p>' +
        '                    <p class="item-size">Size: <span><%= obj.sizes %></span></p>' +
        '                    <p class="quantity">Quantity: <span class="qntMinus">-</span> <span> <%= obj.quantity %> </span> <span class="qntPlus">+</span></p>' +
        '                    <button type="button" class="remove-item-btn"> Remove item</button>' +
        '                </figcaption>' +
        '    </figure>' +
        '</div>' +
        '<% }) %>')

    return template(array)
}


let displayItems = (array) => {
    let itemsHTML = template(array)
    let itemsContainer = document.body.querySelector('.bag-item-container')
    itemsContainer.innerHTML = itemsHTML


    let bindButtonsClick = () => {
        let deleteItem = Array.from(document.body.querySelectorAll('.remove-item-btn'))
        let increaseQuantity = Array.from(document.body.querySelectorAll('.qntPlus'))
        let decreaseQuantity = Array.from(document.body.querySelectorAll('.qntMinus'))
        let clearBag = document.body.querySelector('#bag-btn-clear')
        let buyBtn = document.body.querySelector('#buy-bag-btn')

        increaseQuantity.forEach(elem => {
            elem.addEventListener('click', (event) => {
                let elementId = event.target.parentElement.parentNode.dataset.id
                let objItem =  itemsToDisplay.items.find(item => {
                    return item.id == elementId
                })

                objItem.quantity += 1
                displayItems(itemsToDisplay)
                total(itemsToDisplay)
            })
        })

        decreaseQuantity.forEach(elem => {
            elem.addEventListener('click', (event) => {
                let elementId = event.target.parentElement.parentNode.dataset.id
                let objItem =  itemsToDisplay.items.find(item => {
                    return item.id == elementId
                })
                if (objItem.quantity > 1) {
                     objItem.quantity -= 1
                     displayItems(itemsToDisplay)
                     total()
                     total(itemsToDisplay)
                }else {
                    objItem.quantity = 1
                    displayItems(itemsToDisplay)
                    total()
                    total(itemsToDisplay)
                }
            })
        })

        deleteItem.forEach(elem => {
            elem.addEventListener('click', (event) => {
                let elementId = event.target.parentNode.dataset.id

                itemsToDisplay.items = _.filter(itemsToDisplay.items, (obj)=>{ return obj.id != elementId})

                displayItems(itemsToDisplay)
                total()
                total(itemsToDisplay)
            })
        })

        clearBag.addEventListener('click', () => {
            itemsToDisplay.items = []
            document.querySelector('#emptyBagMsg').classList.remove('d-none')
            document.querySelector('.stock').classList.add('d-none')
            displayItems(itemsToDisplay)
            total()
            total(itemsToDisplay)
        })

        buyBtn.addEventListener('click', () => {
            itemsToDisplay.items = []
            document.querySelector('#orderCompleteMsg').classList.remove('d-none')
            document.querySelector('.stock').classList.add('d-none')
            displayItems(itemsToDisplay)
            total()
            total(itemsToDisplay)
        })

    }

    bindButtonsClick()
}

let total = (arr) => {
    let price = 0
    let quantity = 0
    if (arr) {

        arr.items.forEach(item => {
            price += (item.discountedPrice < item.price ? item.discountedPrice : item.price) * +item.quantity
            quantity += item.quantity
        })

        addPriceToHTML( price, quantity )
    }else addPriceToHTML()

}



let addPriceToHTML = (price = 0, count = 0) => {
    let bagMoney = document.body.querySelector('.bag-money')
    let totalPrice = document.body.querySelector('.total-price')
    let itemCount = document.body.querySelector('#bag-item-count')
    bagMoney.innerText = price
    itemCount.innerText = count
    totalPrice.innerText = "£ " + +bagMoney.innerText || 0

}

displayItems(itemsToDisplay)
total(itemsToDisplay)




