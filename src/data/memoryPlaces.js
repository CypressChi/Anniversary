export const siteContent = {
  cover: {
    kicker: "Happy Anniversary",
    title: "这一年，和你一起走过的地方都在熠熠生辉。",
    lead:
      "我把我们的生活碎片和回忆做在了这个小站里，想让它成为我们回忆的载体，每次打开它，就仿佛过去种种都历历在目。",
    background: "/photos/anniversary.jpg",
    backgroundPosition: "58% center",
    backgroundDisplayPosition: "62% center"
  }
}

/**
 * @typedef {Object} MemoryPlace
 * @property {string} id
 * @property {string} name
 * @property {string=} locationLabel
 * @property {string} dateLabel
 * @property {string} videoSrc
 * @property {string=} videoPoster
 * @property {string=} videoLabel
 * @property {string} titleText
 * @property {string=} bodyText
 * @property {[number, number]} coordinates
 * @property {[number, number]=} markerCoordinates
 * @property {number=} zoom
 * @property {string=} accent
 * @property {string=} tooltipDirection
 * @property {[number, number]=} tooltipOffset
 * @property {boolean=} isVisited
 */

/** @type {MemoryPlace[]} */
export const memoryPlaces = [
  {
    id: "beijing",
    name: "北京",
    dateLabel: "2025.02 - 2025.06",
    videoSrc: "/videos/Beijing.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `我们在这里相识、相知、相爱。

                感谢当时的自己
                最终还是选择了去往北京交换，

                我才有机会和你相遇，
                才能和你在一起。`,
    coordinates: [39.9042, 116.4074],
    zoom: 11,
    accent: "#d8a283"
  },
  {
    id: "chengde",
    name: "承德",
    dateLabel: "2025.05",
    videoSrc: "/videos/Chengde.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `我们第一次一起出去旅行。

                那个时候我们还没有那么熟，还在互相摸索，我们的感情还是很含蓄的。

                承德的山山水水见证了我们关系的升温。`,
    coordinates: [40.9515, 117.9634],
    zoom: 11,
    accent: "#bda17d"
  },
  {
    id: "taipei",
    name: "台北",
    dateLabel: "2025.12",
    videoSrc: "/videos/Taipei.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `第一次来到了你的家乡，也见到了你的家人。
                那个时候的我还觉得这里的一切都很新奇，我都小心翼翼的打量着这里。
                但因为有你在我身边，我很快就适应了这里的一切，也很快就爱上了这里的一切。`,
    coordinates: [25.033, 121.5654],
    zoom: 12,
    accent: "#efb39e"
  },
  {
    id: "hong-kong",
    name: "香港",
    dateLabel: "2026.04",
    videoSrc: "/videos/Hongkong.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `港珠澳天团的第一站，在这里我们经历了不快，也经历了美好。
                但是因为有你在，所以不快的部分也都变得不那么糟糕了。
                我们在这里留下了很多回忆，吃过的东西，去过的地方，都让我觉得很珍贵。`,
    coordinates: [22.3193, 114.1694],
    markerCoordinates: [22.48, 114.46],
    tooltipDirection: "right",
    tooltipOffset: [12, -2],
    zoom: 11,
    accent: "#cf9fc8"
  },
  {
    id: "macau",
    name: "澳门",
    dateLabel: "2026.05",
    videoSrc: "/videos/Macao.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `港珠澳天团的最后一站。
                我们不仅领略了澳门的纸醉金迷，也吃上了路边小店。
                虽然澳门的面积不大，但我们在这里的经历却是丰富多彩的。`,
    coordinates: [22.1987, 113.5439],
    markerCoordinates: [22.03, 113.18],
    tooltipDirection: "left",
    tooltipOffset: [-12, -2],
    zoom: 12,
    accent: "#efc7ad"
  },
  {
    id: "ulanqab",
    name: "乌兰察布",
    dateLabel: "2026.06",
    videoSrc: "/videos/Ulanqab.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `第一次单独出去玩。
                说想去草原，于是我们来到了乌兰察布。

                还记得在房间里我还在偷问你可不可以亲亲你。
                谁知道我等了多久才鼓起勇气问你的。`,
    coordinates: [41.0341, 113.1155],
    zoom: 10,
    accent: "#a7c7b0"
  },
  {
    id: "nanjing",
    name: "南京",
    dateLabel: "2025.08",
    videoSrc: "/videos/Nanjing.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `这里给我印象最深的是南博，扣扣脑袋。
                还有昀瑾的鸭血粉丝没有鸭血，嘿嘿嘿。`,
    coordinates: [32.0603, 118.7969],
    zoom: 11,
    accent: "#d4b1d0"
  },
  {
    id: "shanghai",
    name: "上海",
    dateLabel: "2025.07",
    videoSrc: "/videos/Shanghai.mp4",
    videoPoster: "/photos/anniversary.jpg",
    titleText: `昀瑾为了能够和我多见一下面，还专门选了个上海的实习，我们才能如愿在这里见面。
                每天都接昀瑾下班，想想就好怀念那个时候的生活呀，我们可以每天都见面。`,
    coordinates: [31.2304, 121.4737],
    zoom: 11,
    accent: "#d9b0c2"
  }
]
