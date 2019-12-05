document.addEventListener('DOMContentLoaded', function() {
   createDropDown();
   fetchPoems();
   const homeButton = document.getElementById('homeButton');
   homeButton.addEventListener('click', () => {
      clearDOM();
      fetchPoems();
   });
   const poemBtn = document.getElementById('createPoemBtn');
   poemBtn.addEventListener('click', createPoem);
});
const swapper = new NounSwapper

function fetchPoems() {
   const div = createPoemsDiv();
   fetch('http://localhost:3000/poems')
      .then(res => res.json())
      .then(json => {
         for (let i = 0; i < json.length; i++) {
            appendPoem(json[i], div);
         }
      });
}

function clearDOM() {
   const pageContent = getPageContentDiv();
   while (pageContent.firstChild) {
      pageContent.removeChild(pageContent.firstChild);
   }
}

function createPoemsDiv() {
   let poemsDiv = document.createElement('div');
   poemsDiv.id = 'poemsDiv';
   return poemsDiv;
}

function getPageContentDiv() {
   let pageContent = document.getElementById('pageContent');
   return pageContent;
}

function createPoem() {
   clearDOM();
   const newPoem = document.createElement('h2');
   const poemForm = document.createElement('form');
   const submitBtn = document.createElement('button');
   const pageContent = getPageContentDiv();
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
         modified_content: swapper.replaceNouns(event.target.content.value),
         username: event.target.username.value,
      }),
   })
      .then(res => res.json())
      .then(clearDOM())
      .then(json => renderConfirmPage(json, div));
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
  //  console.log(json);
   let pageContent = getPageContentDiv();
   pageContent.appendChild(node);
   const poemTitle = document.createElement('h2');
   const username = document.createElement('p');
   username.textContent = `By ${json.user.username}`;
   poemTitle.textContent = json.title;
   const originalDiv = document.createElement('div');
   const modifiedDiv = document.createElement('div');
   modifiedDiv.id = 'modPoemDiv';
   let pOriginal = document.createElement('p');
   let pModified = document.createElement('p');
   pOriginal.textContent = json.content;
   pModified.textContent = json.modified_content;
   pModified.id = json.id;
   pModified.className = 'modifiedPoem';
   originalDiv.appendChild(pOriginal);
   modifiedDiv.appendChild(pModified);
   const readButton1 = createReadButton();
   const readButton2 = createReadButton();
   originalDiv.append(readButton1);
   modifiedDiv.append(readButton2);
   node.appendChild(poemTitle);
   node.appendChild(username);
   node.appendChild(originalDiv);
   node.appendChild(modifiedDiv);
}

function createReadButton() {
   const button = document.createElement('button');
   button.textContent = 'Read Me';
   button.addEventListener('click', event => {
      PoemReader.killSound();
      PoemReader.readPoem(event.target.parentNode.childNodes[0].textContent);
   });
   return button;
}

function renderConfirmPage(json, node) {
   const pageContent = getPageContentDiv();
   const confirmHeader = document.createElement('h2');
   confirmHeader.innerText =
      "Here's your chance to make your poem as krazy as can be!";
   const instructionText = document.createElement('h3');
   instructionText.innerText =
      "Try click the 'redo' button below to find the kraziest nouns for your poem.";
   pageContent.appendChild(confirmHeader);
   pageContent.appendChild(instructionText);
   appendPoem(json, node);
   const modifiedPoemDiv = document.getElementById('modPoemDiv');
   const redoButton = document.createElement('button');
   modifiedPoemDiv.appendChild(redoButton);
   const modifiedPoem = document.querySelector('.modifiedPoem');
   redoButton.id = 'redoButton';
   redoButton.innerText = 'Redo';
   redoButton.addEventListener('click', () => redoPoem(modifiedPoem));
   const saveButton = document.createElement('button');
   saveButton.id = 'saveButton';
   saveButton.innerText = 'Save';
   saveButton.addEventListener('click', () => {
      clearDOM();
      fetchPoems();
   });
   pageContent.appendChild(saveButton);
}

function redoPoem(poem) {
   const modifiedPoem = swapper.replaceNouns(poem.innerText);
   const id = poem.id;
   const div = createPoemsDiv();
   fetch(`http://localhost:3000/poems/${id}`, {
      method: 'PATCH',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify({
         modified_content: modifiedPoem,
      }),
   })
      .then(res => res.json())
      .then(clearDOM())
      .then(json => renderConfirmPage(json, div));
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
