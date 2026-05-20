import { memoryPlaces, siteContent as originalSiteContent } from "./memoryPlaces"

export const siteContent = {
  ...originalSiteContent,
  cover: {
    ...originalSiteContent.cover,
    kicker: "Stitch Anniversary Album",
    title: "我们的一周年纪念册",
    lead:
      "让史迪奇带路，把这一年去过的地方、一起走过的路、还有想说的话，慢慢翻给你看。"
  }
}

const guideTexts = {
  beijing: "第一站是北京。这里像故事开头，轻轻一翻，很多后来的甜都从这里开始。",
  chengde: "承德这一站很适合慢慢看，像关系升温时那种不急不响的心动。",
  taipei: "台北是把陌生变成安心的地方，因为有对方在，所以一切都开始有家的味道。",
  "hong-kong": "香港有一点起伏，也有很多珍贵。好的坏的，后来都变成只属于你们的回忆。",
  macau: "澳门这一站亮亮的、热闹的，也藏着很多一起走街串巷的小幸福。",
  ulanqab: "乌兰察布有风、有草原，也有一句鼓起勇气才问出口的亲亲。",
  nanjing: "南京这一站有博物馆，也有很生活化的小插曲，越想越可爱。",
  shanghai: "上海像一段可以每天见面的日子，普通的下班路也变得很值得怀念。"
}

function normalizeParagraph(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
}

function getLocation(place) {
  return place.location ?? place.locationLabel ?? place.name
}

function getPhotos(place) {
  if (Array.isArray(place.photos) && place.photos.length) {
    return place.photos
  }

  if (place.photo) {
    return [place.photo]
  }

  if (place.videoPoster) {
    return [place.videoPoster]
  }

  return []
}

export const memories = memoryPlaces.map((place) => {
  const longText = normalizeParagraph(place.longText ?? place.titleText ?? place.bodyText ?? "")

  return {
    ...place,
    title: place.title ?? place.name,
    date: place.date ?? place.dateLabel ?? "",
    location: getLocation(place),
    photos: getPhotos(place),
    shortText: place.shortText ?? "把这一站轻轻贴进相册里，像贴上一枚只属于你们的蓝色邮票。",
    longText,
    message: place.message ?? longText,
    guideText: place.guideText ?? guideTexts[place.id]
  }
})
