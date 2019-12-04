class NounReplace {
    constructor() {

    }
    
    replaceNouns(string) {
        input = new RiString(string);
        const words = input.words();
        const speech = input.pos();
        let output = "";
        for (let i = 0; i < speech.length; i++) {
          if (/nn/.test(speech[i])) {
            output += RiTa.randomWord("nn") + " ";
          } else {
            output += words[i] + " ";
          }
        }
        return output;
    }
}