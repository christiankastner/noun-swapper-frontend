class NounSwapper {
    constructor(themeNouns = []) {
        this.themeNouns = themeNouns
    }
    replaceNouns(string) {
        let input = new RiString(string);
        const words = input.words();
        const speech = input.pos();
        for (let i = 0; i < speech.length; i++) {
           if (/nn/.test(speech[i])) {
              input.replaceWord(i, this.generateNoun())
           } 
        }
        return input.text()
     }

    generateNoun() {
        if (this.themeNouns.length === 0) {
            return RiTa.randomWord("nn")
        } else {
            const ranNum = Math.floor(Math.random()*this.themeNouns.length)
            return this.themeNouns[ranNum]
        }
    }
}