type BaseTranslation = {
  languageName: string;
  languageSwitcher: {
    title: string;
  };
  common: {
    loading: string;
    cancel: string;
    save: string;
    create: string;
    delete: string;
    confirm: string;
    defaultBookmarkFolder: string;
    maxImagesWarning: string;
  };
  nav: {
    home: string;
    profile: string;
    bookmarks: string;
    notifications: string;
    messages: string;
    post: string;
    logout: string;
  };
  postCard: {
    confirmDelete: string;
    repostedBy: string;
    topCommentTitle: string;
    likes: string;
    noCommentContent: string;
    deletedUser: string;
  };
  bookmarks: {
    dialogTitle: string;
    newFolder: string;
    folderNamePlaceholder: string;
    loading: string;
    emptyTitle: string;
    emptySubtitle: string;
    all: string;
    removing: string;
    cancelBookmark: string;
    removeFromFolder: string;
    defaultFolder: string;
  };
  comments: {
    dialogTitle: string;
    placeholder: string;
    replyButton: string;
    posting: string;
    none: string;
  };
  postDetail: {
    notFound: string;
    noComments: string;
  };
  postList: {
    noPosts: string;
  };
  repost: {
    title: string;
    addThoughts: string;
    addImages: string;
    originalPreview: string;
    reposting: string;
    confirm: string;
  };
  postForm: {
    title: string;
    placeholder: string;
    addImages: string;
    saveDraft: string;
    posting: string;
    postButton: string;
    discardTitle: string;
    discardMessage: string;
    discard: string;
    viewDrafts: string;
  };
  profile: {
    editTitle: string;
    editDescription: string;
    backgroundLabel: string;
    uploadBackground: string;
    avatarLabel: string;
    chooseImage: string;
    bioLabel: string;
    bioPlaceholder: string;
    cancel: string;
    save: string;
    saving: string;
    posts: string;
    followers: string;
    following: string;
    follow: string;
    followingAction: string;
    message: string;
    userIdUnset: string;
  };
  rightSidebar: {
    suggestedTitle: string;
    follow: string;
    following: string;
    trendingTitle: string;
    trendingTag: string;
    showMore: string;
  };
  bookmarkPage: {
    title: string;
    subtitle: string;
  };
  notificationsPage: {
    title: string;
  };
};

export const translations = {
  zh: {
    languageName: "中文",
    languageSwitcher: {
      title: "選擇語言",
    },
    common: {
      loading: "載入中...",
      cancel: "取消",
      save: "儲存",
      create: "建立",
      delete: "刪除",
      confirm: "確認",
      defaultBookmarkFolder: "已收藏的文章",
      maxImagesWarning: "最多只能上傳 10 張圖片",
    },
    nav: {
      home: "首頁",
      profile: "個人資料",
      bookmarks: "收藏",
      notifications: "通知",
      messages: "訊息",
      post: "發文",
      logout: "登出",
    },
    postCard: {
      confirmDelete: "確定要刪除此文章嗎？",
      repostedBy: "{name} 轉發了",
      topCommentTitle: "熱門留言",
      likes: "{count} 個讚",
      noCommentContent: "（無內容）",
      deletedUser: "已刪除的使用者",
    },
    bookmarks: {
      dialogTitle: "收藏到資料夾",
      newFolder: "新增資料夾",
      folderNamePlaceholder: "資料夾名稱",
      loading: "載入收藏中...",
      emptyTitle: "尚未收藏任何貼文",
      emptySubtitle: "在貼文卡片按下收藏圖示，就能在這裡快速找到它們！",
      all: "全部收藏",
      removing: "移除中...",
      cancelBookmark: "取消收藏",
      removeFromFolder: "從 {folder} 移除",
      defaultFolder: "已收藏的文章",
    },
    comments: {
      dialogTitle: "留言",
      placeholder: "回覆...",
      replyButton: "回覆",
      posting: "發表中...",
      none: "尚無留言",
    },
    postDetail: {
      notFound: "文章不存在",
      noComments: "尚無評論",
    },
    postList: {
      noPosts: "尚無文章",
    },
    repost: {
      title: "轉發",
      addThoughts: "添加你的想法（可選）...",
      addImages: "新增圖片",
      originalPreview: "原始貼文預覽",
      reposting: "轉發中...",
      confirm: "立即轉發",
    },
    postForm: {
      title: "發表文章",
      placeholder: "有什麼新鮮事？",
      addImages: "新增圖片",
      saveDraft: "儲存草稿",
      posting: "發表中...",
      postButton: "Post",
      discardTitle: "放棄發文？",
      discardMessage: "你確定要放棄這篇文章嗎？你可以選擇儲存為草稿或直接放棄。",
      discard: "放棄",
      viewDrafts: "查看草稿",
    },
    profile: {
      editTitle: "編輯個人資料",
      editDescription: "更新你的個人資訊",
      backgroundLabel: "背景圖",
      uploadBackground: "上傳背景圖",
      avatarLabel: "頭像",
      chooseImage: "選擇圖片",
      bioLabel: "簡介",
      bioPlaceholder: "介紹一下你自己...",
      cancel: "取消",
      save: "儲存",
      saving: "儲存中...",
      posts: "貼文",
      followers: "追蹤者",
      following: "追蹤中",
      follow: "追蹤",
      followingAction: "已追蹤",
      message: "訊息",
      userIdUnset: "未設定 UserID",
    },
    rightSidebar: {
      suggestedTitle: "你可能會認識",
      follow: "追蹤",
      following: "已追蹤",
      trendingTitle: "有什麼新鮮事",
      trendingTag: "流行趨勢",
      showMore: "顯示更多",
    },
    bookmarkPage: {
      title: "收藏",
      subtitle: "整理你喜歡的貼文，隨時回來再看一次。",
    },
    notificationsPage: {
      title: "通知",
    },
  } satisfies BaseTranslation,
  en: {
    languageName: "English",
    languageSwitcher: {
      title: "Choose language",
    },
    common: {
      loading: "Loading...",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
      delete: "Delete",
      confirm: "Confirm",
      defaultBookmarkFolder: "Saved posts",
      maxImagesWarning: "You can upload up to 10 images only",
    },
    nav: {
      home: "Home",
      profile: "Profile",
      bookmarks: "Bookmarks",
      notifications: "Notifications",
      messages: "Messages",
      post: "Post",
      logout: "Logout",
    },
    postCard: {
      confirmDelete: "Are you sure you want to delete this post?",
      repostedBy: "{name} reposted",
      topCommentTitle: "Top comment",
      likes: "{count} likes",
      noCommentContent: "(no content)",
      deletedUser: "Deleted user",
    },
    bookmarks: {
      dialogTitle: "Save to folder",
      newFolder: "New folder",
      folderNamePlaceholder: "Folder name",
      loading: "Loading bookmarks...",
      emptyTitle: "No posts saved yet",
      emptySubtitle: "Tap the bookmark icon on any post to find it here later!",
      all: "All bookmarks",
      removing: "Removing...",
      cancelBookmark: "Remove bookmark",
      removeFromFolder: "Remove from {folder}",
      defaultFolder: "Saved posts",
    },
    comments: {
      dialogTitle: "Comments",
      placeholder: "Write a reply...",
      replyButton: "Reply",
      posting: "Posting...",
      none: "No comments yet",
    },
    postDetail: {
      notFound: "Post not found",
      noComments: "No comments yet",
    },
    postList: {
      noPosts: "No posts yet",
    },
    repost: {
      title: "Repost",
      addThoughts: "Add your thoughts (optional)...",
      addImages: "Add images",
      originalPreview: "Original post",
      reposting: "Reposting...",
      confirm: "Share now",
    },
    postForm: {
      title: "Create post",
      placeholder: "What's happening?",
      addImages: "Add images",
      saveDraft: "Save draft",
      posting: "Posting...",
      postButton: "Post",
      discardTitle: "Discard post?",
      discardMessage: "Are you sure you want to discard this post? You can save it as a draft or throw it away.",
      discard: "Discard",
      viewDrafts: "View drafts",
    },
    profile: {
      editTitle: "Edit profile",
      editDescription: "Update your personal information",
      backgroundLabel: "Cover photo",
      uploadBackground: "Upload cover",
      avatarLabel: "Avatar",
      chooseImage: "Choose image",
      bioLabel: "Bio",
      bioPlaceholder: "Tell the world who you are...",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      posts: "Posts",
      followers: "Followers",
      following: "Following",
      follow: "Follow",
      followingAction: "Following",
      message: "Message",
      userIdUnset: "User ID not set",
    },
    rightSidebar: {
      suggestedTitle: "Who to follow",
      follow: "Follow",
      following: "Following",
      trendingTitle: "Trends for you",
      trendingTag: "Trending",
      showMore: "Show more",
    },
    bookmarkPage: {
      title: "Bookmarks",
      subtitle: "Keep your favourite posts in one place and revisit them anytime.",
    },
    notificationsPage: {
      title: "Notifications",
    },
  } satisfies BaseTranslation,
  wenyan: {
    languageName: "文言文",
    languageSwitcher: {
      title: "擇其言",
    },
    common: {
      loading: "載入未畢...",
      cancel: "作罷",
      save: "存之",
      create: "新建",
      delete: "刪除",
      confirm: "允之",
      defaultBookmarkFolder: "所藏帖子",
      maxImagesWarning: "至多僅可上傳十圖",
    },
    nav: {
      home: "首頁",
      profile: "身世",
      bookmarks: "收藏",
      notifications: "告示",
      messages: "書簡",
      post: "發文",
      logout: "退席",
    },
    postCard: {
      confirmDelete: "誠欲刪除此文乎？",
      repostedBy: "{name} 轉發之",
      topCommentTitle: "上佳評論",
      likes: "{count} 人稱善",
      noCommentContent: "（無所述）",
      deletedUser: "隱姓之人",
    },
    bookmarks: {
      dialogTitle: "存入文夾",
      newFolder: "增建新夾",
      folderNamePlaceholder: "夾名",
      loading: "收藏搜尋中...",
      emptyTitle: "尚無所藏",
      emptySubtitle: "於帖子標記收藏，可隨時翻閱。",
      all: "所藏一覽",
      removing: "移除中...",
      cancelBookmark: "不復收藏",
      removeFromFolder: "自 {folder} 移出",
      defaultFolder: "所藏帖子",
    },
    comments: {
      dialogTitle: "評論",
      placeholder: "回覆數語...",
      replyButton: "回覆",
      posting: "張貼中...",
      none: "尚無評論",
    },
    postDetail: {
      notFound: "未覓此文",
      noComments: "尚無評論",
    },
    postList: {
      noPosts: "尚無帖子",
    },
    repost: {
      title: "轉述",
      addThoughts: "可附己見...",
      addImages: "添圖",
      originalPreview: "原帖",
      reposting: "轉述中...",
      confirm: "立即轉述",
    },
    postForm: {
      title: "發表新文",
      placeholder: "有何新事？",
      addImages: "添圖",
      saveDraft: "存為草稿",
      posting: "發表中...",
      postButton: "刊之",
      discardTitle: "棄文乎？",
      discardMessage: "確欲棄此文乎？可存草稿，亦可棄之。",
      discard: "棄文",
      viewDrafts: "草稿一覽",
    },
    profile: {
      editTitle: "修飾身世",
      editDescription: "更新己之資訊",
      backgroundLabel: "封面",
      uploadBackground: "上傳封面",
      avatarLabel: "像",
      chooseImage: "擇圖",
      bioLabel: "簡介",
      bioPlaceholder: "述己所得...",
      cancel: "作罷",
      save: "存之",
      saving: "存儲中...",
      posts: "帖子",
      followers: "追隨者",
      following: "所追",
      follow: "追隨",
      followingAction: "已追隨",
      message: "傳書",
      userIdUnset: "未定帳號",
    },
    rightSidebar: {
      suggestedTitle: "或可認識",
      follow: "追隨",
      following: "已追隨",
      trendingTitle: "世間熱議",
      trendingTag: "流行",
      showMore: "覽更多",
    },
    bookmarkPage: {
      title: "收藏",
      subtitle: "將好文整序收藏，隨時翻閱。",
    },
    notificationsPage: {
      title: "告示",
    },
  } satisfies BaseTranslation,
  zhuyin: {
    languageName: "注音文",
    languageSwitcher: {
      title: "ㄒㄩㄢˇ ㄗㄜˊ ㄩˇ ㄧㄢˊ",
    },
    common: {
      loading: "ㄗㄞˇ ㄖㄨˋ ㄓㄨㄥ...",
      cancel: "ㄑㄩˇ ㄒㄧㄠ",
      save: "ㄔㄨˇ ㄘㄨㄣˊ",
      create: "ㄒㄧㄣ ㄐㄧㄢˋ",
      delete: "ㄕㄢ ㄔㄨˊ",
      confirm: "ㄑㄩㄝˋ ㄉㄧㄥˋ",
      defaultBookmarkFolder: "ㄧˇ ㄕㄡ ㄘㄤˊ ㄉㄜ˙ ㄊㄧㄝ ㄨㄣˊ",
      maxImagesWarning: "ㄗˋ ㄉㄨㄛˋ ㄎㄜˇ ㄕㄤˋ ㄔㄨㄢˊ ㄕˊ ㄓㄤ ㄊㄨˊ",
    },
    nav: {
      home: "ㄕㄡˇ ㄧㄝˋ",
      profile: "ㄍㄜˋ ㄖㄣˊ ㄗㄨˇ ㄊㄠˋ",
      bookmarks: "ㄕㄡ ㄘㄤˊ",
      notifications: "ㄊㄨㄥ ㄓ",
      messages: "ㄒㄩㄣˋ ㄒㄧ",
      post: "ㄈㄚ ㄨㄣˊ",
      logout: "ㄊㄨㄛ ㄔㄨ",
    },
    postCard: {
      confirmDelete: "ㄑㄩㄝˋ ㄉㄧㄥˋ ㄧㄠˋ ㄕㄢ ㄔㄨˊ ㄍㄞˇ ㄊㄧㄝ ㄨㄣˊ ㄇㄚ˙？",
      repostedBy: "{name} ㄓㄨㄢˇ ㄈㄚ ㄌㄜ˙",
      topCommentTitle: "ㄖㄜˋ ㄇㄣˊ ㄌㄧㄡˊ ㄧㄢˊ",
      likes: "{count} ㄍㄜˋ ㄗㄢˋ",
      noCommentContent: "（ㄨˊ ㄋㄟˋ ㄖㄨㄥˊ）",
      deletedUser: "ㄧˇ ㄕㄠ ㄩㄩㄥˋ ㄓㄜˇ",
    },
    bookmarks: {
      dialogTitle: "ㄕㄡ ㄘㄤˊ ㄉㄠˋ ㄗㄌㄧㄠˋ ㄐㄧㄚˊ",
      newFolder: "ㄒㄧㄣ ㄗㄥ ㄗㄌㄧㄠˋ ㄐㄧㄚˊ",
      folderNamePlaceholder: "ㄗㄌㄧㄠˋ ㄐㄧㄚˊ ㄇㄧㄥˊ ㄔㄥ",
      loading: "ㄓㄥˋ ㄗㄞˋ ㄗㄞˇ ㄖㄨˋ ㄕㄡ ㄘㄤˊ...",
      emptyTitle: "ㄏㄞˊ ㄅㄡˊ ㄩㄡˇ ㄕㄡ ㄘㄤˊ",
      emptySubtitle: "ㄗㄞˋ ㄊㄧㄝ ㄨㄣˊ ㄉㄜ˙ ㄕㄡ ㄘㄤˊ ㄊㄨˊ ㄅㄧㄠ ㄕㄤ ㄉㄧㄢˇ ㄧˊ ㄒㄧㄚˋ ㄐㄧㄡˋ ㄏㄨㄟˋ ㄓㄞˋ ㄓㄜˋ ㄌㄧˇ ㄌㄜ˙！",
      all: "ㄙㄨㄛˇ ㄧㄡˇ ㄕㄡ ㄘㄤˊ",
      removing: "ㄧㄗˋ ㄧㄢˇ ㄔㄨˊ...",
      cancelBookmark: "ㄑㄩˇ ㄒㄧㄠ ㄕㄡ ㄘㄤˊ",
      removeFromFolder: "ㄘㄨㄥ {folder} ㄧㄢˇ ㄔㄨˊ",
      defaultFolder: "ㄧˇ ㄕㄡ ㄘㄤˊ ㄉㄜ˙ ㄊㄧㄝ ㄨㄣˊ",
    },
    comments: {
      dialogTitle: "ㄌㄧㄡˊ ㄧㄢˊ",
      placeholder: "ㄏㄨㄟˊ ㄈㄨˋ...",
      replyButton: "ㄏㄨㄟˊ ㄈㄨˋ",
      posting: "ㄓㄥˋ ㄗㄞˋ ㄈㄚ ㄅㄧㄠˇ...",
      none: "ㄊㄞˋ ㄟ˙，ㄒㄧㄢˋ ㄗㄞˋ ㄏㄞˊ ㄇㄟˊ ㄧㄡˇ ㄌㄧㄡˊ ㄧㄢˊ",
    },
    postDetail: {
      notFound: "ㄓㄠˇ ㄅㄨˋ ㄉㄠˇ ㄍㄞˇ ㄊㄧㄝ ㄨㄣˊ",
      noComments: "ㄏㄞˊ ㄅㄨˋ ㄉㄢ ㄌㄧㄡˊ ㄧㄢˊ",
    },
    postList: {
      noPosts: "ㄏㄞˊ ㄇㄟˊ ㄧㄡˇ ㄊㄧㄝ ㄨㄣˊ",
    },
    repost: {
      title: "ㄓㄨㄢˇ ㄈㄚ",
      addThoughts: "ㄊㄧㄢ ㄐㄧㄚ ㄋㄧˇ ㄉㄜ˙ ㄒㄧㄤˇ ㄈㄚˇ...",
      addImages: "ㄊㄧㄢ ㄊㄨˊ",
      originalPreview: "ㄩㄢˊ ㄊㄧㄝ ㄐㄩㄝˊ",
      reposting: "ㄓㄥˋ ㄗㄞˋ ㄓㄨㄢˇ ㄈㄚ...",
      confirm: "ㄍㄢˇ ㄎㄨㄞˋ ㄓㄨㄢˇ ㄈㄚ",
    },
    postForm: {
      title: "ㄈㄚ ㄅㄧㄠˇ ㄊㄧㄝ ㄨㄣˊ",
      placeholder: "ㄧㄡˇ ㄕㄜˊ ㄇㄜ˙ ㄒㄧㄣ ㄒㄧㄢ ㄕˋ？",
      addImages: "ㄊㄧㄢ ㄊㄨˊ",
      saveDraft: "ㄘㄨㄣˊ ㄘㄠˇ ㄍㄠˇ",
      posting: "ㄓㄥˋ ㄗㄞˋ ㄈㄚ ㄅㄧㄠˇ...",
      postButton: "Post",
      discardTitle: "ㄍㄢˋ ㄉㄧㄠˋ ㄓㄜˋ ㄆㄧㄢ ㄇㄚ˙？",
      discardMessage: "ㄑㄩㄝˋ ㄉㄧㄥˋ ㄧㄠˋ ㄈㄤˋ ㄑㄧˋ ㄍㄞˇ ㄊㄧㄝ ㄨㄣˊ ㄇㄚ˙？ ㄎㄜˇ ㄘㄨㄣˊ ㄨㄟˊ ㄘㄠˇ ㄍㄠˇ ㄏㄨㄛˋ ㄓˊ ㄐㄧㄝ ㄈㄤˋ ㄑㄧˋ。",
      discard: "ㄈㄤˋ ㄑㄧˋ",
      viewDrafts: "ㄎㄢ ㄘㄠˇ ㄍㄠˇ",
    },
    profile: {
      editTitle: "ㄅㄧㄢ ㄐㄧˊ ㄍㄜˋ ㄖㄣˊ ㄗㄌㄧㄠˋ",
      editDescription: "ㄍㄥ ㄒㄧㄣ ㄋㄧˇ ㄉㄜ˙ ㄗ ㄗˋ ㄒㄩㄣˋ",
      backgroundLabel: "ㄅㄟˋ ㄐㄧㄥˇ ㄊㄨˊ",
      uploadBackground: "ㄕㄤˋ ㄔㄨㄢˊ ㄅㄟˋ ㄐㄧㄥˇ",
      avatarLabel: "ㄊㄡˊ ㄒㄧㄤˋ",
      chooseImage: "ㄒㄩㄢˇ ㄊㄨˊ",
      bioLabel: "ㄐㄧㄢˇ ㄐㄧㄝˋ",
      bioPlaceholder: "ㄐㄧㄢˇ ㄉㄢˇ ㄗˋ ㄨˊ ㄉㄜ˙ ㄕㄥ ㄏㄨㄛˊ...",
      cancel: "ㄑㄩˇ ㄒㄧㄠ",
      save: "ㄔㄨˇ ㄘㄨㄣˊ",
      saving: "ㄓㄥˋ ㄗㄞˋ ㄘㄨˇ ㄘㄨㄣˊ...",
      posts: "ㄊㄧㄝ ㄨㄣˊ",
      followers: "ㄓㄨㄟ ㄗㄨㄥ ㄓㄜˇ",
      following: "ㄓㄨㄟ ㄗㄨㄥ ㄉㄨㄟˋ ㄒㄧㄤˋ",
      follow: "ㄓㄨㄟ ㄗㄨㄥ",
      followingAction: "ㄧˇ ㄓㄨㄟ ㄗㄨㄥ",
      message: "ㄒㄩㄣˋ ㄒㄧ",
      userIdUnset: "UserID ㄏㄞˊ ㄅㄨˋ ㄊㄧㄥˊ",
    },
    rightSidebar: {
      suggestedTitle: "ㄋㄧˇ ㄎㄜˇ ㄋㄥˊ ㄖㄣˋ ㄕˋ",
      follow: "ㄓㄨㄟ ㄗㄨㄥ",
      following: "ㄧˇ ㄓㄨㄟ ㄗㄨㄥ",
      trendingTitle: "ㄧㄡˇ ㄕㄜˊ ㄇㄜ˙ ㄒㄧㄣ ㄒㄧㄢ ㄕˋ",
      trendingTag: "ㄌㄧㄡˊ ㄒㄧㄥ ㄑㄩˇ",
      showMore: "ㄒㄧㄢˇ ㄕˋ ㄍㄥˋ ㄉㄨㄛ",
    },
    bookmarkPage: {
      title: "ㄕㄡ ㄘㄤˊ",
      subtitle: "ㄅㄡˋ ㄕㄡ ㄋㄧˇ ㄒㄧˇ ㄏㄨㄢ ㄉㄜ˙ ㄊㄧㄝ ㄨㄣˊ，ㄖㄢˊ ㄏㄡˋ ㄒㄧˋ ㄙ ㄎㄢ ㄧ ㄎㄢˋ。",
    },
    notificationsPage: {
      title: "ㄊㄨㄥ ㄓ",
    },
  } satisfies BaseTranslation,
  hunter: {
    languageName: "ハンター語",
    languageSwitcher: {
      title: "言語を選択",
    },
    common: {
      loading: "読み込み中...",
      cancel: "キャンセル",
      save: "保存",
      create: "作成",
      delete: "削除",
      confirm: "確認",
      defaultBookmarkFolder: "保存した投稿",
      maxImagesWarning: "画像は最大10枚までアップロードできます",
    },
    nav: {
      home: "ホーム",
      profile: "プロフィール",
      bookmarks: "ブックマーク",
      notifications: "通知",
      messages: "メッセージ",
      post: "投稿",
      logout: "ログアウト",
    },
    postCard: {
      confirmDelete: "この投稿を削除しますか？",
      repostedBy: "{name} がリポスト",
      topCommentTitle: "人気コメント",
      likes: "{count} 件のいいね",
      noCommentContent: "（内容なし）",
      deletedUser: "削除されたユーザー",
    },
    bookmarks: {
      dialogTitle: "フォルダに保存",
      newFolder: "新しいフォルダ",
      folderNamePlaceholder: "フォルダ名",
      loading: "ブックマークを読み込み中...",
      emptyTitle: "まだ保存した投稿がありません",
      emptySubtitle: "投稿のブックマークアイコンを押して、あとでここで見つけましょう！",
      all: "すべてのブックマーク",
      removing: "削除中...",
      cancelBookmark: "ブックマークを外す",
      removeFromFolder: "{folder} から削除",
      defaultFolder: "保存した投稿",
    },
    comments: {
      dialogTitle: "コメント",
      placeholder: "返信を書く...",
      replyButton: "返信",
      posting: "送信中...",
      none: "コメントはまだありません",
    },
    postDetail: {
      notFound: "投稿が見つかりません",
      noComments: "コメントはまだありません",
    },
    postList: {
      noPosts: "投稿がまだありません",
    },
    repost: {
      title: "リポスト",
      addThoughts: "感想を追加（任意）...",
      addImages: "画像を追加",
      originalPreview: "元の投稿",
      reposting: "リポスト中...",
      confirm: "今すぐ共有",
    },
    postForm: {
      title: "投稿を作成",
      placeholder: "今どうしてる？",
      addImages: "画像を追加",
      saveDraft: "下書きを保存",
      posting: "送信中...",
      postButton: "投稿",
      discardTitle: "投稿を破棄しますか？",
      discardMessage: "この投稿を破棄してよろしいですか？下書きに保存することもできます。",
      discard: "破棄",
      viewDrafts: "下書きを表示",
    },
    profile: {
      editTitle: "プロフィール編集",
      editDescription: "プロフィール情報を更新",
      backgroundLabel: "カバー画像",
      uploadBackground: "カバーをアップロード",
      avatarLabel: "アバター",
      chooseImage: "画像を選択",
      bioLabel: "自己紹介",
      bioPlaceholder: "あなたについて教えてください...",
      cancel: "キャンセル",
      save: "保存",
      saving: "保存中...",
      posts: "投稿",
      followers: "フォロワー",
      following: "フォロー中",
      follow: "フォロー",
      followingAction: "フォロー中",
      message: "メッセージ",
      userIdUnset: "ユーザーID未設定",
    },
    rightSidebar: {
      suggestedTitle: "おすすめユーザー",
      follow: "フォロー",
      following: "フォロー中",
      trendingTitle: "トレンド",
      trendingTag: "人気",
      showMore: "さらに表示",
    },
    bookmarkPage: {
      title: "ブックマーク",
      subtitle: "お気に入りの投稿をまとめて、いつでも読み返そう。",
    },
    notificationsPage: {
      title: "通知",
    },
  } satisfies BaseTranslation,
  jin: {
    languageName: "天津話",
    languageSwitcher: {
      title: "來選個話頭",
    },
    common: {
      loading: "正忙活呢...",
      cancel: "甭要了",
      save: "收著",
      create: "整一個",
      delete: "刪咯",
      confirm: "成",
      defaultBookmarkFolder: "攢下的帖子",
      maxImagesWarning: "一回最多就十張圖，別多了啊",
    },
    nav: {
      home: "門口",
      profile: "檔案",
      bookmarks: "收藏夾兒",
      notifications: "消息",
      messages: "私信",
      post: "發個帖",
      logout: "撤啦",
    },
    postCard: {
      confirmDelete: "這帖子真要刪啊？",
      repostedBy: "{name} 給轉了一下",
      topCommentTitle: "最熱評論",
      likes: "{count} 個贊",
      noCommentContent: "（沒說啥）",
      deletedUser: "人家走喽",
    },
    bookmarks: {
      dialogTitle: "收進夾子里",
      newFolder: "整個新夾",
      folderNamePlaceholder: "夾子叫啥",
      loading: "正給你翻收藏...",
      emptyTitle: "還沒收啥帖子呢",
      emptySubtitle: "看見喜歡的就點個書籤，回頭好找！",
      all: "全都瞅瞅",
      removing: "正挪走...",
      cancelBookmark: "別收藏了",
      removeFromFolder: "從 {folder} 裡邊拿走",
      defaultFolder: "攢下的帖子",
    },
    comments: {
      dialogTitle: "留言",
      placeholder: "說兩句...",
      replyButton: "回一句",
      posting: "發上去...",
      none: "還沒有留言呢",
    },
    postDetail: {
      notFound: "沒找著這帖子",
      noComments: "暫時沒人說話",
    },
    postList: {
      noPosts: "還沒什麼帖子",
    },
    repost: {
      title: "轉發一下",
      addThoughts: "想說點啥隨便添...",
      addImages: "加點圖",
      originalPreview: "原來那帖子",
      reposting: "正轉發著...",
      confirm: "趕緊轉",
    },
    postForm: {
      title: "發個帖子",
      placeholder: "最近咋樣？",
      addImages: "加個圖",
      saveDraft: "先攢着",
      posting: "發著呢...",
      postButton: "發出去",
      discardTitle: "這貼不要了？",
      discardMessage: "真要扔了啊？也能先攢成草稿，隨你。",
      discard: "扔了",
      viewDrafts: "看看草稿",
    },
    profile: {
      editTitle: "改改個人信息",
      editDescription: "更新點自己的情況",
      backgroundLabel: "背景圖",
      uploadBackground: "換個背景",
      avatarLabel: "頭像",
      chooseImage: "選張圖",
      bioLabel: "簡介",
      bioPlaceholder: "說兩句自己吧...",
      cancel: "甭要了",
      save: "存好了",
      saving: "正存著...",
      posts: "帖子",
      followers: "粉絲",
      following: "關注中",
      follow: "關注",
      followingAction: "已關注",
      message: "說句話",
      userIdUnset: "還沒起ID呢",
    },
    rightSidebar: {
      suggestedTitle: "認識認識",
      follow: "關注",
      following: "已關注",
      trendingTitle: "這會兒熱乎著",
      trendingTag: "熱點",
      showMore: "再瞅瞅",
    },
    bookmarkPage: {
      title: "收藏夾兒",
      subtitle: "喜歡的帖攢一塊兒，啥時候想看就回來翻。",
    },
    notificationsPage: {
      title: "消息",
    },
  } satisfies BaseTranslation,
} as const;

type NestedKeyOf<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${NestedKeyOf<T[K]>}`;
    }[keyof T & string];

export type Language = keyof typeof translations;
export type TranslationKey = NestedKeyOf<BaseTranslation>;

