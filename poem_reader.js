class PoemReader {
   constructor() {}

   static readPoem(text) {
      const lines = text.split('\n');
      let audio = document.getElementById('start-bongos');
      const pause = (audio.duration - 1) * 1000;
      audio.play();
      let voice = document.getElementById('voicesDropdown').value;
      console.log(voice);
      PoemReader.readLines(lines, pause, voice);
   }

   static readLines(text, pause = 0, voice = 'US English Female') {
      if (text.length === 0) {
         return 0;
      }
      setTimeout(() => {
         responsiveVoice.speak(text[0], voice, {
            onend: () => {
               const ranNum = Math.ceil(Math.random() * 2);
               document.getElementById(`end-bongos-${ranNum}`).play();
               this.readLines(text.slice(1));
            },
         });
      }, pause);
   }
}
