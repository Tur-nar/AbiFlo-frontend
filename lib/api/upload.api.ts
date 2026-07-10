import { api } from "./client";

export const UploadAvatarApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<any, { data: { url: string } }>("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};
