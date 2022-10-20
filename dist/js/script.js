// menu active admin & eo
const currentLocation = location.href;
const menuItem = document.querySelectorAll('.nav__link');
const menuLength = menuItem.length;

for (let i = 0; i < menuLength; i++) {
  if (menuItem[i].href === currentLocation) {
    menuItem[i].className = 'nav__link nav-link active';
  }
}

// prasyarat event

/**
 * @type {HTMLInputElement} btnCheckPrasyarat
 */

const btnCheckPrasyarat = document.querySelector('#checkPrasyarat');
const containerPrasyarat = document.querySelector('#containerPrasyarat');
const prasyaratEvent = document.querySelector('#prasyaratEvent');
const addPrasyarat = document.querySelector('#containerAddPrasyarat');

prasyaratEvent?.addEventListener('change', (e) => {
  const totalPrasyarat = e.target.value;

  if (totalPrasyarat >= 1) {
    addPrasyarat.classList.remove('d-none');
    let label = document.createElement('label');
    let input = document.createElement('input');

    for (let i = 0; i < totalPrasyarat.length; i++) {
      console.log(totalPrasyarat);
      label.setAttribute('for', 'namaPrasyarat');
      label.innerHTML = `Nama Prasyarat ${totalPrasyarat}`;
      input.setAttribute('type', 'text');
      input.setAttribute('id', `namaPrasyarat${totalPrasyarat}`);
      input.setAttribute('class', 'form-control');
      input.setAttribute('required', true);

      if (totalPrasyarat < totalPrasyarat.length) {
        addPrasyarat.remove(label);
        addPrasyarat.remove(input);
      } else {
        addPrasyarat.appendChild(label);
        addPrasyarat.appendChild(input);
      }
    }
  } else {
    addPrasyarat.classList.add('d-none');
  }
});

btnCheckPrasyarat?.addEventListener('click', () => {
  if (btnCheckPrasyarat.checked) {
    containerPrasyarat.classList.remove('d-none');
  } else {
    containerPrasyarat.classList.add('d-none');
    addPrasyarat.classList.add('d-none');
  }
});

// change Photo
//declearing html elements
const imgDiv = document.querySelector('.profile-pic-div');
const img = document.querySelector('#photo');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');

//if user hover on img div
imgDiv?.addEventListener('mouseenter', function () {
  uploadBtn.style.display = 'block';
});

//if we hover out from img div

imgDiv?.addEventListener('mouseleave', function () {
  uploadBtn.style.display = 'block';
});

//lets work for image showing functionality when we choose an image to upload

//when we choose a foto to upload

file?.addEventListener('change', function () {
  //this refers to file
  const choosedFile = this.files[0];

  if (choosedFile) {
    const reader = new FileReader(); //FileReader is a predefined function of JS

    reader.addEventListener('load', function () {
      img.setAttribute('src', reader.result);
    });

    reader.readAsDataURL(choosedFile);
  }
});

// change pp
const photoPP = document.querySelector('.photo-pp-container');
const imgPP = document.querySelector('#photoPp');
//if user hover on img div
photoPP?.addEventListener('mouseenter', function () {
  uploadBtn.style.display = 'block';
});

//if we hover out from img div

photoPP?.addEventListener('mouseleave', function () {
  uploadBtn.style.display = 'block';
});

//lets work for image showing functionality when we choose an image to upload

//when we choose a foto to upload

file?.addEventListener('change', function () {
  //this refers to file
  const choosedFile = this.files[0];

  if (choosedFile) {
    const reader = new FileReader(); //FileReader is a predefined function of JS

    reader.addEventListener('load', function () {
      imgPP.setAttribute('src', reader.result);
    });

    reader.readAsDataURL(choosedFile);
  }
});

// show pass
const showPass = document.querySelector('showPassword');
showPass?.addEventListener('click', () => {
  console.log(showPass);
  if (showPass.type === 'password') {
    showPass.type = 'text';
  } else {
    showPass.type = 'password';
  }
});
