# Google Drive Gallery

A simple, responsive gallery that reads images from a public Google Drive folder.

It is designed for:

- GitHub hosting for the source code
- Vercel deployment
- A public Google Drive folder as the image source
- No front-end framework
- A serverless API route that keeps the Google API key out of browser code

## 1. Prepare the Google Drive folder

1. Create a folder in Google Drive.
2. Add your images.
3. Open the folder's sharing settings.
4. Set **General access** to **Anyone with the link** and **Viewer**.
5. Copy the folder ID from its URL.

Example:

```text
https://drive.google.com/drive/folders/YOUR_FOLDER_ID
```

The part after `/folders/` is the folder ID.

Important: the individual images must inherit public access from the folder. If an image was uploaded with restricted permissions, verify its sharing access.

## 2. Create a Google Drive API key

1. Open Google Cloud Console.
2. Create or select a project.
3. Enable the **Google Drive API**.
4. Open **APIs & Services → Credentials**.
5. Create an **API key**.
6. Restrict the key to the Google Drive API.

The API key is used only by the Vercel serverless function.

## 3. Put the project on GitHub

Create a new GitHub repository, then add these files and push them:

```bash
git init
git add .
git commit -m "Add Google Drive gallery"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## 4. Deploy on Vercel

1. Import the GitHub repository into Vercel.
2. In the Vercel project, open **Settings → Environment Variables**.
3. Add:

```text
GOOGLE_DRIVE_API_KEY=your_google_api_key
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

4. Apply both variables to Production, Preview, and Development as needed.
5. Redeploy the project.

Vercel will serve the static files and automatically deploy `api/images.js` as a serverless function.

## Local development

Install the Vercel CLI:

```bash
npm install -g vercel
```

Create a `.env.local` file:

```text
GOOGLE_DRIVE_API_KEY=your_google_api_key
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

Then run:

```bash
vercel dev
```

Open the local URL shown by the CLI.

Do not commit `.env.local`.

## Customization

- Change the title and introduction in `index.html`.
- Change layout and typography in `styles.css`.
- Change `w1600` in `api/images.js` to control thumbnail resolution.
- Change `orderBy` in `api/images.js` to alter image ordering.
- Replace the masonry columns with CSS Grid if you want equal-sized cards.

## Notes

Google Drive is convenient for a small personal gallery, but it is not a dedicated image CDN. For a high-traffic or commercial site, consider Cloudinary, ImageKit, Vercel Blob, or another image-hosting service.
