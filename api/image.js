module.exports = async function handler(request, response) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const fileId = request.query.id;

  if (!apiKey) {
    return response.status(500).json({
      error: "Missing GOOGLE_DRIVE_API_KEY.",
    });
  }

  if (!fileId) {
    return response.status(400).json({
      error: "Missing image ID.",
    });
  }

  const driveUrl =
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}` +
    `?alt=media&key=${encodeURIComponent(apiKey)}`;

  try {
    const driveResponse = await fetch(driveUrl);

    if (!driveResponse.ok) {
      const errorText = await driveResponse.text();
      console.error("Google Drive image error:", errorText);

      return response.status(driveResponse.status).json({
        error: "Google Drive could not return this image.",
      });
    }

    const contentType =
      driveResponse.headers.get("content-type") || "image/jpeg";

    const imageBuffer = Buffer.from(await driveResponse.arrayBuffer());

    response.setHeader("Content-Type", contentType);
    response.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );

    return response.status(200).send(imageBuffer);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      error: "The server could not retrieve the image.",
    });
  }
};
