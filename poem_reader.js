class PoemReader {
   constructor() {}
   static readPoem(text, sound = true) {
      let voice = document.getElementById('voicesDropdown').value;
      if (sound === true) {
         const lines = PoemReader.splitLines(text);
         console.log(lines);
         let audio = document.getElementById('start-bongos');
         const pause = (audio.duration - 1) * 1000;
         audio.play();
         PoemReader.readLines(lines, pause, true, voice);
      } else {
         PoemReader.readLines([text], 0, sound, voice);
      }
   }

   static readLines(text, pause = 0, sound, voice = 'US English Female') {
      if (text.length === 0) {
         return 0;
      }
      const ranNum = Math.ceil(Math.random() * 2);
      let cubic;
         if (sound === true) {
             cubic = 0.04 * (text[0].split(' ').length - 3) ** 3 + 1;
         } else {
            cubic = 1;
         }
         
      PoemReader.interval = setTimeout(() => {
         responsiveVoice.speak(text[0], voice, {
            onend: () => {
               if (sound === true) {
                  document.getElementById(`end-bongos-${ranNum}`).play();
                  this.readLines(text.slice(1), 0, true, voice);
               }
            },
            rate: cubic,
         });
      }, pause);
   }

   static splitLines(string) {
      let rs = new RiString(RiTa.stripPunctuation(string));
      const words = rs.words();
      const lines = [];
      const length = rs.words().length;
      let i = 0;
      while (i < length) {
         const ranNum = Math.ceil(Math.random() * 4);
         lines.push(words.slice(i, i + ranNum).join(' '));
         i += ranNum;
      }
      return lines;
   }

   static killSound() {
      let audio = document.getElementById('start-bongos');
      audio.pause();
      audio.currentTime = 0;
      responsiveVoice.cancel();
      clearInterval(PoemReader.interval);
   }
}
