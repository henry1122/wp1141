import { IUser } from "@/lib/db/models/User";
import { IPost } from "@/lib/db/models/Post";
import { ILike } from "@/lib/db/models/Like";
import { IRepost } from "@/lib/db/models/Repost";
import { IFollow } from "@/lib/db/models/Follow";
import { IDraft } from "@/lib/db/models/Draft";
import { INotification } from "@/lib/db/models/Notification";
import { Types } from "mongoose";

export type { IUser, IPost, ILike, IRepost, IFollow, IDraft, INotification };

export interface UserWithStats extends IUser {
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface PostWithStats extends IPost {
  author?: IUser;
  likesCount?: number;
  repostsCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  isReposted?: boolean;
}
