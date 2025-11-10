"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface User {
  _id: string;
  name: string;
  userID: string;
  avatar?: string;
}

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userID: string;
  type: "followers" | "following";
}

export default function FollowersDialog({
  open,
  onOpenChange,
  userID,
  type,
}: FollowersDialogProps) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && userID) {
      fetchUsers();
    }
  }, [open, userID, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = type === "followers" ? "followers" : "following";
      const response = await fetch(`/api/users/${userID}/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(type === "followers" ? data.followers : data.following);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type === "followers" ? t("followers") : t("following")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">{t("loading")}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {type === "followers" ? t("noFollowers") : t("noFollowing")}
            </div>
          ) : (
            users.map((user) => (
              <Link
                key={user._id}
                href={`/profile/${user.userID}`}
                className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg"
              >
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.userID}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


