const gallery = document.querySelector("#gallery");
const statusElement = document.querySelector("#status");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeLightboxButton = document.querySelector("#close-lightbox");

function openLightbox(image) {
  lightboxImage.src = image.url;
  lightboxImage.alt = image.name;
  lightboxCaption.textContent = image.name;
  lightbox.showModal();
}

function makeGalleryItem(image) {
  const button = document.createElement("button");
  button.className = "gallery-item";
  button.type = "button";
  button.setAttribute("aria-label", `Open ${image.name}`);

  const img = document.createElement("img");
  img.src = image.thumbnailUrl;
  img.alt = image.name;
  img.loading = "lazy";
  img.decoding = "async";

  const caption = document.createElement("span");
  caption.className = "caption";
  caption.textContent = image.name;

  button.append(img, caption);
  button.addEventListener("click", () => openLightbox(image));

  return button;
}

async function loadGallery() {
  try {
    const response = await fetch("/api/images");

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Could not load the gallery.");
    }

    const images = await response.json();

    if (!Array.isArray(images) || images.length === 0) {
      statusElement.textContent = "No images were found in the folder.";
      return;
    }

    const fragment = document.createDocumentFragment();
    images.forEach((image) => fragment.appendChild(makeGalleryItem(image)));

    gallery.appendChild(fragment);
    statusElement.remove();
  } catch (error) {
    console.error(error);
    statusElement.textContent = error.message;
    statusElement.classList.add("error");
  }
}

closeLightboxButton.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

loadGallery();
