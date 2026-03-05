// Shared photo store for the application

import { PhotoMetadata } from './types';

let currentPhotos: PhotoMetadata[] = [];
let currentFolderPath: string = '';

export function getPhotos() {
  return currentPhotos;
}

export function setPhotos(photos: PhotoMetadata[], folderPath: string) {
  currentPhotos = photos;
  currentFolderPath = folderPath;
}

export function getPhotoByIndex(index: number): PhotoMetadata | null {
  if (index >= 0 && index < currentPhotos.length) {
    return currentPhotos[index];
  }
  return null;
}

export function getFolderPath() {
  return currentFolderPath;
}
