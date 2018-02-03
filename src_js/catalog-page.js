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


let dataDivisionDependOnScreens = (array) => {
    let screenWidth = screen.width
    let dividedData
    if (screenWidth > 1024) {
        dividedData =_.chunk(_.filter(_.sortBy(array, (obj) => {return new Date(obj.dateAdded)}), 'price', {'category' : 'women', 'fashion': 'Casual style'}), 8)
    }else if (screenWidth > 768) {
        dividedData =_.chunk(_.filter(_.sortBy(array, (obj) => {return new Date(obj.dateAdded)}), 'price', {'category' : 'women', 'fashion': 'Casual style'}), 6)
    }else  dividedData =_.chunk(_.filter(_.sortBy(array, (obj) => {return new Date(obj.dateAdded)}), 'price', {'category' : 'women', 'fashion': 'Casual style'}), 4)

    return dividedData;
}

let index = 0

let createItemHTML = (object) => {
    let divContainer = document.createElement("div")
    let figure = document.createElement("figure")
    let imgContainer = document.createElement("div")
    let link = document.createElement("a")
    let img = document.createElement("img")
    let text = document.createElement("p")
    let figcaption = document.createElement("figcaption")
    let breakLine = document.createElement("br")
    let spanPrice = document.createElement("span")
    let newPrice

    divContainer.className = 'item mobile'
    divContainer.dataset.id = object.id
    imgContainer.className = 'img-container'
    link.setAttribute('href', 'item.html')
    img.className = 'item-photo'
    img.setAttribute('src', object.thumbnail)
    text.className = 'view-item'
    text.innerText = 'View item'
    figcaption.innerText = object.title
    if (object.discountedPrice < object.price) {
        spanPrice.innerText = '£ ' + object.discountedPrice
    } else spanPrice.innerText = '£ ' + object.price

    divContainer.appendChild(figure)
    figure.appendChild(imgContainer)
    imgContainer.appendChild(link)
    link.appendChild(img)
    link.appendChild(text)
    figure.appendChild(figcaption)
    figcaption.appendChild(breakLine)
    figcaption.appendChild(spanPrice)

    if(object.hasNew) {
        newPrice =  document.createElement("span")
        newPrice.className = 'new-price'
        newPrice.innerText = 'New'
        spanPrice.appendChild(newPrice)

    }

    return divContainer;
}

let appendItem = (item, inBlock) => {
    let block = document.body.querySelector(inBlock)
    block.appendChild(item)
}

let displayItemsIn = (block, array) => {
    index === array.length ? index = NaN :
        array[index].forEach((item) => {
            let template = createItemHTML(item)
            appendItem(template, block)
        })

    index++
}

let initDisplayItems = () => {

    displayItemsIn('.arrivals-block', dataDivisionDependOnScreens(window.catalog))

}

let insertPromoBlock = () => {
    let itemToDisplay

    if (screen.width > 1024) {
        itemToDisplay = 4
    }else if (screen.width > 768) {
        itemToDisplay = 3
    }else itemToDisplay = 2

    let promo = document.body.querySelector('.promo-container')
    let block = document.body.querySelector('.arrivals-block')
    let items = Array.from(document.body.querySelectorAll('.item'))

    block.insertBefore(promo, items[itemToDisplay])
}

let storageClickedItem = () => {
    let items = Array.from(document.body.querySelectorAll('.item'))
    items.forEach( item => {
        item.addEventListener('click', (ev) => {
            localStorage.setItem('id', ev.currentTarget.dataset.id)
        })
    })
}

let addPriceToHTML = () => {
    let bagMoney = document.body.querySelector('.bag-money')
    let itemCount = document.body.querySelector('#bag-item-count')
    bagMoney.innerText = localStorage.getItem('money') || 0
    itemCount.innerText = localStorage.getItem('count') || 0
}

let filterEvents = () => {
    let categoryList = document.querySelector('.category-list')
    let categoryListLi = Array.from(document.querySelectorAll('.category-list li'))

    let closeIconContainer = document.querySelector('.close-icon-container')
    let filter = document.querySelector('.filter')
    let filterLists = Array.from(document.querySelectorAll('.filter-list'))

    document.querySelector('.mobile-selected-category-container').addEventListener('click', (event) => {
        if (event.target != closeIconContainer ) {
            categoryList.classList.add('active')
            filter.classList.add('active')
        }else {
            categoryList.classList.remove('active')
            filter.classList.remove('active')
        }
    })

    filterLists.forEach( (el, i) => {el.addEventListener('click', (event) => {

        let siblings = Array.from(event.target.parentNode.children)
        siblings.forEach((el) => {
            el.classList.remove('active');
        })

        event.target.classList.toggle('active')
        event.target.parentNode.previousSibling.previousElementSibling.classList.add('active')
        event.target.parentNode.previousSibling.previousSibling.previousElementSibling.classList.add('active')

        if( event.target.innerText == 'Not selected') {
            event.target.parentNode.previousSibling.previousElementSibling.classList.remove('active')
            event.target.parentNode.previousSibling.previousSibling.previousElementSibling.classList.remove('active')
        }

        event.target.parentNode.previousSibling.previousElementSibling.childNodes[1].innerText = event.target.innerText
        categoryListLi[i].innerText = event.target.innerText + ','
        categoryListLi[i].classList.add('active')

        if (event.target.innerText == 'Not selected') {
            categoryListLi[i].classList.remove('active')
        }
    })
    })
}


let init = () => {
    let resizeEnd

    menuFunction()
    initDisplayItems()
    insertPromoBlock()
    filterEvents()


    window.addEventListener('resize', () => {
        clearTimeout(resizeEnd)
        resizeEnd = setTimeout(initDisplayItems, 500)
        document.body.querySelector('.arrivals-block').innerHTML = ''
        index = 0
        resizeEnd()
    })

    window.addEventListener('onload', insertPromoBlock)
    document.body.querySelector('.show-more-arrivals').addEventListener('click', initDisplayItems)

    storageClickedItem()
    addPriceToHTML()
}

init()