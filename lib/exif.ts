import exifr from "exifr";

export async function readImageTakenAt(file: Blob) {
  try {
    const exif = await exifr.parse(file, ["DateTimeOriginal", "CreateDate"]);

    return (
      exif?.DateTimeOriginal?.toISOString?.() ??
      exif?.CreateDate?.toISOString?.() ??
      null
    );
  } catch {
    return null;
  }
}
