class NounSwapper {
    constructor(themeNouns = []) {

    }
    replaceNouns(string) {
        input = new RiString(string);
        const words = input.words();
        const speech = input.pos();
        for (let i = 0; i < speech.length; i++) {
           if (/nn/.test(speech[i])) {
              input.replaceWord(i, )
           } else {
              output += words[i] + ' ';
           }
        }
        return
     }

    generateNoun() {
        
    }
}