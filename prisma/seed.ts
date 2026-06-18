import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedNovels = [
  {
    id: "novel_001",
    slug: "shadow-monarchs-ascension",
    title: "Shadow Monarch's Ascension",
    author: "Lee Sung-woo",
    genre: "Action",
    type: "korean",
    description:
      "Sung Jin-Woo, the weakest hunter of all mankind, finds himself trapped in a deadly double dungeon. Facing certain death, he discovers a mysterious quest — one that will transform him into the most powerful being the world has ever seen.",
    coverUrl:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Action", "Fantasy", "Op MC", "System", "Manhwa"]),
    status: "ONGOING",
    totalChapters: 542,
    views: 12400000,
    ratingAverage: 4.9,
  },
  {
    id: "novel_002",
    slug: "celestial-emperors-legacy",
    title: "Celestial Emperor's Legacy",
    author: "Wang Xiao",
    genre: "Fantasy",
    type: "chinese",
    description:
      "A fallen emperor is reborn with memories of his past life and vows to reclaim his throne. Armed with forbidden cultivation techniques, he treads the path between heaven and mortal.",
    coverUrl:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Xianxia", "Cultivation", "Rebirth", "Emperor"]),
    status: "ONGOING",
    totalChapters: 328,
    views: 8100000,
    ratingAverage: 4.7,
  },
  {
    id: "novel_003",
    slug: "infinite-regression-chronicles",
    title: "Infinite Regression Chronicles",
    author: "Park Ji-hun",
    genre: "Regression",
    type: "korean",
    description:
      "Every time he dies, the world resets. After a thousand loops watching humanity fall, the Last Regressor decides this time will be different.",
    coverUrl:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Regression", "Time Loop", "Apocalypse", "Op MC"]),
    status: "ONGOING",
    totalChapters: 412,
    views: 9700000,
    ratingAverage: 4.8,
  },
  {
    id: "novel_004",
    slug: "mystic-cultivation-chronicles",
    title: "Mystic Cultivation Chronicles",
    author: "Chen Wei",
    genre: "Cultivation",
    type: "chinese",
    description:
      "An orphan with blocked meridians stumbles upon an ancient jade slip containing the lost techniques of a supreme cultivator. Against all odds, he embarks on a journey to reach the peak of immortality.",
    coverUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify([
      "Cultivation",
      "Wuxia",
      "Immortality",
      "Martial Arts",
      "Adventure",
    ]),
    status: "ONGOING",
    totalChapters: 612,
    views: 15200000,
    ratingAverage: 4.9,
  },
  {
    id: "novel_005",
    slug: "the-void-sorcerer",
    title: "The Void Sorcerer",
    author: "Kang Min-jun",
    genre: "Dark Fantasy",
    type: "korean",
    description:
      "Condemned for a crime he didn't commit, a court mage discovers that void magic banned by the kingdom is the only power capable of stopping the darkness threatening the continent.",
    coverUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Dark Fantasy", "Magic", "Antihero", "Political"]),
    status: "ONGOING",
    totalChapters: 287,
    views: 5300000,
    ratingAverage: 4.6,
  },
  {
    id: "novel_006",
    slug: "void-emperors-decree",
    title: "Void Emperor's Decree",
    author: "Park Ji-hun",
    genre: "Action",
    type: "korean",
    description:
      "Betrayed by the empire he served, a legendary general awakens in a world transformed by void rifts. Armed with a forbidden system, he carves a path of reckoning.",
    coverUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Action", "System", "Dungeon", "Revenge"]),
    status: "ONGOING",
    totalChapters: 214,
    views: 4100000,
    ratingAverage: 4.5,
  },
  {
    id: "novel_007",
    slug: "eternal-sakura-reborn",
    title: "Eternal Sakura Reborn",
    author: "Aiko Tanaka",
    genre: "Romance",
    type: "japanese",
    description:
      "A modern woman wakes up as the villainess destined to die in her favourite novel. Determined to rewrite her fate, she navigates court politics — and an unexpected love story.",
    coverUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Romance", "Isekai", "Reincarnation", "Shoujo"]),
    status: "COMPLETED",
    totalChapters: 195,
    views: 6700000,
    ratingAverage: 4.8,
  },
  {
    id: "novel_008",
    slug: "iron-blood-mercenary",
    title: "Iron Blood Mercenary",
    author: "Zhao Fang",
    genre: "Action",
    type: "chinese",
    description:
      "A retired war veteran takes one final mercenary job to save his village — only to be dragged into a conspiracy that spans the entire continent.",
    coverUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Action", "Wuxia", "Adventure", "Brotherhood"]),
    status: "COMPLETED",
    totalChapters: 389,
    views: 3800000,
    ratingAverage: 4.4,
  },
  {
    id: "novel_009",
    slug: "the-dragon-empress",
    title: "The Dragon Empress",
    author: "Mei Ling",
    genre: "Fantasy",
    type: "chinese",
    description:
      "Born with dragon blood in a world that fears her kind, a young empress must unite warring kingdoms before an ancient evil devours the realm.",
    coverUrl:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Fantasy", "Female Lead", "Dragons", "Political"]),
    status: "COMPLETED",
    totalChapters: 445,
    views: 7900000,
    ratingAverage: 4.7,
  },
  {
    id: "novel_010",
    slug: "system-override",
    title: "System Override",
    author: "Kim Dae-jung",
    genre: "Sci-Fi",
    type: "korean",
    description:
      "When a rogue AI grants him admin-level access to the world's hidden RPG system, a lowly data analyst becomes humanity's last line of defence against digital apocalypse.",
    coverUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Sci-Fi", "System", "Cyberpunk", "Hacker"]),
    status: "ONGOING",
    totalChapters: 278,
    views: 4500000,
    ratingAverage: 4.6,
  },
  {
    id: "novel_011",
    slug: "moonlit-villainess",
    title: "Moonlit Villainess",
    author: "Seo Yuna",
    genre: "Romance",
    type: "korean",
    description:
      "Transmigrated into the body of a noble villainess, she only wants to live quietly — but fate, and a certain cold-hearted duke, have other plans.",
    coverUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Romance", "Villainess", "Isekai", "Slow Burn"]),
    status: "ONGOING",
    totalChapters: 163,
    views: 3200000,
    ratingAverage: 4.5,
  },
  {
    id: "novel_012",
    slug: "abyss-walker",
    title: "Abyss Walker",
    author: "Ryu Hajime",
    genre: "Horror",
    type: "japanese",
    description:
      "A detective who can see the dead is assigned to investigate disappearances near an ancient temple — where something far older than ghosts waits in the dark.",
    coverUrl:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=360&h=540&fit=crop&auto=format",
    bannerUrl:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1600&h=640&fit=crop&auto=format",
    tags: JSON.stringify(["Horror", "Mystery", "Psychological"]),
    status: "HIATUS",
    totalChapters: 201,
    views: 2600000,
    ratingAverage: 4.3,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  for (const novel of seedNovels) {
    const existing = await prisma.novel.findUnique({
      where: { slug: novel.slug },
    });

    if (existing) {
      console.log(`✅ Novel "${novel.title}" already exists, skipping...`);
      continue;
    }

    const created = await prisma.novel.create({
      data: novel,
    });
    console.log(`✅ Created novel: ${created.title} (${created.slug})`);
  }

  console.log("✨ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
