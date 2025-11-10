"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import PostForm from "./PostForm";

interface Draft {
  _id: string;
  content: string;
  savedAt: string;
}

export default function DraftList() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [postFormOpen, setPostFormOpen] = useState(false);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await fetch("/api/posts/drafts");
      const data = await response.json();
      if (response.ok) {
        setDrafts(data.drafts || []);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (draftId: string) => {
    if (!confirm("確定要刪除此草稿嗎？")) return;

    try {
      const response = await fetch(`/api/posts/drafts/${draftId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDrafts();
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  };

  const handleEdit = (draft: Draft) => {
    setEditingDraft(draft);
    setPostFormOpen(true);
  };

  const handlePostSuccess = async () => {
    if (editingDraft) {
      // 刪除已發布的草稿
      await fetch(`/api/posts/drafts/${editingDraft._id}`, {
        method: "DELETE",
      });
      setEditingDraft(null);
    }
    setPostFormOpen(false);
    fetchDrafts();
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (drafts.length === 0) {
    return <div className="text-gray-500">尚無草稿</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {drafts.map((draft) => (
          <div key={draft._id} className="border rounded-lg p-4">
            <p className="whitespace-pre-wrap mb-4">{draft.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {new Date(draft.savedAt).toLocaleString("zh-TW")}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(draft)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  編輯此草稿
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(draft._id)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingDraft && (
        <PostForm
          open={postFormOpen}
          onOpenChange={setPostFormOpen}
          onSuccess={handlePostSuccess}
          initialContent={editingDraft.content}
        />
      )}
    </>
  );
}

