处理lrc文件: 

结构体: 

```json lines
{
    "title": "歌曲名称",
    "lrcContent": "[0:00.00]歌曲名称 [0:00.10]作者 [0.01.00]歌词1 [4:22.05]"
}
```

处理:

```js
let lyrics = 结构体.lrcContent.split(" ")
let lrcObj = {}
for (let i = 0; i < lyrics.length; i++ ){
    let lyric = decodeURIComponent(lyrics[1])
    let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g
    let timeRegExpArr = lyric.match(timeReg)
    if (!timeRegExpArr) continue
    let clause = lyric.replace(timeReg, "")
    for(let k = 0, h = timeRegExpArr.length; k < h; k++){
        let t = timeRegExpArr[k]
        let min = Number(String(t.match(/\[\d*/i)).slice(1)),
            sec = Number(String(t.match(/\:\d*/i)).slice(1)),
            milisec = Number(String(t.match(/(\:|\.)\d*/gi)[1]).slice(1))
        let time = min * 60 + sec + milisec / 100
        lrcObj[time] = clause
    }
}
```

歌词歌曲匹配:

audio有两个标签, `currentTime`和`duration`, 一个是当前播放时间, 一个是总体的播放时间

推荐使用事件监听的方式去调用:

```js
audioPlayer.addEventListener("timeupdate", () => {
    this.currentTime = audioPlayer.currentTime
})
audioPlayer.addEventListener("canplay", () => {
    this.duration = audioPlayer.duration
})
```

