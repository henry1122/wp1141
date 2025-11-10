/**
 * 驗證 UserID 格式
 * 規則：2-30 字元，英數字+底線+連字號
 */
export function validateUserID(userID: string): { valid: boolean; error?: string } {
  if (!userID || userID.trim().length === 0) {
    return { valid: false, error: "UserID 不能為空" };
  }

  if (userID.length < 2 || userID.length > 30) {
    return { valid: false, error: "UserID 長度必須在 2-30 字元之間" };
  }

  // 只允許英文字母、數字、底線、連字號
  const userIDRegex = /^[a-zA-Z0-9_-]+$/;
  if (!userIDRegex.test(userID)) {
    return { valid: false, error: "UserID 只能包含英文字母、數字、底線和連字號" };
  }

  return { valid: true };
}

