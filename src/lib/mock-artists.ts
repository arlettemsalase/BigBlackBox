import type { Artist } from "./types"
import { mockContents } from "./mock-data"

export const mockArtists: Artist[] = [
  {
    id: "1",
    username: "@laia_yuren",
    displayName: "Laia Yuren",
    bio: "Digital Illustrator & Concept Artist",
    avatar: "/artists/laia.png",
    works: mockContents.filter(c => c.creator === "@laia_yuren")
  },
  {
    id: "2",
    username: "@yukitanaka",
    displayName: "Yuki Tanaka",
    bio: "Anime Artist & Character Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
    works: mockContents.filter(c => c.creator === "@yukitanaka")
  },
  {
    id: "3",
    username: "@hironaka",
    displayName: "Hiro Nakamura",
    bio: "Cyberpunk & Neon Artist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hiro",
    works: mockContents.filter(c => c.creator === "@hironaka")
  },
  {
    id: "4",
    username: "@aikosuzuki",
    displayName: "Aiko Suzuki",
    bio: "Fantasy & Marine Illustrator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aiko",
    works: mockContents.filter(c => c.creator === "@aikosuzuki")
  },
  {
    id: "5",
    username: "@kenjiyama",
    displayName: "Kenji Yamamoto",
    bio: "Epic Fantasy Character Artist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kenji",
    works: mockContents.filter(c => c.creator === "@kenjiyama")
  },
  {
    id: "6",
    username: "@sakuramtmt",
    displayName: "Sakura Matsumoto",
    bio: "Seasonal & Nature Artist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sakura",
    works: mockContents.filter(c => c.creator === "@sakuramtmt")
  },
  {
    id: "7",
    username: "@rentaka",
    displayName: "Ren Takahashi",
    bio: "Night & Moonlight Specialist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ren",
    works: mockContents.filter(c => c.creator === "@rentaka")
  },
  {
    id: "8",
    username: "@kaitokoba",
    displayName: "Kaito Kobayashi",
    bio: "Dragon & Mythical Creatures",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kaito",
    works: mockContents.filter(c => c.creator === "@kaitokoba")
  },
  {
    id: "9",
    username: "@yumiwata",
    displayName: "Yumi Watanabe",
    bio: "Winter & Magical Landscapes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yumi",
    works: mockContents.filter(c => c.creator === "@yumiwata")
  },
  {
    id: "10",
    username: "@daichisato",
    displayName: "Daichi Sato",
    bio: "Phoenix & Fire Element Artist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=daichi",
    works: mockContents.filter(c => c.creator === "@daichisato")
  },
  {
    id: "11",
    username: "@meifuji",
    displayName: "Mei Fujiwara",
    bio: "Celestial & Cosmic Illustrator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mei",
    works: mockContents.filter(c => c.creator === "@meifuji")
  },
  {
    id: "12",
    username: "@takeshiishi",
    displayName: "Takeshi Ishida",
    bio: "Forest & Nature Magic Artist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=takeshi",
    works: mockContents.filter(c => c.creator === "@takeshiishi")
  }
]
