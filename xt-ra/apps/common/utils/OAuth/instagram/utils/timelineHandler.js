export async function getTimeLinePhotosCount() {
  return this.getAllImageCount();
}

export async function getTimeLinePhotos({ callback }) {
  return this.getAllImages({callback});
}