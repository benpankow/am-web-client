import MusicKit from './musickitService';

export function playMedia(item) {
  let music = MusicKit.getInstance();

  const params = item.attributes.playParams;
  music.setQueue({
    [params.kind]: params.id
  }).then(queue => {
    music.play();
  }, err => {});
}
