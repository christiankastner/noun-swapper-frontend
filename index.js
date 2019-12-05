document.addEventListener('DOMContentLoaded', function() {
   config.speakSelectedText = false;
   createDropDown();
   fetchPoems();
   const homeButton = document.getElementById('homeButton');
   homeButton.addEventListener('click', () => {
      clearDOM();
      fetchPoems();
   });
   const poemBtn = document.getElementById('createPoemButton');
   poemBtn.addEventListener('click', createPoem);
   const stopSoundButton = document.getElementById('stopSoundButton');
   stopSoundButton.addEventListener('click', PoemReader.killSound);
});
const swapper = new NounSwapper();

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
   const p = document.createElement('p');
   const pageContent = getPageContentDiv();
   submitBtn.textContent = 'Submit';
   newPoem.textContent = 'Create Poem';
   p.textContent =
      'Select all articles of speech that you would like to replace: ';
   pageContent.appendChild(newPoem);
   poemForm.appendChild(p);
   createInput('Adjectives', poemForm, 'jj', 'checkbox');
   createInput('Nouns', poemForm, 'nn', 'checkbox');
   createInput('Verbs', poemForm, 'vb', 'checkbox');
   createInput('Adverbs', poemForm, 'rb', 'checkbox');
   createInput('Title', poemForm, 'title', 'text');
   createInput('Content', poemForm, 'content', 'textarea');
   createInput('Username', poemForm, 'username', 'text');
   poemForm.appendChild(submitBtn);
   pageContent.appendChild(poemForm);
   poemForm.addEventListener('submit', event => {
      isChecked();
      postPoem(event);
   });
}

function createInput(labelText, poemForm, id, type) {
   if (type === 'textarea') {
      const input = document.createElement(type);
      const label = document.createElement('label');
      input.id = id;
      label.textContent = labelText;
      label.appendChild(input);
      poemForm.appendChild(label);
   } else {
      const input = document.createElement('input');
      input.type = type;
      const label = document.createElement('label');
      input.id = id;
      label.textContent = labelText;
      label.appendChild(input);
      poemForm.appendChild(label);
   }
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
         modified_content: swapper.replace(
            event.target.content.value,
            isChecked(),
         ),
         username: event.target.username.value,
      }),
   })
      .then(res => res.json())
      .then(clearDOM())
      .then(json => renderConfirmPage(json, div));
}

function appendPoem(json, node) {
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
   createInput('Adjectives', pageContent, 'jj', 'checkbox');
   createInput('Nouns', pageContent, 'nn', 'checkbox');
   createInput('Verbs', pageContent, 'vb', 'checkbox');
   createInput('Adverbs', pageContent, 'rb', 'checkbox');
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
   const modifiedPoem = swapper.replace(poem.innerText, isChecked());
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
      .then(
         json =>
            (document.querySelector('.modifiedPoem').textContent =
               json.modified_content),
      );
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

function isChecked() {
   const nounInput = document.getElementById('nn');
   const verbInput = document.getElementById('vb');
   const adjInput = document.getElementById('jj');
   const adverbInput = document.getElementById('rb');
   const inputs = [nounInput, verbInput, adjInput, adverbInput];
   let checkedBoxes = [];
   for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
         checkedBoxes.push(inputs[i].id);
      }
   }
   return checkedBoxes;
}
