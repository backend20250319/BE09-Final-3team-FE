import api from "@/api/api";

// API 호출 함수들
export async function getCommentStats(instagram_id = null) {
  if (!instagram_id) {
    console.warn("instagram_id is required for getCommentStats");
    return null;
  }

  const params = { instagram_id: instagram_id };

  try {
    const response = await api.get("/sns-service/instagram/comments/status", {
      params,
    });

    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch comment stats:", error);
    return null;
  }
}

export async function getSentimentAnalysis(instagram_id) {
  if (!instagram_id) {
    console.warn("instagram_id is required for getSentimentAnalysis");
    return null;
  }

  try {
    const params = { instagram_id: instagram_id };
    const response = await api.get(
      "/sns-service/instagram/comments/sentiment-ratio",
      { params }
    );

    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch sentiment analysis:", error);
    return null;
  }
}

export async function getBannedWords(instagram_id) {
  if (!instagram_id) {
    console.warn("instagram_id is required for getBannedWords");
    return [];
  }

  try {
    const params = { instagram_id: instagram_id };
    const response = await api.get(
      "/sns-service/instagram/comments/banned-words",
      { params }
    );

    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch banned words:", error);
    return [];
  }
}

export async function getComments(
  instagram_id,
  page = 0,
  size = 20,
  isDeleted = null,
  sentiment = null,
  keyword = null,
  sortBy = "timestamp"
) {
  if (!instagram_id) {
    console.warn("instagram_id is required for getComments");
    return null;
  }

  try {
    const params = {
      instagram_id: instagram_id,
      page: page,
      size: size,
      sort: sortBy,
      ...(isDeleted !== null && { is_deleted: isDeleted }),
      ...(sentiment && { sentiment: sentiment }),
      ...(keyword && { keyword: keyword }),
    };

    const response = await api.get("/sns-service/instagram/comments/search", {
      params,
    });

    // API 응답 데이터를 그대로 반환
    if (response.data && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return null;
  }
}

export async function addBannedWord(instagram_id, word) {
  if (!instagram_id) {
    console.warn("instagram_id is required for addBannedWord");
    return { success: false, message: "instagram_id is required" };
  }

  try {
    const response = await api.post(
      "/sns-service/instagram/comments/banned-words",
      {
        instagram_id: instagram_id,
        word: word,
      }
    );

    if (response.data && response.data.code === "2000") {
      return { success: true, word };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to add banned word",
    };
  } catch (error) {
    console.error("Failed to add banned word:", error);
    return { success: false, message: "Failed to add banned word" };
  }
}

export async function removeBannedWord(instagram_id, word) {
  if (!instagram_id) {
    console.warn("instagram_id is required for removeBannedWord");
    return { success: false, message: "instagram_id is required" };
  }

  try {
    const params = { instagram_id: instagram_id, word: word };

    const response = await api.delete(
      "/sns-service/instagram/comments/banned-words",
      { params }
    );

    if (response.data && response.data.code === "2000") {
      return { success: true, word };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to remove banned word",
    };
  } catch (error) {
    console.error("Failed to remove banned word:", error);
    return { success: false, message: "Failed to remove banned word" };
  }
}

// 댓글 자동삭제 설정 함수
export async function updateAutoDeleteSetting(instagram_id, isAutoDelete) {
  if (!instagram_id) {
    console.warn("instagram_id is required for updateAutoDeleteSetting");
    return null;
  }

  try {
    const params = {
      instagram_id: instagram_id,
      is_auto_delete: isAutoDelete,
    };

    console.log;

    const response = await api.put(
      `/sns-service/instagram/profiles/auto-delete`,
      params
    );

    console.log("Auto delete setting updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update auto delete setting:", error);
    throw error;
  }
}

// 댓글 삭제 함수
export async function deleteComment(delete_id) {
  if (!delete_id) {
    console.warn("delete_id is required for deleteComment");
    return { success: false, message: "delete_id is required" };
  }

  try {
    const response = await api.delete(
      `/sns-service/instagram/comments/${delete_id}`
    );

    if (response.data && response.data.code === "2000") {
      return { success: true, message: "댓글이 삭제되었습니다." };
    }

    return {
      success: false,
      message: response.data?.message || "댓글 삭제에 실패했습니다.",
    };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, message: "댓글 삭제 중 오류가 발생했습니다." };
  }
}
