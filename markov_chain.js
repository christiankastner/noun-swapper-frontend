class MarkovChain {
    constructor(text) {
        const textArr = RiTa.tokenize(text)
        const markovChain = {};

        for (let i = 0; i < textArr.length; i++) {
            let word = textArr[i].toLowerCase()
            if (!markovChain[word]) {
              markovChain[word] = []
              }
            if (textArr[i + 1]) {
              markovChain[word].push(textArr[i + 1].toLowerCase());
            }
        }
        this.chain = markovChain
    }

    likelyhood(prev, word) {
        const prevArr = this.chain[prev.toLowerCase()]
        const num = prevArr.filter(w => w === word).length
        return `The likelihood that ${word} will come after ${prev} is ${num} out of ${prevArr.length}`
    }

    generateWord(prev) {
        if (this.chain[prev.toLowerCase()]) {
            const length = this.chain[prev].length
            const ranIndex = Math.floor(Math.random()*length)
            return this.chain[prev][ranIndex]
        } else {
            return false
        }
    }
}

const text = ``