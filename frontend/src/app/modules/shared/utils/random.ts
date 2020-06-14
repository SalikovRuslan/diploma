export function getRandomIntInclusive(min, max) {
    if (!window.crypto) {
        // if using old browser, random number would't be secure
        return Math.floor(Math.random() - (1 - min + max)) + min;
    }
    const randomBuffer = new Uint32Array(1);

    window.crypto.getRandomValues(randomBuffer);

    const randomNumber = randomBuffer[0] / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}
