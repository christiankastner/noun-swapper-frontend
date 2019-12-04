document.addEventListener('DOMContentLoaded', function() {
   const div = createPoemsDiv();
   fetch('http://localhost:3000/poems')
      .then(res => res.json())
      .then(json => {
         for (let i = 0; i < json.length; i++) {
            appendPoem(json[i], div);
         }
      });
   const poemBtn = document.getElementById('createPoemBtn');
   poemBtn.addEventListener('click', createPoem);
   createDropDown();
});

function clearDOM() {
   const pageContent = document.getElementById('pageContent');
   while (pageContent.firstChild) {
      pageContent.removeChild(pageContent.firstChild);
   }
}

function createPoemsDiv() {
   let poemsDiv = document.createElement('div');
   poemsDiv.id = 'poemsDiv';
   return poemsDiv;
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
   const div = createPoemsDiv();
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
      .then(json => () => {
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
   let pageContent = document.getElementById('pageContent');
   pageContent.appendChild(node);
   const originalDiv = document.createElement('div');
   const modifiedDiv = document.createElement('div');
   let pOriginal = document.createElement('p');
   let pModified = document.createElement('p');
   pOriginal.textContent = json.content;
   pModified.textContent = json.modified_content;
   originalDiv.appendChild(pOriginal);
   modifiedDiv.appendChild(pModified);
   const readButton1 = createReadButton();
   const readButton2 = createReadButton();
   originalDiv.append(readButton1);
   modifiedDiv.append(readButton2);
   node.appendChild(originalDiv);
   node.appendChild(modifiedDiv);
}

function createReadButton() {
   const button = document.createElement('button');
   button.textContent = 'Read Me';
   button.addEventListener('click', event => {
      PoemReader.readPoem(event.target.parentNode.childNodes[0].textContent);
   });
   return button;
}

function createDropDown() {
   const dropdown = document.createElement('select');
   dropdown.id = 'voicesDropdown';
   let allVoices = responsiveVoice.getVoices();
   allVoices.forEach(voice => {
      let voiceOption = document.createElement('option');
      voiceOption.value = voice.name;
      voiceOption.textContent = voice.name;
      dropdown.appendChild(voiceOption);
   });
   document.getElementById('dropdownDiv').appendChild(dropdown);
}
