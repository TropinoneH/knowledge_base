# ID3

> MP3

| 英文描述                            | 中文描述           | 标志 |
| ----------------------------------- | ------------------ | ---- |
| Album/Movie/Show title              | 专辑/电影/节目标题 | TALB |
| Lead performer(s)/Soloist(s)        | 指挥, 主唱         | TPE1 |
| User defined text information frame | 自订文字           | TXXX |
| Part of a set                       | Part of a set      | TPOS |
| Title/songname/content description  | 标题               | TIT2 |
| Track number/Position in set        | 曲目               | TRCK |
| Attached picture                    | 封面               | APIC |
| Year                                | 年分               | TYER |
| Content type                        | 内容类型           | TCON |
| Copyright message                   | 版权信息           | TCOP |
| Comments                            | 评论               | COMM |
| User defined URL link frame         | 自定义URL          | WXXX |
| Encoded by                          | 编码者             | TENC |
| Beats per minute (BPM)              | 量度音乐速度       | TBPM |

# Vorbis

> flac
>
> ogg

组成: tag + streamInfo + other block

tag: 4字节, `fLaC`

注意字节与bit之间的转换关系. Buffer中是字节, 一个16进制的两位数, 转换成8位2进制的数

metadata block:

 1. Header包含内容:

    | 描述                                                         | 长度(bit)        |
    | ------------------------------------------------------------ | ---------------- |
    | last, 表示是否是最后一个                                     | 1 bit            |
    | type<br/>0: StreamInfo<br/>1: Padding<br/>2: Application<br/>3: SeekTable<br/>4: VorbisComment<br/>5: CueSheet<br/>6: Picture<br/>7-126: Reserved<br/>127: Error | 7 bit            |
    | block size: 本块的大小                                       | 24 bit (3 bytes) |
    
 0. StreamInfo

    | 描述                               | 长度               |
    | ---------------------------------- | ------------------ |
    | minBlockSize                       | 16 (2)             |
    | maxBlockSize                       | 16 (2)             |
    | minFrameSize                       | 24 (3)             |
    | maxFrameSize                       | 24 (3)             |
    | sampleRate (Hz)                    | 20 bit             |
    | channel - 1(声道数==减一==)        | 3 bit              |
    | sampleBit - 1(采样位数(?)==减一==) | 5 bit              |
    | totalSample 一个声道的采样总数     | 36 bit             |
    | md5                                | 128 bit (16 bytes) |

 1. padding

    这个只是用来对齐, 没用任何内容, 长度是8的倍数(bytes)

 2. Application

    | 描述         | 大小                                     |
    | ------------ | ---------------------------------------- |
    | 应用程序id   | 32 (4)                                   |
    | 应用程序数据 | N (8的倍数, 从header中获取到的size减去4) |

 5. SeekTable

    注意, 这里面有多个SeekPoint

    | 描述 (SeekPoint内的数据)   | 大小   |
    | -------------------------- | ------ |
    | 目标帧中第一个sample的序号 | 64 (8) |
    | 相对于第一帧的偏移         | 64 (8) |
    | 目标帧的采样数             | 16 (2) |

 6. Vorbis Comment

    含有的注释, 这个只能是获取string, 因为内部的信息不是统一的(大概率是utf-8)

    这里面含有一些专辑, 歌曲名, 歌手等信息, 需要通过字符串匹配或者其他手段去解析

 7. CueSheet

    不想写这个, 没多大用

 8. Picture

    | 描述                 | 大小   |
    | -------------------- | ------ |
    | 类型(同id3)          | 32 (4) |
    | mime的长度           | 32 (4) |
    | mime                 | N      |
    | 描述的长度           | 32 (4) |
    | 描述 utf-8           | N      |
    | 宽度 可能不写        | 32 (4) |
    | 高度                 | 32 (4) |
    | 颜色深度             | 32 (4) |
    | 索引图使用的颜色数目 | 32 (4) |
    | 数据长度             | 32 (4) |
    | 图片数据             | N      |

    
