export type CloudProvider = "google" | "onedrive" | "dropbox";

export type PhotoItem = {
  id: string;
  provider: CloudProvider;
  cloudFileId: string;
  name: string;
  thumbnailUrl: string;
  previewUrl: string;
  width?: number;
  height?: number;
  takenAt?: string;
  labels?: string[];
};
