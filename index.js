document.addEventListener('DOMContentLoaded', function() {
   const POEMS_URL = 'http://localhost:3000/poems';
   const div = document.getElementById('poems_div');
   fetch('http://localhost:3000/poems')
      .then(res => res.json())
      .then(json => {
         for (let i = 0; i < json.length; i++) {
            appendPoem(json[i], div);
         }
      });
   const poemBtn = document.getElementById('createPoemBtn');
   poemBtn.addEventListener('click', createPoem);
});

function clearDOM() {
   const pageContent = document.getElementById('pageContent');
   while (pageContent.firstChild) {
      pageContent.removeChild(pageContent.firstChild);
   }
}

function createPoem() {
   clearDOM();
   const newPoem = document.createElement('h2');
   const pageContent = document.getElementById('pageContent');
   const poemForm = document.createElement('form');
   newPoem.textContent = 'Create Poem';
   pageContent.appendChild(newPoem);
   createInput('Title');
   createInput('Content');
   createInput('Username');
   poemForm.addEventListener('submit', event => {
      postPoem(event);
   });
}

function createInput(labelText) {
   const poemForm = document.createElement('form');
   const input = document.createElement('input');
   const label = document.createElement('label');
   const pageContent = document.getElementById('pageContent');
   label.textContent = labelText;
   label.appendChild(input);
   poemForm.appendChild(label);
   pageContent.appendChild(poemForm);
}

function postPoem(e) {
   event.preventDefault();
   fetch(POEMS_URL, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify({
         content: event.target[0].value,
         modified_content: replaceNouns(event.target[0].value),
      }),
   })
      .then(res => res.json())
      .then(json => {
         appendPoem(json, div);
      });
   let poemArea = document.getElementById('poem_area');
   poemArea.value = '';
}

function replaceNouns(string) {
   input = new RiString(string);
   const words = input.words();
   const speech = input.pos();
   let output = '';
   for (let i = 0; i < speech.length; i++) {
      if (/nn/.test(speech[i])) {
         output += RiTa.randomWord('nn') + ' ';
      } else {
         output += words[i] + ' ';
      }
   }
   return output;
}

function appendPoem(json, node) {
   let pOriginal = document.createElement('p');
   let pModified = document.createElement('p');
   pOriginal.textContent = json.content;
   pModified.textContent = json.modified_content;
   node.appendChild(pOriginal);
   node.appendChild(pModified);

   // document.querySelector('button').addEventListener('click', function() {
   //    // let voicelist = responsiveVoice.getVoices()
   //    //pick a random voice from voice list and then plug it into speak function
   //    responsiveVoice.speak('Hello Team!', 'UK English Male');
   // });
}
