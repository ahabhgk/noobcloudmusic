// 轮播图对象
class Carousel {
    constructor(opts) {
        this.wrap = opts.wrap
        this.wrapId = opts.wrap.id
        this.wrapWidth = this.wrap.offsetWidth
        this.wrapHeight = this.wrap.offsetHeight
        this.activeNumber = 0
        this.imgNumber = opts.urlArr.length
        this.btnTop = opts.btnPosition[0]
        this.btnLeft = opts.btnPosition[1]
        this.btnRight = opts.btnPosition[2]
        this.colors = opts.colors
        this.setTimeId
        this.init(opts.urlArr)
    }

    init(urlArr) {
        this.wrap.style.position = "relative"

        this.wrap.innerHTML = `
        <button id="${this.wrapId}_pre" type="button" style="position:absolute;top:${this.btnTop}px;left:${this.btnLeft}px;z-index:2"></button>
        <button id="${this.wrapId}_next" type="button" style="position:absolute;top:${this.btnTop}px;left:${this.btnRight}px;z-index:2"></button>
        <ul id="${this.wrapId}_page" style="position:absolute;z-index:2;padding:0;left:${this.wrapWidth / 2}px;transform:translate(-50%,${this.wrapHeight * 0.9}px)"></ul>
        <canvas id="${this.wrapId}_container" width="${this.wrapWidth}" height="${this.wrapHeight}" style="transition:0.5s ease-in;opacity:1"></div>`

        let page = document.querySelector(`#${this.wrapId}_page`)

        let imgs = []
        for (let value of urlArr) {
            this.loadImg(value, imgs)
            page.innerHTML += `<li class="${this.wrapId}_pagination" style="list-style:none;width:8px;height:8px;border-radius:50%;background:#fff;display:inline-block;margin:0 6px;"></li>`
        }
        let head = document.querySelector("head")
        let style = document.createElement("style")
        head.appendChild(style)
        style.innerText = `.${this.wrapId}_page_active{background:#cf0000!important;}`

        document.querySelectorAll(`.${this.wrapId}_pagination`)[this.activeNumber].classList.add(`${this.wrapId}_page_active`)


        let canvas = document.querySelector(`#${this.wrapId}_container`)
        let ctx = canvas.getContext('2d')
        let img = imgs[this.activeNumber]
        img.onload = function() {
            ctx.drawImage(this, 0, 0)
        }

        this.setTime()
        this.bindEvent(imgs, this.colors)
    }

    loadImg(url, imgs) {
        let img = new Image()
        img.src = url
        img.classList.add(`${this.wrapId}_img`)
        imgs.push(img)
    }

    displayImg(imgs, colors) {
        let canvas = document.querySelector(`#${this.wrapId}_container`)
        let ctx = canvas.getContext('2d')
        let img = imgs[this.activeNumber]
        canvas.style.opacity = 0
        let carouselWrap = document.querySelector(`.${this.wrapId}-wrap`)
        carouselWrap.style.background = colors[this.activeNumber]
        setTimeout(function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            canvas.style.opacity = 1
        }, 500)
    }

    actPage() {
        let activePage = document.querySelectorAll(`.${this.wrapId}_pagination`)[this.activeNumber]
        document.querySelector(`.${this.wrapId}_page_active`).classList.remove(`${this.wrapId}_page_active`)
        activePage.classList.add(`${this.wrapId}_page_active`)
    }

    bindEvent(imgs, color) {
        let preArrow = document.querySelector(`#${this.wrapId}_pre`)
        let nextArrow = document.querySelector(`#${this.wrapId}_next`)
        let page = document.querySelector(`#${this.wrapId}_page`)
        let paginations = page.querySelectorAll(`.${this.wrapId}_pagination`)
        for (let key = 0, len = paginations.length; key < len; key++) {
            paginations[key].addEventListener("click", this.selectedPage.bind(this, key, imgs, this.colors))
        }
        this.wrap.addEventListener("mouseenter", this.clearTime.bind(this))
        this.wrap.addEventListener("mouseleave", this.setTime.bind(this))
        preArrow.addEventListener("click", this.clickPreArrow.bind(this, imgs, this.colors))
        nextArrow.addEventListener("click", this.clickNextArrow.bind(this, imgs, this.colors))
    }

    clickPreArrow(imgs, colors) {
        if (this.activeNumber === 0) {
            this.activeNumber = this.imgNumber - 1
        } else {
            this.activeNumber--
        }
        this.displayImg(imgs, colors)
        this.actPage()
    }

    clickNextArrow(imgs, colors) {
        if (this.activeNumber === this.imgNumber - 1) {
            this.activeNumber = 0
        } else {
            this.activeNumber++
        }
        this.displayImg(imgs, colors)
        this.actPage()
    }

    selectedPage(selectedNumber, imgs, colors) {
        this.activeNumber = selectedNumber
        this.displayImg(imgs, colors)
        this.actPage()
    }

    setTime() {
        let wrapId = this.wrapId
        this.setTimeId = setInterval(function () {
            document.querySelector(`#${wrapId}_next`).click()
        }, 5000)
    }

    clearTime() {
        let thatId = this.setTimeId
        clearInterval(thatId)
    }
}


// 生成轮播图
let carousel = new Carousel({
    wrap: document.querySelector("#carousel"),
    urlArr:
    ["./src/img/0.jpg", "./src/img/1.jpg", "./src/img/2.jpg", 
    "./src/img/3.jpg", "./src/img/4.jpg", "./src/img/5.jpg", 
    "./src/img/6.jpg", "./src/img/7.jpg", "./src/img/8.jpg"],
    btnPosition: [150, -70, 1010],
    colors: ['#F6EDDF', '#FED384', '#60ABCB', '#0E0B0C',
    '#161C18', '#FFB400', '#6F0000', '#4B0401', '#495F96']
})


// #rec 的日期
let date = new Date()
let theDay = date.getDay()
let theDate = date.getDate()
let day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
let recWeek = document.querySelector('#rec-week')
let recDate = document.querySelector('#rec-date')
recWeek.innerText = day[theDay]
recDate.innerText = theDate


// #rec 的播放


// #new-con 的翻页
const moveDistence = document.querySelector(".new-main").offsetWidth
let newCon = document.querySelector("#new-con")
let newConLeft = 0;
let newConWrap = document.querySelector('.new-wrap')
newConWrap.addEventListener('click', function(ev) {
    if (ev.target.className === 'new-btn') {
        newConLeft < 0 ? newConLeft = 0 : newConLeft -= moveDistence
        newCon.style.left = newConLeft + 'px'
    }
})

// 防止首页 view 自动隐藏
document.querySelector('#carousel_pre').addEventListener('click', (ev) => {
    ev.stopPropagation()
})
document.querySelector('#carousel_next').addEventListener('click', (ev) => {
    ev.stopPropagation()
})