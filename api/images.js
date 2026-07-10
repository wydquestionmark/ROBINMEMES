const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";

module.exports = async function handler(request, response) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!apiKey || !folderId) {
    return response.status(500).json({
      error:
        "Missing GOOGLE_DRIVE_API_KEY or GOOGLE_DRIVE_FOLDER_ID environment variable.",
    });
  }

  const query = `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`;

  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    fields: "files(id,name,mimeType,createdTime,modifiedTime)",
    orderBy: "createdTime desc",
    pageSize: "1000",
  });

  try {
    const driveResponse = await fetch(`${DRIVE_API_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await driveResponse.json();

    if (!driveResponse.ok) {
      console.error("Google Drive API error:", data);
      return response.status(driveResponse.status).json({
        error:
          data?.error?.message ||
          "Google Drive rejected the request. Check the folder permissions, folder ID, and API key.",
      });
    }

    const images = (data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,

      // High-resolution image URL.
      url: `https://drive.google.com/uc?export=view&id=${file.id}`,

      // Google-hosted thumbnail. Change w1600 to a smaller/larger value as needed.
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`,
    }));

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600"
    );

    return response.status(200).json(images);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      error: "The server could not contact Google Drive.",
    });
  }
};
