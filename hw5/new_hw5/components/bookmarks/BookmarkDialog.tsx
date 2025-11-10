"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Folder, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DEFAULT_FOLDER_KEY = "default";

interface BookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  onSuccess?: (selectedFolders: string[]) => void;
}

export default function BookmarkDialog({
  open,
  onOpenChange,
  postId,
  onSuccess,
}: BookmarkDialogProps) {
  const { t } = useLanguage();
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const readyRef = useRef(false);

  useEffect(() => {
    if (open) {
      fetchFolders();
      fetchSelectedFolders();
      readyRef.current = false;
    }
  }, [open]);

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        // 獲取所有唯一的資料夾名稱
        const uniqueFolders = Array.from(
          new Set((data.bookmarks || []).map((b: any) => b.folderName || DEFAULT_FOLDER_KEY))
        ) as string[];
        const normalized = uniqueFolders.map((folder) =>
          folder === "已收藏的文章" ? DEFAULT_FOLDER_KEY : folder
        );
        setFolders(Array.from(new Set([DEFAULT_FOLDER_KEY, ...normalized])));
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const fetchSelectedFolders = async () => {
    try {
      const response = await fetch(`/api/bookmarks?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        const currentFolders = (data.folderNames || []) as string[];
        const normalized = currentFolders.length > 0 ? currentFolders : [DEFAULT_FOLDER_KEY];
        setSelectedFolders(normalized);
        readyRef.current = true;
      }
    } catch (error) {
      console.error("Error fetching bookmark state:", error);
    }
  };

  const toggleFolderSelection = (folderName: string) => {
    const normalized = folderName === "已收藏的文章" ? DEFAULT_FOLDER_KEY : folderName;
    setSelectedFolders((prev) => {
      const exists = prev.includes(normalized);
      if (exists) {
        return prev.filter((folder) => folder !== normalized);
      }
      return [...prev, normalized];
    });
  };

  const handleSaveSelection = async (foldersToSave: string[], shouldClose: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          folderNames: foldersToSave,
        }),
      });

      if (response.ok) {
        onSuccess?.(foldersToSave);
        if (shouldClose) {
          onOpenChange(false);
        }
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    const normalized = trimmed === "已收藏的文章" ? DEFAULT_FOLDER_KEY : trimmed;
    setFolders((prev) => Array.from(new Set([...prev, normalized])));
    setSelectedFolders((prev) => Array.from(new Set([...prev, normalized])));
    setNewFolderName("");
    setShowNewFolderInput(false);
  };

  const displayedFolders = useMemo(() => {
    const folderSet = new Set([DEFAULT_FOLDER_KEY, ...folders]);
    return Array.from(folderSet);
  }, [folders]);

  useEffect(() => {
    if (!readyRef.current) return;
    handleSaveSelection(selectedFolders, false);
  }, [selectedFolders]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("bookmarks.dialogTitle")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {displayedFolders.map((folder) => {
              const isSelected = selectedFolders.includes(folder);
              const label = folder === DEFAULT_FOLDER_KEY ? t("bookmarks.defaultFolder") : folder;
              return (
                <Button
                  key={folder}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => toggleFolderSelection(folder)}
                  disabled={loading}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">{label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </Button>
              );
            })}
          </div>

          {showNewFolderInput ? (
            <div className="flex space-x-2">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={t("bookmarks.folderNamePlaceholder")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
                disabled={loading}
              />
              <Button onClick={handleCreateFolder} disabled={loading || !newFolderName.trim()}>
                {t("common.create")}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowNewFolderInput(true)}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("bookmarks.newFolder")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


