import { Howl } from 'howler';

export const autoplay = (i, tracks) => {
    if (typeof tracks[i] === 'object') tracks[i] = URL.createObjectURL(tracks[i]);
    const sound = new Howl({
        src: [tracks[i]],
        preload: true,
        format: 'mp3',
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
