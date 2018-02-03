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
    let dividedData = []
    if (screenWidth > 1024) {
        dividedData =_.chunk(_.filter(array, 'price'), 8)
    }else if (screenWidth > 768) {
        dividedData =_.chunk(_.filter(array, 'price'), 6)
    }else dividedData =_.chunk(_.filter(array, 'price'), 4)

    return dividedData
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
    spanPrice.innerText = '£ ' +  object.price

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
        newPrice.innerText = 'new'
        spanPrice.appendChild(newPrice)

    }

    return divContainer;

}

let appendItem = (item, inBlock) => {
    let block = document.body.querySelector(inBlock)
    block.appendChild(item)
}

let createAndAddItemIn = (block, array) => {
    index === array.length ? index = NaN :
        array[index].forEach((item) => {
            let template = createItemHTML(item)
            appendItem(template, block)
        })

    index++
}

let initDisplayItems = () => {

    createAndAddItemIn('.arrivals-block', dataDivisionDependOnScreens(window.catalog))

}

let addPriceToHTML = () => {
    let bagMoney = document.body.querySelector('.bag-money')
    let itemCount = document.body.querySelector('#bag-item-count')
    bagMoney.innerText = localStorage.getItem('money') || 0
    itemCount.innerText = localStorage.getItem('count') || 0

}

let init = () => {
    menuFunction()
    initDisplayItems()

    let resizeEnd

    window.addEventListener('resize', () => {
        clearTimeout(resizeEnd)
        resizeEnd = setTimeout(initDisplayItems, 100)
        document.body.querySelector('.arrivals-block').innerHTML = ''
        index = 0
        resizeEnd()
    })

    document.body.querySelector('.show-more-arrivals').addEventListener('click', initDisplayItems)
    addPriceToHTML()

}

init()















