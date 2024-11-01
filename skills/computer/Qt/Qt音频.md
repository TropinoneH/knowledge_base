# 一.初始准备

1. Qt框架
2. 引入multimedia模块

# 二.播放

## 1.播放音乐

```c++
//先new一个output对象
QAudioOutput * audioOutput = new QAudioOutput(this);
//再创建一个音乐的媒体播放源
QMediaPlayer * mPlayer = new QMediaPlayer(this);
mPlayer->setAudioOutput(audioOutput);
//设置音乐源文件
mPlayer->setSource(QUrl::fromLocalFile("路径地址"));
//播放
mPlayer->play();
```

## 2.音乐的状态

```c++
switch(mPlayer->playbackState()){
    case QMediaPlayer::PlaybackState::StoppedState: // 停止状态
        break;
    case QMedaiPlayer::PlaybackState::PlayingState: //播放状态
        break;
    case QMediaPlayer::PlaybackState::PausedState: //暂停状态
        break;
}
```

```c++
//播放的总时长
connect(mPlayer, &QMediaPlayer::durationChanged, this, [=](qint64 duration){
    qDebug()<<QString("%1:%2").arg(duration/1000/60, (duration/1000)%60);
});
//播放的当前时间
connect(mPlayer, &QMediaPlayer::positionChanged, this, [=](qint64 pos){
    qDebug()<<QString("%1:%2").arg(pos/1000/60, (pos/1000)%60);
});
//设置播放时间
//setPosition(qint64 pos)
```

## 3.音量设置

```c++
audioOutput->setVolume(0.5); //范围是[0, 1]闭区间
```

