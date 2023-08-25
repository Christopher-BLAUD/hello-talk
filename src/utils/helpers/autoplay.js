import { Howl } from 'howler';

/**
 * Play single or multiples audio tracks
 * @param {number} index
 * @param {[]} tracks
 */
export const autoplay = (index, tracks) => {
    if (typeof tracks[index] === 'object') tracks[index] = URL.createObjectURL(tracks[index]);
    
    const sound = new Howl({
        src: [tracks[index]],
        preload: true,
        format: 'mp3',
        onend: function () {
            if (index + 1 === tracks.length) {
                return;
            } else {
                autoplay(index + 1, tracks);
            }
        }
    });

    sound.play();
};
