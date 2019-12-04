document.addEventListener('DOMContentLoaded', function() {
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
   const poemForm = document.createElement('form');
   const submitBtn = document.createElement('button');
   const pageContent = document.getElementById('pageContent');
   submitBtn.textContent = 'Submit';
   newPoem.textContent = 'Create Poem';
   pageContent.appendChild(newPoem);
   createInput('Title', poemForm, 'title');
   createInput('Content', poemForm, 'content');
   createInput('Username', poemForm, 'username');
   poemForm.appendChild(submitBtn);
   pageContent.appendChild(poemForm);
   poemForm.addEventListener('submit', event => {
      postPoem(event);
   });
}

function createInput(labelText, poemForm, id) {
   const input = document.createElement('input');
   const label = document.createElement('label');
   input.id = id;
   label.textContent = labelText;
   label.appendChild(input);
   poemForm.appendChild(label);
}

function postPoem(event) {
   const div = document.getElementById('poems_div');
   event.preventDefault();
   fetch('http://localhost:3000/poems', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify({
         title: event.target.title.value,
         content: event.target.content.value,
         modified_content: replaceNouns(event.target.content.value),
         username: event.target.username.value,
      }),
   })
      .then(res => res.json())
      .then(json => {
         console.log(json);
         appendPoem(json, div);
      });
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
