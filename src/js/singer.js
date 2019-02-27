// tag 的切换
let singerNav = document.querySelector('#singer-nav')
let hotSongs = document.querySelector('#hot-songs')
let allAlbums = document.querySelector('#all-albums')
let intro = document.querySelector('#intro')
let singerSongs = document.querySelector('#singer-songs')
let singerAlbum = document.querySelector('#singer-album')
let singerIntroduce = document.querySelector('#singer-introduce')
let tagArr = [hotSongs, allAlbums, intro]
let singerArr = [singerSongs, singerAlbum, singerIntroduce]
function tagEvent(tag, content) {
    tagArr.forEach((item) => {
        item.classList.remove('active')
    })
    tag.classList.add('active')
    singerArr.forEach((item) => {
        item.style.display = 'none'
    })
    content.style.display = 'block'
}
singerNav.addEventListener('click', (ev) => {
    if (ev.target.innerText == '热门单曲') {
        tagEvent(hotSongs, singerSongs)
    }
    if (ev.target.innerText == '所有专辑') {
        tagEvent(allAlbums, singerAlbum)
        singerAlbum.innerHTML = ''
        hotAlbums.forEach((item) => {
            singerAlbum.insertAdjacentHTML('beforeend', `
            <div class="album">
                <img src="${item.picUrl}" width="147px" height="147px" />
                <p class="name">${item.name}</p>
            </div>`)
        })
    }
    if (ev.target.innerText == '艺人介绍') {
        tagEvent(intro, singerIntroduce)
        singerIntroduce.innerText = briefDesc
    }
})


// 歌单、专辑、简介的渲染
const id = getQueryString('id')
let briefDesc = ''
let hotAlbums = []
tagHandler(id)

function tagHandler(id) {
    ajax({
        method: 'GET',
        url: url + '/artists',
        data: {
            id: id
        }
    }).then(res => {
        document.querySelector('#singer-name').innerText = res.artist.name
        document.querySelector('#singer-pic').style.backgroundImage = `url(${res.artist.picUrl})`
        document.querySelector('.songs-ul').innerHTML = ''
        for (let i = 0; i < res.hotSongs.length; i++) {
            document.querySelector('.songs-ul').insertAdjacentHTML('beforeend', `
            <li class="song bg-${i % 2 === 0 ? 'b' : 'w'}" data-num="${i}">
                <span class="number">${i + 1}</span>
                <button type="button" class="play btn" data-id="${res.hotSongs[i].id}"></button>
                <a class="song-name" href="javascript:;">${res.hotSongs[i].name}</a>
                <span class="song-time"></span>
                <button type="button" class="add btn" data-id="${res.hotSongs[i].id}"></button>
                <span class="album">${res.hotSongs[i].al.name}</span>
            </li>`)
        }
        briefDesc = res.artist.briefDesc
    })
    ajax({
        method: 'GET',
        url: url + '/artist/album',
        data: {
            id: id,
            limit: 12
        }
    }).then(res => {
        hotAlbums = res.hotAlbums
    })
}

// 添加歌曲到 musicList
let songsUl = document.querySelector('.songs-ul')
let addTip = document.querySelector('.add-tip')
songsUl.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('add')) {
        let tempML = JSON.parse(sessionStorage.musicList || `[{
            "id": "${ev.target.dataset.id}",
            "name": "${ev.target.parentNode.children[2].innerText}"
        }]`)
        let isPush = true
        for (let i = 0; i < tempML.length; i++) {
            if (tempML[i].id !== ev.target.dataset.id) {
                continue
            } else {
                isPush = false
                break
            }
        }
        if (isPush) tempML.push({id: ev.target.dataset.id, name: ev.target.parentNode.children[2].innerText})
        sessionStorage.musicList = JSON.stringify(tempML)
        view.style.visibility = 'hidden'
        addTip.style.display = 'block'
        renderMusicList()
        setTimeout(() => {
            addTip.style.display = 'none'
        }, 3000)
    }
    if (ev.target.classList.contains('play')) {
        let hasThisSong = false
        musicUl.childNodes.forEach((item, i) => {
            if (item.dataset.id === ev.target.dataset.id) {
                hasThisSong = true
                index = i
            }
        })
        if (hasThisSong) {
            document.querySelector(`#music-list>li:nth-child(${index + 1})`).click()
        } else {
            ev.target.parentNode.children[4].click()
            document.querySelector('#music-list>li:last-child').click()
        }
    }
})

// 播放全部
let playAll = document.querySelector('#play-all')
playAll.addEventListener('click', () => {
    sessionStorage.removeItem('musicList')
    document.querySelectorAll('.add').forEach((item) => {
        item.click()
    })
    document.querySelector('.play').click()
})