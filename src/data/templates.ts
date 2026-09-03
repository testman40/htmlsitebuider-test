import { GenreType, SiteData, VideoPreset } from '../types/builder';

export interface GenreDefinition {
  id: GenreType;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  recommendedFor: string;
  defaultPages: string[];
  thumbnail: string;
  variations: {
    id: string;
    name: string;
    paletteName: string;
    primaryColor: string;
    accentColor: string;
    fontFamily: 'sans' | 'serif' | 'rounded';
    bgPresetId?: string;
  }[];
}

export const VIDEO_PRESETS: VideoPreset[] = [
  {
    id: 'preset_waves',
    name: '穏やかな波と海岸線',
    category: '自然・海',
    description: 'リラックスした海辺のループ。カフェやサロン、個人サイトに最適。',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    duration: '6秒 ループ',
    fileSize: '1.4MB'
  },
  {
    id: 'preset_cafe',
    name: 'モダンカフェの光と木目',
    category: '都市・カフェ',
    description: '温かい光が差し込むカフェの情景。飲食店や店舗サイトに。',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-warm-sunlight-through-window-curtains-42588-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1280&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    duration: '8秒 ループ',
    fileSize: '1.9MB'
  },
  {
    id: 'preset_particles',
    name: 'デジタルパーティクル＆光流',
    category: '幾何学・テクノロジー',
    description: '洗練された青の光粒子。ビジネス・IT・ポートフォリオに。',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    duration: '7秒 ループ',
    fileSize: '2.1MB'
  },
  {
    id: 'preset_gradient',
    name: 'オーロラグラデーション',
    category: 'グラデーションアニメーション',
    description: 'ふんわりと色が移り変わる軽量アニメーション。',
    videoUrl: '', // Pure CSS gradient canvas animation
    fallbackImageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1280&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80',
    duration: 'CSS無限ループ',
    fileSize: '軽量 0.05MB'
  }
];

export const GENRE_DEFINITIONS: GenreDefinition[] = [
  {
    id: 'shop_business',
    title: 'お店・ビジネス',
    badge: '人気 No.1',
    tagline: 'カフェ・サロン・飲食店・地域ビジネス向け',
    description: 'トップ、商品・メニュー、アクセス案内、お問い合わせの4ページ完結セット。初めての店舗サイトに最適です。',
    recommendedFor: 'カフェ、飲食店、美容院、整体院、地域教室、士業事務所',
    defaultPages: ['トップ', 'メニュー・商品', 'アクセス', 'お問い合わせ'],
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    variations: [
      {
        id: 'natural_wood',
        name: 'ナチュラル・温もり',
        paletteName: 'カフェオレ & アースグリーン',
        primaryColor: '#78350f',
        accentColor: '#15803d',
        fontFamily: 'serif',
        bgPresetId: 'preset_cafe'
      },
      {
        id: 'modern_clean',
        name: 'モダン・清潔感',
        paletteName: 'ネイビー & コバルトブルー',
        primaryColor: '#0f172a',
        accentColor: '#2563eb',
        fontFamily: 'sans'
      },
      {
        id: 'soft_pastel',
        name: 'ソフト・親しみやすさ',
        paletteName: 'テラコッタ & サクラ',
        primaryColor: '#c2410c',
        accentColor: '#f97316',
        fontFamily: 'rounded'
      }
    ]
  },
  {
    id: 'personal_bio',
    title: '自己紹介・名刺代わり',
    badge: '1ページ完結',
    tagline: 'フリーランス・副業・SNSリンク集向け',
    description: 'プロフィール、経歴、実績、SNSリンク、連絡先を1ページにまとめたスッキリ見やすいパーソナルサイト。',
    recommendedFor: 'フリーランス、クリエイター、講師、就活・転職活動、SNSインフルエンサー',
    defaultPages: ['プロフィール'],
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    variations: [
      {
        id: 'minimal_mono',
        name: 'ミニマル・スタイリッシュ',
        paletteName: 'スレートブラック & エメラルド',
        primaryColor: '#1e293b',
        accentColor: '#059669',
        fontFamily: 'sans'
      },
      {
        id: 'creative_pop',
        name: 'クリエイティブ・カジュアル',
        paletteName: 'バイオレット & サンセット',
        primaryColor: '#4c1d95',
        accentColor: '#f59e0b',
        fontFamily: 'rounded'
      }
    ]
  },
  {
    id: 'portfolio',
    title: 'ポートフォリオ',
    badge: '作品を魅せる',
    tagline: 'デザイナー・写真家・イラストレーター向け',
    description: '大きな画像ギャラリー、プロジェクト詳細、プロフィール、お問い合わせの構成。作品が引き立つレイアウトです。',
    recommendedFor: 'デザイナー、写真家、イラストレーター、Webエンジニア、建築家',
    defaultPages: ['トップ', '作品ギャラリー', 'プロフィール', 'お問い合わせ'],
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    variations: [
      {
        id: 'gallery_dark',
        name: 'アート・ダークモダン',
        paletteName: 'ディープチャコール & ピュアホワイト',
        primaryColor: '#111827',
        accentColor: '#6366f1',
        fontFamily: 'sans'
      },
      {
        id: 'editorial_light',
        name: 'エディトリアル・洗練',
        paletteName: 'ウォームグレー & ボルドー',
        primaryColor: '#292524',
        accentColor: '#991b1b',
        fontFamily: 'serif'
      }
    ]
  },
  {
    id: 'blog_column',
    title: 'ブログ・コラム',
    badge: '読みやすさ重視',
    tagline: '情報発信・コラム・オウンドメディア向け',
    description: '新着一覧トップ、記事本文ページ、カテゴリ一覧、サイトについての標準4ページ。長文でも疲れない文字組みです。',
    recommendedFor: '専門家コラム、趣味ブログ、活動報告、ニュースレター',
    defaultPages: ['トップ (新着一覧)', '記事サンプル', 'カテゴリ一覧', 'About (このサイトについて)'],
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
    variations: [
      {
        id: 'clean_journal',
        name: 'クリーン・ジャーナル',
        paletteName: 'フォレストグリーン & インクブラック',
        primaryColor: '#164e63',
        accentColor: '#0d9488',
        fontFamily: 'serif'
      },
      {
        id: 'tech_note',
        name: 'テック・ノート',
        paletteName: 'インディゴ & スカイブルー',
        primaryColor: '#1e1b4b',
        accentColor: '#0284c7',
        fontFamily: 'sans'
      }
    ]
  },
  {
    id: 'event_notice',
    title: 'イベント・お知らせ',
    badge: '告知特化',
    tagline: 'セミナー・発表会・催し物・キャンペーン向け',
    description: 'イベント開催概要、タイムテーブル・プログラム、アクセス、参加申込み案内の4ページ。告知から集客まで一気通貫。',
    recommendedFor: '勉強会、セミナー、音楽会、ワークショップ、個展、地域フェス',
    defaultPages: ['トップ', '詳細・プログラム', '会場アクセス', 'お申し込み案内'],
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    variations: [
      {
        id: 'vibrant_festival',
        name: 'エネルギッシュ・活気',
        paletteName: 'ルビーレッド & マリーゴールド',
        primaryColor: '#991b1b',
        accentColor: '#e11d48',
        fontFamily: 'rounded'
      },
      {
        id: 'formal_conference',
        name: 'フォーマル・カンファレンス',
        paletteName: 'スレートブルー & スチール',
        primaryColor: '#0f172a',
        accentColor: '#3b82f6',
        fontFamily: 'sans'
      }
    ]
  },
  {
    id: 'scratch',
    title: 'まっさらから作る',
    badge: '自由度MAX',
    tagline: '白紙のキャンバスからオリジナルサイトを構築',
    description: 'テンプレートの固定枠なし。見出し・テキスト・画像・ボタンを自由に配置してゼロから組み立てられます。',
    recommendedFor: 'デザインにこだわりたい方、自分で1からパーツを置きたい方',
    defaultPages: ['トップページ'],
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    variations: [
      {
        id: 'blank_neutral',
        name: 'スタンダード・シンプル',
        paletteName: 'ニュートラルスレート',
        primaryColor: '#334155',
        accentColor: '#2563eb',
        fontFamily: 'sans'
      }
    ]
  }
];

export function createInitialSiteData(
  genreId: GenreType = 'shop_business', 
  variationId?: string, 
  customSiteName?: string
): SiteData {
  const genreDef = GENRE_DEFINITIONS.find(g => g.id === genreId) || GENRE_DEFINITIONS[0];
  const variation = genreDef.variations.find(v => v.id === variationId) || genreDef.variations[0];
  
  const siteName = customSiteName || (
    genreId === 'shop_business' ? 'Cafe Lumière' :
    genreId === 'personal_bio' ? 'Taro Yamada Portfolio' :
    genreId === 'portfolio' ? 'Design Studio Alpha' :
    genreId === 'blog_column' ? '日々の日記 & テックノート' :
    genreId === 'event_notice' ? '2026年 春のクリエイターズサミット' :
    'My New Website'
  );

  let pages = [];

  if (genreId === 'shop_business') {
    pages = [
      {
        id: 'p_home',
        name: 'トップ',
        slug: 'index',
        description: '店舗トップページ',
        blocks: [
          {
            id: 'b_h1',
            type: 'heading' as const,
            level: 1 as const,
            badge: '自家焙煎スペシャルティコーヒー',
            text: '心ほどける一杯と、穏やかなひとときを。',
            subtext: '路地裏に佇む隠れ家カフェ。毎朝焙煎する新鮮な豆と手作りスイーツをお届けします。',
            align: 'center' as const
          },
          {
            id: 'b_img1',
            type: 'image' as const,
            src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
            alt: '店内のカウンターと落ち着いた照明',
            caption: '木の温もりを感じる店内でゆったりお過ごしいただけます',
            align: 'center' as const,
            maxWidth: 'large' as const,
            rounded: true
          },
          {
            id: 'b_t1',
            type: 'text' as const,
            size: 'base' as const,
            align: 'center' as const,
            text: '私たちは「人と人が心地よくつながる居場所」を目指しています。産地にこだわり厳選したシングルオリジンコーヒーと、季節の素材をたっぷり使った自家製タルトをご用意して、皆さまのお越しをお待ちしております。'
          },
          {
            id: 'b_btn1',
            type: 'button' as const,
            label: 'メニューを見る →',
            link: 'menu.html',
            variant: 'primary' as const,
            align: 'center' as const
          }
        ]
      },
      {
        id: 'p_menu',
        name: 'メニュー・商品',
        slug: 'menu',
        description: 'コーヒーとフードのご案内',
        blocks: [
          {
            id: 'b_menu_h1',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'MENU & SWEETS',
            text: 'こだわりのメニュー',
            subtext: 'すべてのメニューに高品質な素材のみを使用しています。テイクアウトも可能です。',
            align: 'center' as const
          },
          {
            id: 'b_cards',
            type: 'card_grid' as const,
            columns: 3 as const,
            items: [
              {
                id: 'c1',
                title: 'ドリップコーヒー (深煎り)',
                description: '芳醇なアロマとビターチョコレートのようなコク。',
                priceOrDate: '¥600 (税込)',
                tag: 'おすすめ',
                imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
              },
              {
                id: 'c2',
                title: '季節のフルーツタルト',
                description: 'サクサク生地に旬の果実とカスタードを贅沢に。',
                priceOrDate: '¥750 (税込)',
                tag: '季節限定',
                imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80'
              },
              {
                id: 'c3',
                title: '自家製ホットサンドイッチ',
                description: '発酵バターの香るトーストにモッツァレラと生ハム。',
                priceOrDate: '¥850 (税込)',
                tag: 'ランチ人気',
                imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80'
              }
            ]
          },
          {
            id: 'b_btn_acc',
            type: 'button' as const,
            label: 'お店へのアクセス案内',
            link: 'access.html',
            variant: 'outline' as const,
            align: 'center' as const
          }
        ]
      },
      {
        id: 'p_access',
        name: 'アクセス',
        slug: 'access',
        description: '店舗へのアクセスと営業時間',
        blocks: [
          {
            id: 'b_acc_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'LOCATION',
            text: '店舗情報・アクセス',
            subtext: '駅から徒歩5分。静かな小道沿いにございます。',
            align: 'center' as const
          },
          {
            id: 'b_acc_info',
            type: 'access_map' as const,
            title: 'Cafe Lumière (カフェ・リュミエール)',
            address: '〒150-0001 東京都渋谷区神宮前3-12-8 ルミエールビル 1F',
            accessInfo: '東京メトロ千代田線「明治神宮前駅」エレベーター口より徒歩5分 / JR「原宿駅」竹下口より徒歩8分',
            businessHours: '月〜金 08:30〜19:00 / 土日祝 09:00〜20:00 (定休日: 毎週火曜)',
            phone: '03-1234-5678',
            mapEmbedQuery: '東京都渋谷区神宮前'
          }
        ]
      },
      {
        id: 'p_contact',
        name: 'お問い合わせ',
        slug: 'contact',
        description: 'ご予約・取材のお問い合わせ',
        blocks: [
          {
            id: 'b_cnt_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'CONTACT',
            text: 'お問い合わせ・お席のご予約',
            subtext: '貸切やホールケーキのご注文、メディア取材などお気軽にご連絡ください。',
            align: 'center' as const
          },
          {
            id: 'b_form',
            type: 'contact_form' as const,
            title: 'メッセージ送信フォーム',
            description: '下記フォームより必要事項をご入力の上、送信ボタンを押してください。2営業日以内にご返信いたします。',
            buttonLabel: '送信する (確認画面へ)',
            fields: [
              { id: 'f_name', label: 'お名前', type: 'text', required: true },
              { id: 'f_email', label: 'メールアドレス', type: 'email', required: true },
              { id: 'f_msg', label: 'お問い合わせ内容', type: 'textarea', required: true }
            ]
          }
        ]
      }
    ];
  } else if (genreId === 'personal_bio') {
    pages = [
      {
        id: 'p_bio',
        name: 'プロフィール',
        slug: 'index',
        description: '自己紹介・名刺代わりサイト',
        blocks: [
          {
            id: 'b_bio_h',
            type: 'heading' as const,
            level: 1 as const,
            badge: 'Web Creator / UI Designer',
            text: '山田 太郎 / Taro Yamada',
            subtext: '東京を拠点に、使いやすく美しいWebサイトとUIデザインを制作しています。',
            align: 'center' as const
          },
          {
            id: 'b_bio_img',
            type: 'image' as const,
            src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            alt: 'プロフィール写真',
            caption: '写真撮影や日常の様子はSNSで発信中',
            align: 'center' as const,
            maxWidth: 'small' as const,
            rounded: true
          },
          {
            id: 'b_bio_text',
            type: 'text' as const,
            size: 'base' as const,
            align: 'center' as const,
            text: '大学卒業後、制作会社にて5年間のWebディレクションおよびデザインを経験。現在はフリーランスとして中小企業や個人事業主様のホームページ制作、ロゴデザインをお手伝いしています。'
          },
          {
            id: 'b_bio_btn',
            type: 'button' as const,
            label: 'お仕事のご相談・メールはこちら',
            link: 'mailto:sample@example.com',
            variant: 'primary' as const,
            align: 'center' as const
          }
        ]
      }
    ];
  } else if (genreId === 'portfolio') {
    pages = [
      {
        id: 'p_port_home',
        name: 'トップ',
        slug: 'index',
        description: 'ポートフォリオトップ',
        blocks: [
          {
            id: 'b_ph1',
            type: 'heading' as const,
            level: 1 as const,
            badge: 'Selected Works 2024-2026',
            text: 'デザインと思想が調和する、クリエイティブアーカイブ。',
            subtext: 'ブランディング・Webデザイン・写真の各プロジェクトを掲載しています。',
            align: 'center' as const
          },
          {
            id: 'b_port_cards',
            type: 'card_grid' as const,
            columns: 3 as const,
            items: [
              {
                id: 'pw1',
                title: 'Brand Identity: Minimalist Brew',
                description: 'クラフトビバレッジのロゴ及びパッケージブランディング。',
                priceOrDate: '2025.10',
                tag: 'Branding',
                imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80'
              },
              {
                id: 'pw2',
                title: 'Architecture Web Portal',
                description: '自然光とコンクリート美を強調した建築設計事務所サイト。',
                priceOrDate: '2025.06',
                tag: 'Web Design',
                imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
              },
              {
                id: 'pw3',
                title: 'Editorial Photo Book',
                description: '四季の静謐な森をフィルムカメラで記録した写真展図録。',
                priceOrDate: '2024.12',
                tag: 'Photography',
                imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80'
              }
            ]
          },
          {
            id: 'b_btn_gallery',
            type: 'button' as const,
            label: '作品ギャラリーをもっと見る',
            link: 'gallery.html',
            variant: 'primary' as const,
            align: 'center' as const
          }
        ]
      },
      {
        id: 'p_port_gallery',
        name: '作品ギャラリー',
        slug: 'gallery',
        description: '詳細な作品一覧',
        blocks: [
          {
            id: 'b_gh',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'ARCHIVE',
            text: '作品ギャラリー',
            subtext: 'これまでに手がけた代表的な制作実績です。',
            align: 'center' as const
          },
          {
            id: 'b_img_gal1',
            type: 'image' as const,
            src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            alt: 'UIダッシュボードのプロトタイプ',
            caption: 'SaaSプロダクト向けの直感的なデータ可視化インターフェース',
            align: 'center' as const,
            maxWidth: 'large' as const,
            rounded: true
          }
        ]
      },
      {
        id: 'p_port_profile',
        name: 'プロフィール',
        slug: 'profile',
        description: '経歴と制作理念',
        blocks: [
          {
            id: 'b_prof_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'ABOUT ME',
            text: 'デザイナーについて',
            subtext: '直感と論理の両立を重んじるデザイン哲学。',
            align: 'center' as const
          },
          {
            id: 'b_prof_txt',
            type: 'text' as const,
            size: 'base' as const,
            align: 'left' as const,
            text: '武蔵野美術大学卒業後、デザインエージェンシーにてアートディレクターとして勤務。2023年より独立。国内外のデザインアワード多数受賞。'
          }
        ]
      },
      {
        id: 'p_port_contact',
        name: 'お問い合わせ',
        slug: 'contact',
        description: 'ご依頼・ご相談',
        blocks: [
          {
            id: 'b_pc_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'CONTACT',
            text: 'プロジェクトのご相談',
            subtext: '新規のお仕事依頼やご質問はこちらからお気軽にご連絡ください。',
            align: 'center' as const
          },
          {
            id: 'b_pc_form',
            type: 'contact_form' as const,
            title: 'ご依頼・お問い合わせフォーム',
            description: 'ご予算感や希望納期なども明記いただけますとスムーズです。',
            buttonLabel: '送信する',
            fields: [
              { id: 'f_pname', label: '貴社名 / お名前', type: 'text', required: true },
              { id: 'f_pemail', label: 'メールアドレス', type: 'email', required: true },
              { id: 'f_pdesc', label: 'ご相談概要', type: 'textarea', required: true }
            ]
          }
        ]
      }
    ];
  } else if (genreId === 'blog_column') {
    pages = [
      {
        id: 'p_blog_home',
        name: 'トップ (新着一覧)',
        slug: 'index',
        description: 'ブログ最新記事一覧',
        blocks: [
          {
            id: 'b_bh1',
            type: 'heading' as const,
            level: 1 as const,
            badge: 'DAILY THOUGHTS & ESSAYS',
            text: '日々の学びと小さな気づきを紡ぐノート。',
            subtext: 'テクノロジー、読書感想、暮らしの道具について毎週更新しています。',
            align: 'center' as const
          },
          {
            id: 'b_blog_cards',
            type: 'card_grid' as const,
            columns: 2 as const,
            items: [
              {
                id: 'bc1',
                title: '初心者でも迷わない、シンプルなHTMLサイトの作り方',
                description: '複雑なフレームワークを使わずに、素朴で高速なWebサイトを作る楽しさについて考察します。',
                priceOrDate: '2026.03.01 更新',
                tag: 'Web制作',
                imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80'
              },
              {
                id: 'bc2',
                title: '生産性を高めるデスク周りの愛用品10選',
                description: '自然光とミニマルな配置で集中力を維持するワークスペースの整え方。',
                priceOrDate: '2026.02.24 更新',
                tag: 'ライフスタイル',
                imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80'
              }
            ]
          }
        ]
      },
      {
        id: 'p_blog_article',
        name: '記事サンプル',
        slug: 'article-sample',
        description: '記事本文サンプル',
        blocks: [
          {
            id: 'b_art_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: '2026年3月1日 / Web制作',
            text: '初心者でも迷わない、シンプルなHTMLサイトの作り方',
            subtext: '手書きHTMLからビルダーツールまで、それぞれの長所を整理する',
            align: 'left' as const
          },
          {
            id: 'b_art_t1',
            type: 'text' as const,
            size: 'base' as const,
            align: 'left' as const,
            text: '近年はWordPressや複雑なノーコードツールが主流ですが、初心者が最初に学ぶべきは「HTMLがどのような仕組みで動いているか」というシンプルな手触りです。\n\n自分のサーバーに「index.html」というファイルを置き、ブラウザでアクセスした瞬間に世界中から閲覧できるようになる感動は、何ものにも代えがたい体験です。'
          }
        ]
      },
      {
        id: 'p_blog_cat',
        name: 'カテゴリ一覧',
        slug: 'categories',
        description: 'テーマ別アーカイブ',
        blocks: [
          {
            id: 'b_cat_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'CATEGORIES',
            text: 'カテゴリー別アーカイブ',
            subtext: '興味のあるテーマから記事を探せます。',
            align: 'center' as const
          },
          {
            id: 'b_cat_cards',
            type: 'card_grid' as const,
            columns: 3 as const,
            items: [
              { id: 'cat1', title: 'Webデザイン・制作', description: 'HTML/CSSの基礎から最新トレンドまで', tag: '24 記事' },
              { id: 'cat2', title: '読書・おすすめ本', description: '心を動かされたビジネス書・小説の書評', tag: '18 記事' },
              { id: 'cat3', title: '暮らしと道具', description: '買ってよかった文房具や家具のレビュー', tag: '32 記事' }
            ]
          }
        ]
      },
      {
        id: 'p_blog_about',
        name: 'About (このサイトについて)',
        slug: 'about',
        description: 'サイト運営者情報',
        blocks: [
          {
            id: 'b_ba_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'ABOUT',
            text: 'このブログの目的と運営者について',
            subtext: '読者の皆様に役立つ知識と癒しをお届けします。',
            align: 'center' as const
          },
          {
            id: 'b_ba_t',
            type: 'text' as const,
            size: 'base' as const,
            align: 'center' as const,
            text: 'はじめまして。当ブログは日々の生活や仕事で得た知見を共有する目的で開設しました。お問い合わせは各記事末尾のフォームよりお寄せください。'
          }
        ]
      }
    ];
  } else if (genreId === 'event_notice') {
    pages = [
      {
        id: 'p_ev_home',
        name: 'トップ',
        slug: 'index',
        description: 'イベント開催概要',
        blocks: [
          {
            id: 'b_evh',
            type: 'heading' as const,
            level: 1 as const,
            badge: '2026.04.18(SAT) 開催決定！',
            text: 'クリエイターズサミット 2026',
            subtext: '次世代のものづくりを担うデザイナー・開発者が集う一日限りの祭典。',
            align: 'center' as const
          },
          {
            id: 'b_ev_img',
            type: 'image' as const,
            src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
            alt: 'カンファレンス会場の様子',
            caption: '定員200名 / オンライン同時配信あり',
            align: 'center' as const,
            maxWidth: 'large' as const,
            rounded: true
          },
          {
            id: 'b_ev_btn',
            type: 'button' as const,
            label: '今すぐ参加申し込む (先着順)',
            link: 'register.html',
            variant: 'primary' as const,
            align: 'center' as const
          }
        ]
      },
      {
        id: 'p_ev_detail',
        name: '詳細・プログラム',
        slug: 'program',
        description: 'タイムテーブル',
        blocks: [
          {
            id: 'b_prg_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'TIMETABLE',
            text: '当日のプログラム',
            subtext: '基調講演からパネルディスカッションまで充実の構成。',
            align: 'center' as const
          },
          {
            id: 'b_prg_cards',
            type: 'card_grid' as const,
            columns: 3 as const,
            items: [
              { id: 't1', title: '10:00 - 11:30', description: '基調講演: AIとデザインの共存が生む新時代', priceOrDate: 'メインホール', tag: 'Keynote' },
              { id: 't2', title: '13:00 - 15:00', description: 'ハンズオン: 初心者向けWebビルダー実践', priceOrDate: 'ワークショップ室', tag: 'Workshop' },
              { id: 't3', title: '16:00 - 18:00', description: '交流会 & ライトニングトーク大会', priceOrDate: 'カフェラウンジ', tag: 'Party' }
            ]
          }
        ]
      },
      {
        id: 'p_ev_access',
        name: '会場アクセス',
        slug: 'access',
        description: '会場への行き方',
        blocks: [
          {
            id: 'b_ea_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'VENUE',
            text: '会場案内',
            subtext: 'アクセス抜群の都心カンファレンスセンターです。',
            align: 'center' as const
          },
          {
            id: 'b_ea_map',
            type: 'access_map' as const,
            title: '東京ミッドタウン ホールB',
            address: '〒107-0052 東京都港区赤坂9-7-1',
            accessInfo: '都営大江戸線「六本木駅」8番出口直結 / 東京メトロ日比谷線「六本木駅」地下通路直結',
            businessHours: '開場 09:30 / 閉幕 18:30',
            phone: '03-9876-5432',
            mapEmbedQuery: '東京ミッドタウン'
          }
        ]
      },
      {
        id: 'p_ev_reg',
        name: '申し込み案内',
        slug: 'register',
        description: 'チケット申込み',
        blocks: [
          {
            id: 'b_reg_h',
            type: 'heading' as const,
            level: 2 as const,
            badge: 'ENTRY',
            text: '参加申し込みフォーム',
            subtext: '定員になり次第締め切りますのでお早めにご登録ください。',
            align: 'center' as const
          },
          {
            id: 'b_reg_form',
            type: 'contact_form' as const,
            title: 'チケット申込み情報入力',
            description: '登録完了後、入力いただいたメールアドレスに参加証QRコードをお送りします。',
            buttonLabel: '申し込む (無料)',
            fields: [
              { id: 'f_reg_name', label: '参加者氏名', type: 'text', required: true },
              { id: 'f_reg_email', label: 'ご連絡先メール', type: 'email', required: true },
              { id: 'f_reg_type', label: '参加形式 (現地 or オンライン)', type: 'text', required: true }
            ]
          }
        ]
      }
    ];
  } else {
    // scratch (まっさらから作る)
    pages = [
      {
        id: 'p_scratch_home',
        name: 'トップページ',
        slug: 'index',
        description: '白紙のページ',
        blocks: [
          {
            id: 'b_s_h1',
            type: 'heading' as const,
            level: 1 as const,
            badge: 'WELCOME TO YOUR NEW SITE',
            text: 'ここにあなたのキャッチコピーを入力',
            subtext: '左側のパネルから見出し、テキスト、画像、ボタンを自由に追加してサイトを組み立てましょう。',
            align: 'center' as const
          },
          {
            id: 'b_s_btn',
            type: 'button' as const,
            label: '詳しくはこちら',
            link: '#',
            variant: 'primary' as const,
            align: 'center' as const
          }
        ]
      }
    ];
  }

  return {
    site_id: 'site_' + Math.random().toString(36).substring(2, 9),
    name: siteName,
    genre: genreId,
    theme: {
      primaryColor: variation.primaryColor,
      accentColor: variation.accentColor,
      fontFamily: variation.fontFamily,
      radius: 'md'
    },
    pages,
    background: {
      type: variation.bgPresetId ? 'video' : 'template_default',
      preset_id: variation.bgPresetId || '',
      overlayOpacity: 20
    },
    images: [],
    updatedAt: new Date().toISOString()
  };
}
