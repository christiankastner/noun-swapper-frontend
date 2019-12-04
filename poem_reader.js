class PoemReader {
    constructor(){
    }

    static readPoem(text, sound = true, ) {
        const lines = PoemReader.splitLines(text)

        let audio = document.getElementById("start-bongos")
        const pause = (audio.duration - 1)*1000
        audio.play()
        audio.onend = PoemReader.readLines(lines, pause)
    }

    static readLines(text, pause = 0, sound = true) {
        if (text.length === 0){
            return 0
        }
        const cubic = 0.03*(text[0].split(" ").length - 3)**3 + 1
        PoemReader.interval = setTimeout(() => {
            responsiveVoice.speak(text[0], "US English Female", {onend: () => {
                const ranNum = Math.ceil(Math.random() * 2)
                document.getElementById(`end-bongos-${ranNum}`).play();
                this.readLines(text.slice(1))
            }, rate: cubic})
        }, pause);
    }

    static splitLines(string) {
        let rs = new RiString(RiTa.stripPunctuation(string))
        const words = rs.words()
        const lines = []
        const length = rs.words().length
        let i = 0;
        while (i < length) {
            const ranNum = Math.ceil(Math.random() * 4)
            lines.push(words.slice(i, i + ranNum).join(" "))
            i += ranNum
        }
        return lines
    }

    static killSound() {
        let audio = document.getElementById("start-bongos")
        audio.pause()
        audio.currentTime = 0;
        responsiveVoice.cancel();
        clearInterval(PoemReader.interval)
    }
}