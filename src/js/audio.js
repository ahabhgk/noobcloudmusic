// #login 的 hover
let hasSigned = false // wbe
let login = document.querySelector("#login")
login.addEventListener("mouseenter", (ev) => {
    let sign = hasSigned ? ev.target.children[2] : ev.target.children[1]
    sign.style.display = "block"
})
login.addEventListener("mouseleave", (ev) => {
    let sign = hasSigned ? ev.target.children[2] : ev.target.children[1]
    sign.style.display = "none"
})

// #back-to-top 的隐藏
let backToTop = document.querySelector('#back-to-top')
window.onscroll = () => {
    if (document.documentElement.scrollTop < 10) {
        backToTop.style.display = 'none'
    } else {
        backToTop.style.display = 'block'
    }
}
backToTop.addEventListener('click', () => {
    document.documentElement.scrollTop = 0
})

// 底部播放器(#player-jump)的隐藏显示
let lyricsUl =  document.querySelector('#lyrics')
let playerJump = document.querySelector('#player-jump')
let playerBar = document.querySelector('#player-bar')
let viewClose = document.querySelector('#view-close')
let view = document.querySelector('.view')
playerJump.addEventListener('click', (ev) => {
    ev.stopPropagation()
    if (view.style.visibility === 'visible') {
        view.style.visibility = 'hidden'
        lyricsUl.style.display = 'none'
    } else {
        view.style.visibility = 'visible'
        lyricsUl.style.display = 'block'
    }
}, false)
view.addEventListener('click', (ev) => {
    ev.stopPropagation()
})
playerBar.addEventListener('click', (ev) => {
    ev.stopPropagation()
})
document.addEventListener('click', () => {
    view.style.visibility = 'hidden'
    lyricsUl.style.display = 'none'
})
viewClose.addEventListener('click', () => {
    view.style.visibility = 'hidden'
    lyricsUl.style.display = 'none'
})

// .barragr-from 的隐藏与显示
let barrageFrom = document.querySelector('.barrage-from')
barrageFrom.addEventListener('mouseenter', function() {
    this.style.opacity = 1
})
barrageFrom.addEventListener('mouseleave', function() {
    this.style.opacity = 0
})

// 发送弹幕
let barrageDisplay = document.querySelector('#barrage-display')
let barrageInput = document.querySelector('#barrage-input')
let barrageBtn = document.querySelector('#barrage-btn')
let barrageWarning = document.querySelector('.barrage-warning')
barrageBtn.addEventListener('click', () => {
    const BDHEIGHT = barrageDisplay.offsetHeight - 30
    let text = barrageInput.value
    if (text == '') {
        barrageWarning.style.display = 'block'
        setTimeout(() => {
            barrageWarning.style.display = 'none'
        }, 3000)
    }
    let barrage = document.createElement('div')
    barrageDisplay.appendChild(barrage)
    barrage.innerText = text
    barrage.classList.add('barrage')
    barrage.style.top = `${Math.random() * BDHEIGHT}px`
    barrage.style.color = '#'+('00000'+ (Math.random()*0x1000000<<0).toString(16)).substr(-6)
    barrageInput.value = null
    setTimeout(() => {
        barrageDisplay.removeChild(barrage)
    }, 5000)
})

// 搜索
let search = document.querySelector('#search')
let searchDisplay = document.querySelector('#search-display')
search.addEventListener('keyup', debounce(function() {
    searchDisplay.style.display = 'none'
    while(searchDisplay.firstChild) {
        searchDisplay.removeChild(searchDisplay.firstChild)
    }
    let text = this.value
    ajax({
        method: 'GET',
        url: url + '/search',
        data: {
            keywords: text
        }
    }).then(res => {
        return res.result.songs.slice(0, 6)
    }).then(res => {
        let singers = res.map((item) => {
            return item.artists[0]
        })
        res.forEach((item, index) => {
            searchDisplay.insertAdjacentHTML('beforeend', `
            <li class="search-li">
                <a class="song" href="javascript:;" data-id="${item.id}">${item.name}</a>
                <a href="./singer.html?id=${singers[index].id}" class="singer">${singers[index].name}</a>
            </li>`)
        })
        searchDisplay.style.display = 'block'
    })
}, 300))

searchDisplay.addEventListener('click', (ev) => {
    ev.stopPropagation()
    if (ev.target.className === 'singer' || ev.target.className === 'song') {
        searchDisplay.style.display = 'none'
    }
}, false)
document.addEventListener('click', () => {
    searchDisplay.style.display = 'none'
})
// 防抖
function debounce(fn, interval = 300) {
    let timeout = null
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, arguments)
        }, interval)
    }
}

let loginPage = document.querySelector('#login-page')
let lpClose = document.querySelector('.lp-close')
let lpLogin = document.querySelector('.lp-login')
let lpReg = document.querySelector('.lp-reg')
let goLog = document.querySelector('#go-log')
let goReg = document.querySelector('#go-reg')
let lpTit = document.querySelector('.lp-tit')
const checkPage = (loging) => {
    if (loging) {
        lpTit.innerText = '登录'
        lpLogin.style.display = 'flex'
        lpReg.style.display = 'none'
        goLog.style.display = 'none'
        goReg.style.display = 'block'
    } else {
        lpTit.innerText = '注册'
        lpLogin.style.display = 'none'
        lpReg.style.display = 'flex'
        goLog.style.display = 'block'
        goReg.style.display = 'none'
    }
}
login.addEventListener('click', () => {
    loginPage.style.display = 'block'
})
lpClose.addEventListener('click', () => {
    loginPage.style.display = 'none'
})
goLog.addEventListener('click', () => {
    checkPage(true)
})
goReg.addEventListener('click', () => {
    checkPage(false)
})

// 登录




let index = 0
const url = 'http://localhost:3000'

// musicList 的渲染
let musicUl = document.querySelector('#music-list')
let musicList
function renderMusicList() {
    musicUl.innerHTML = ''
    musicList = JSON.parse(sessionStorage.musicList || '[]')
    musicList.forEach((item) => {
        musicUl.insertAdjacentHTML('beforeend', `<li class="hover" data-id="${item.id}">${item.name}<button type="button" class="delete">删除</button></li>`)
    })
}
renderMusicList()



let audio = document.querySelector('#audio')

// ul 点击歌曲播放
let play = document.querySelector('#play')

musicUl.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('delete')) {
        // 播放列表中删除音乐
        let ind
        musicList = musicList.filter((item, i) => {
            if (item.id === ev.target.parentNode.dataset.id) ind = i
            return item.id !== ev.target.parentNode.dataset.id
        })
        sessionStorage.musicList = JSON.stringify(musicList)
        renderMusicList()
        if (ind < index) index--
        if (ind === index) refresh(musicList[index].id)
        document.querySelectorAll('#music-list>li')[index].classList.add('active')
    } else {
        // 播放列表中点击切换音乐
        play.className = 'playing'
        ev.target.parentNode.childNodes.forEach((item, i) => {
            if (item === ev.target) index = i
        })
        refresh(ev.target.dataset.id)
    }
})
// 暂停播放事件
play.addEventListener('click', function() {
    if (audio.src == 'javascript:;') {
        if (musicList.length == 0) {
            alert('请先添加要播放的歌曲 0.0')
        } else {
            --index // 避免第一次播放时 order 会跳到 1
            this.className = 'playing'
            refresh(checkModeAndReturnMusicId())
        }
    } else {
        if (audio.paused) {
            audio.play()
            this.className = 'playing'
        } else {
            audio.pause()
            this.className = 'pause'
        }
    }
})

// 播放完时把进度条调回开始位置
audio.addEventListener('ended', () => {
    refresh(checkModeAndReturnMusicId())
}, false)

// 刷新audio的src
function refreshSrc(url) {
    audio.src = url
}



// pre,next的事件
let pre = document.querySelector('#pre')
let next = document.querySelector('#next')
pre.addEventListener('click', () => {
    if (audio.src == 'javascript:;') {
        alert('请先播放歌曲 0.0')
    } else {
        index <= 0 ? index = musicList.length - 1 : --index
        refresh(musicList[index].id)
    }
    
})
next.addEventListener('click', () => {
    if (audio.src == 'javascript:;') {
        alert('请先播放歌曲 0.0')
    } else {
        index >= musicList.length - 1 ? index = 0 : ++index
        refresh(musicList[index].id)
    }
})



// 播放
let playedTime = document.querySelector('#played-time')
let toplayTime = document.querySelector('#toplay-time')
let clicking = false
let dot = document.querySelector('#dot')
let bar = document.querySelector('#bar')
let progress = document.querySelector('#progress')

// 更换资源后的刷新
const ULMARGINTOP = 140
let playingSong = document.querySelector('#playing-song')
let playingPic = document.querySelector('#playing-pic')
function refresh(id) {
    ajax({
        url: url + '/song/url',
        data: {
            id: id
        }
    }).then(res => {
        refreshSrc(res.data[0].url)
    })
    ajax({
        url: url + '/lyric',
        data: {
            id: id
        }
    }).then(res => {
        refreshLyrics(formatLyric(res.lrc.lyric))
    })
    ajax({
        url: url + '/song/detail',
        data: {
            ids: id
        }
    }).then(res => {
        playingSong.innerText = res.songs[0].name
        playingPic.src = res.songs[0].al.picUrl
    })
    lyricsUl.style.marginTop = ULMARGINTOP + 'px'
    progress.style.width = '0%'
    document.querySelectorAll('#music-list>li').forEach((item) => {
        item.className = 'hover'
    })
    document.querySelectorAll('#music-list>li')[index].classList.add('active')
    audio.oncanplay = () => {
        toplayTime.innerText = transTime(audio.duration)
        audio.play()
    }
}

// 监听音频播放时间并更新进度条
audio.addEventListener('timeupdate', () => {
    updateProgress(audio)
}, false)
function updateProgress(audio) {
    let rate = audio.currentTime / audio.duration
    progress.style.width = `${rate * 100}%`
    playedTime.innerHTML = transTime(audio.currentTime)
    compareLyric()
}

// 音频播放时间换算
function transTime(value) {
    let m = Math.floor(value / 60)
    let s = Math.floor(value % 60)
    return (m < 10 ? `0${m}` : m) + ':' + (s < 10 ? `0${s}` : s)
}

// 拖拽进度条事件
let isPlaying
dot.addEventListener('mousedown', () => {
    play.className = 'playing'
    clicking = true
    document.addEventListener('mousemove', (ev) => {
        if (clicking) {
            let len = bar.offsetWidth
            let left = ev.pageX - bar.getBoundingClientRect().left + document.body.scrollLeft
            let rate = left / len
            if (rate <= 1 || rate >= 0) {
                audio.currentTime = rate * audio.duration
                progress.style.width = rate * 100 + '%'
            }
        }
    })
    document.addEventListener('mouseup', () => {
        clicking = false
    })
})



// 更改播放模式
let order = document.querySelector('#order')
let loop = document.querySelector('#loop')
let random = document.querySelector('#random')
loop.addEventListener('click', function() {
    this.classList.remove('active')
    random.classList.add('active')
})
random.addEventListener('click', function() {
    this.classList.remove('active')
    order.classList.add('active')
})
order.addEventListener('click', function() {
    this.classList.remove('active')
    loop.classList.add('active')
})

// 检查播放模式，返回music
function checkModeAndReturnMusicId() {
    let mode
    [order, loop, random].forEach((ele) => {
        if (ele.classList.contains('active')) {
            mode = ele.id
        }
    })
    if (mode == 'order') {
        if (index >= musicList.length - 1) {
            index = 0
            return musicList[index].id
        } else {
            return musicList[++index].id
        }
    } else if (mode == 'loop') {
        return musicList[index].id
    } else {
        index = Math.floor(Math.random() * musicList.length)
        return musicList[index].id
    }
}




// 歌词显示
// 格式化歌词
function formatLyric(lyrics) {
    let timeLyric = []
    let totalTime
    function parseTime(timeString) {
        let timeStringArr = timeString.split(':')
        let m = parseInt(timeStringArr[0])
        let s = parseFloat(timeStringArr[1])
        totalTime = m * 60 + s
        return totalTime
    }
    let lyricsArr = lyrics.split('\n')
    for (let i = 0; i < lyricsArr.length; i++) {
        let line = lyricsArr[i].split(']')
        let time = parseTime(line[0].slice(1, line[0].length))
        let content = line[1]
        if (content == '' || isNaN(time)) continue
        timeLyric.push({
            time: time,
            content: content
        })
    }
    return timeLyric
}

// 歌词高亮
function compareLyric() {
    let currentLyric
    let lyricsDom = document.querySelectorAll('.lyric')
    for (let i = 0; i < lyricsDom.length; i++) {
        lyricsDom[i].classList.remove('currentLyric')
        if (lyricsDom[i].dataset.time - audio.currentTime < 0.2) {
            currentLyric = lyricsDom[i]
        }
    }
    if (currentLyric != undefined) {
        lyricsUl.style.marginTop = `${-currentLyric.dataset.scrollHeight}px`
        currentLyric.classList.add('currentLyric')
    }
}

// 刷新歌词
let minHeight = document.querySelector('#lyrics-wrap').offsetHeight / 2
function refreshLyrics(lyrics) {
    while (lyricsUl.firstChild) {
        lyricsUl.removeChild(lyricsUl.firstChild)
    }
    for (let i = 0; i < lyrics.length; i++) {
        lyricsUl.innerHTML += `<li class="lyric" data-time="${lyrics[i].time}">${lyrics[i].content}</li>`
    }
    let lyricsDom = document.querySelectorAll('.lyric')
    for (let i = 0; i < lyricsDom.length; i++) {
        lyricsDom[i].dataset.scrollHeight = -minHeight + 32.4 * (i + 1)
    }
}
