export function getMimeType(file: File): string {
  // ファイルタイプが設定されている場合はそれを使用
  if (file.type && file.type !== "") {
    return file.type;
  }

  // 拡張子から推定
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
    return "image/jpeg";
  } else if (fileName.endsWith(".png")) {
    return "image/png";
  } else if (fileName.endsWith(".pdf")) {
    return "application/pdf";
  } else {
    return "application/octet-stream";
  }
}

export async function fileToBase64(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
