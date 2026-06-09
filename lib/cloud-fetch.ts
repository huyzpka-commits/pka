import type { PhotoItem } from "@/types/photo";

type FetchResult = {
  photos: PhotoItem[];
  nextCursor: string | null;
  error?: string;
};

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/tiff",
]);

function isImage(mimeType: string | undefined | null): boolean {
  return !!mimeType && IMAGE_MIME_TYPES.has(mimeType.toLowerCase());
}

function parseExifDate(raw: string | undefined): string | undefined {
  if (!raw) return undefined;

  const match = raw.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    const [, y, mo, d, h, mi, s] = match;
    return new Date(
      Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
    ).toISOString();
  }

  try {
    const iso = new Date(raw).toISOString();
    return iso;
  } catch {
    return undefined;
  }
}

export async function fetchGoogleDrive(
  accessToken: string,
  pageToken?: string
): Promise<FetchResult> {
  const params = new URLSearchParams({
    q: "mimeType contains 'image/' and trashed = false",
    fields:
      "nextPageToken,files(id,name,mimeType,thumbnailLink,createdTime,imageMediaMetadata)",
    pageSize: "50",
    orderBy: "createdTime desc",
    ...(pageToken ? { pageToken } : {}),
  });

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const err = await res.text();
    return { photos: [], nextCursor: null, error: `Google Drive API lỗi (${res.status})` };
  }

  const data = await res.json();
  const files: any[] = data.files ?? [];

  const photos: PhotoItem[] = files
    .filter((f: any) => isImage(f.mimeType))
    .map((f: any) => ({
      id: `google-${f.id}`,
      provider: "google" as const,
      cloudFileId: f.id,
      name: f.name,
      thumbnailUrl:
        f.thumbnailLink ??
        `https://drive.google.com/thumbnail?id=${f.id}&sz=w400`,
      previewUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`,
      width: f.imageMediaMetadata?.width,
      height: f.imageMediaMetadata?.height,
      takenAt: parseExifDate(f.imageMediaMetadata?.date) ?? f.createdTime ?? undefined,
      labels: undefined,
    }));

  return { photos, nextCursor: data.nextPageToken ?? null };
}

export async function fetchOneDrive(
  accessToken: string,
  skipToken?: string
): Promise<FetchResult> {
  const url = skipToken
    ? skipToken
    : "https://graph.microsoft.com/v1.0/me/drive/root/children?filter=file/photo ne null&$top=50&$orderby=lastModifiedDateTime desc&$select=id,name,file,lastModifiedDateTime,photo,thumbnails";

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.text();
    return { photos: [], nextCursor: null, error: "OneDrive API lỗi" };
  }

  const data = await res.json();
  const items: any[] = data.value ?? [];

  const photos: PhotoItem[] = items
    .filter((item: any) => isImage(item.file?.mimeType))
    .map((item: any) => {
      const thumb = item.thumbnails?.[0];
      return {
        id: `onedrive-${item.id}`,
        provider: "onedrive" as const,
        cloudFileId: item.id,
        name: item.name,
        thumbnailUrl:
          thumb?.small?.url ??
          `https://graph.microsoft.com/v1.0/me/drive/items/${item.id}/thumbnails/0/small/content`,
        previewUrl:
          thumb?.large?.url ??
          `https://graph.microsoft.com/v1.0/me/drive/items/${item.id}/thumbnails/0/large/content`,
        width: item.photo?.width,
        height: item.photo?.height,
        takenAt: item.photo?.takenDateTime ?? item.lastModifiedDateTime,
        labels: undefined,
      };
    });

  const nextCursor = data["@odata.nextLink"] ?? null;

  return { photos, nextCursor };
}

export async function fetchDropbox(
  accessToken: string,
  cursor?: string
): Promise<FetchResult> {
  const body = cursor
    ? { cursor }
    : {
        path: "",
        recursive: true,
        include_media_info: true,
        limit: 50,
      };

  const endpoint = cursor
    ? "https://api.dropboxapi.com/2/files/list_folder/continue"
    : "https://api.dropboxapi.com/2/files/list_folder";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { photos: [], nextCursor: null, error: "Dropbox API lỗi" };
  }

  const data = await res.json();
  const entries: any[] = data.entries ?? [];

  const photos: PhotoItem[] = entries
    .filter((e: any) => e[".tag"] === "file" && isImage(e.content_type))
    .map((e: any) => {
      const md = e.media_info?.metadata ?? {};
      return {
        id: `dropbox-${e.id}`,
        provider: "dropbox" as const,
        cloudFileId: e.id,
        name: e.name,
        thumbnailUrl: `https://content.dropboxapi.com/2/files/get_thumbnail_v2`,
        previewUrl: `https://content.dropboxapi.com/2/files/download`,
        width: md.dimensions?.width,
        height: md.dimensions?.height,
        takenAt: md.time_taken ?? e.client_modified,
        labels: undefined,
      };
    });

  return { photos, nextCursor: data.has_more ? data.cursor : null };
}

export async function fetchCloudPhotos(
  provider: string,
  accessToken: string,
  cursor?: string
): Promise<FetchResult> {
  switch (provider) {
    case "google":
      return fetchGoogleDrive(accessToken, cursor);
    case "azure-ad":
      return fetchOneDrive(accessToken, cursor);
    case "dropbox":
      return fetchDropbox(accessToken, cursor);
    default:
      return { photos: [], nextCursor: null };
  }
}
