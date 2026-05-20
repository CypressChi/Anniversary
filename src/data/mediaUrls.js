import heroImageUrl from "../assets/hero.png"

const remoteMediaUrls = {
  audio: {
    finalBgm:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/%E5%A5%BD%E4%B9%90%E5%9B%A2-%E6%88%91%E6%8A%8A%E6%88%91%E7%9A%84%E9%9D%92%E6%98%A5%E7%BB%99%E4%BD%A0.flac"
  },
  cover: "",
  finalPhotos: [],
  videos: {
    beijing:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Beijing.mp4",
    chengde:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Chengde.mp4",
    taipei:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Taipei.mp4",
    "hong-kong":
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Hongkong.mp4",
    macau:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Macao.mp4",
    ulanqab:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Ulanqab.mp4",
    nanjing:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Nanjing.mp4",
    shanghai:
      "https://menpyxj9galsp0ei.public.blob.vercel-storage.com/Shanghai.mp4"
  }
}

const localVideoUrls = {
  beijing: "/videos/Beijing.mp4",
  chengde: "/videos/Chengde.mp4",
  taipei: "/videos/Taipei.mp4",
  "hong-kong": "/videos/Hongkong.mp4",
  macau: "/videos/Macao.mp4",
  ulanqab: "/videos/Ulanqab.mp4",
  nanjing: "/videos/Nanjing.mp4",
  shanghai: "/videos/Shanghai.mp4"
}

const allLocalFinalPhotoUrls = [
  "/images/final/final-1.png",
  "/images/final/final-2.png",
  "/images/final/final-3.png",
  "/images/final/final-4.png",
  "/images/final/final-5.png",
  "/images/final/final-6.png",
  "/images/final/final-7.png",
  "/images/final/final-8.png",
  "/images/final/final-9.png",
  "/images/final/final-10.png",
  "/images/final/final-11.png",
  "/images/final/final-12.png",
  "/images/final/final-13.png",
  "/images/final/final-14.png",
  "/images/final/final-15.png",
  "/images/final/final-16.png",
  "/images/final/final-17.png",
  "/images/final/final-18.png",
  "/images/final/final-19.png",
  "/images/final/final-20.png",
  "/images/final/final-21.png",
  "/images/final/final-22.png",
  "/images/final/final-23.jpg",
  "/images/final/final-24.jpg",
  "/images/final/final-25.jpg",
  "/images/final/final-26.jpg",
  "/images/final/final-27.jpg",
  "/images/final/final-28.jpg",
  "/images/final/final-29.jpg",
  "/images/final/final-30.jpg",
  "/images/final/final-31.jpg",
  "/images/final/final-32.jpg",
  "/images/final/final-33.jpg",
  "/images/final/final-34.jpg",
  "/images/final/final-35.jpg",
  "/images/final/final-36.jpg",
  "/images/final/final-37.jpg",
  "/images/final/final-38.jpg",
  "/images/final/final-39.jpg",
  "/images/final/final-40.jpg",
  "/images/final/final-41.jpg",
  "/images/final/final-42.jpg",
  "/images/final/final-43.jpg",
  "/images/final/final-44.jpg",
  "/images/final/final-45.jpg",
  "/images/final/final-46.jpg",
  "/images/final/final-47.jpg",
  "/images/final/final-48.jpg"
]

const trackedFinalPhotoUrls = [
  "/images/final/final-5.png",
  "/images/final/final-8.png",
  "/images/final/final-19.png",
  "/images/final/final-24.jpg",
  "/images/final/final-25.jpg",
  "/images/final/final-26.jpg",
  "/images/final/final-28.jpg",
  "/images/final/final-29.jpg",
  "/images/final/final-30.jpg",
  "/images/final/final-31.jpg",
  "/images/final/final-33.jpg",
  "/images/final/final-34.jpg",
  "/images/final/final-38.jpg",
  "/images/final/final-46.jpg"
]

function useRemoteOrLocal(remoteUrl, localUrl = "") {
  return remoteUrl || localUrl
}

function localOnlyInDevelopment(localUrl) {
  return import.meta.env.DEV ? localUrl : ""
}

export const coverImageUrl = useRemoteOrLocal(
  remoteMediaUrls.cover,
  import.meta.env.DEV ? "/photos/anniversary.jpg" : heroImageUrl
)

export const finalBgmUrl = useRemoteOrLocal(
  remoteMediaUrls.audio.finalBgm,
  localOnlyInDevelopment("/audio/好乐团-我把我的青春给你.flac")
)

export const videoUrls = Object.fromEntries(
  Object.entries(localVideoUrls).map(([placeId, localUrl]) => [
    placeId,
    useRemoteOrLocal(remoteMediaUrls.videos[placeId], localOnlyInDevelopment(localUrl))
  ])
)

export const finalPhotoUrls = remoteMediaUrls.finalPhotos.length
  ? remoteMediaUrls.finalPhotos
  : import.meta.env.DEV
    ? allLocalFinalPhotoUrls
    : trackedFinalPhotoUrls
