export function saveImage(imageStr: string, fileName: string) {
  const ele = document.createElement("a");
  ele.href = imageStr.replace("image/png", "application/octet-stream");
  ele.download = fileName;
  document.body.appendChild(ele);
  ele.click();
  ele.remove();
}

export function takePhoto(video) {
  // const settings = stream.getVideoTracks()[0].getSettings();

  const snapshotDisplay = document.createElement("canvas");
  snapshotDisplay.width = video.videoWidth;
  snapshotDisplay.height = video.videoHeight;

  const ctx = snapshotDisplay.getContext("2d");

  ctx.drawImage(video, 0, 0, snapshotDisplay.width, snapshotDisplay.height);

  const data = snapshotDisplay.toDataURL("image/png");
  return data;
}
