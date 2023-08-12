import { Howl } from 'howler';

export const autoplay = (i, tracks) => {
    const sound = new Howl({
        src: [tracks[i]],
        preload: true,
        onend: function () {
            if (i + 1 === tracks.length) {
                return;
            } else {
                autoplay(i + 1, tracks);
            }
        }
    });
    sound.play();
};