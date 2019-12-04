class PoemReader {
    constructor(){
    }

    static readPoem(text) {
        const lines = text.split("\n")
        let audio = document.getElementById("start-bongos")
        const pause = (audio.duration - 1)*1000
        audio.play()
        PoemReader.readLines(lines, pause)
    }

    static readLines(text, pause = 0) {
        if (text.length === 0){
            return 0
        }
        setTimeout(() => {
            responsiveVoice.speak(text[0], "US English Female", {onend: () => {
                const ranNum = Math.ceil(Math.random() * 2)
                document.getElementById(`end-bongos-${ranNum}`).play();
                this.readLines(text.slice(1))
            }})
        }, pause);
    }
}