// Get the button
let backToTopbtn = document.getElementById('btn-back-to-top')!;
const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopbtn.style.display = 'block';
  } else {
    backToTopbtn.style.display = 'none';
  }
};
const backToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

// When the user scrolls down 20px from the top of the document, show the button
document.addEventListener('scroll', scrollFunction);

// When the user clicks on the button, scroll to the top of the document
backToTopbtn?.addEventListener('click', backToTop);

// menu active
const locationUser = location.href;
const navbar: NodeListOf<HTMLAnchorElement> =
  document.querySelectorAll('.nav__link');
const navbarLength = navbar.length;
for (let i = 0; i < navbarLength; i++) {
  if (navbar[i].href === locationUser) {
    navbar[i].className = 'nav-link nav__link active-nav';
  }
}

// change Photo
//declearing html elements
const imgContainerDiv = document.querySelector(
  '.profile-pict-container',
) as HTMLDivElement;
const imgProfile = document.querySelector('#photo-profile') as HTMLImageElement;
const fileUpload = document.querySelector('#file') as HTMLInputElement;
const uploadBtnImg = document.querySelector(
  '.upload-foto-profile',
) as HTMLElement;

//if user hover on img div
// imgContainerDiv?.addEventListener('mouseenter', function () {
//   uploadBtnImg!.style.display = 'block';
// });

// //if we hover out from img div
// imgContainerDiv?.addEventListener('mouseleave', function () {
//   uploadBtnImg!.style.display = 'block';
// });

//lets work for image showing functionality when we choose an image to upload

//when we choose a foto to upload

fileUpload?.addEventListener('change', function () {
  //this refers to file
  let choosedFile;
  if (fileUpload.files !== null) {
    choosedFile = fileUpload.files[0];
  }

  if (choosedFile) {
    const reader = new FileReader(); //FileReader is a predefined function of JS

    reader.addEventListener('load', function () {
      if (typeof reader.result === 'string') {
        imgProfile.setAttribute('src', reader.result);
      }
    });

    reader.readAsDataURL(choosedFile);
  }
});

// subscribe EO
const btnSubs = document.querySelector('#subscribeEo') as HTMLButtonElement;

btnSubs?.addEventListener('click', (e) => {
  btnSubs.classList.toggle('btn-light-2');
  btnSubs.classList.toggle('transition-btn-light');
  btnSubs.classList.toggle('btn-primary');
  btnSubs.classList.toggle('btn-primary-transition');

  if (btnSubs.classList.contains('btn-light-2')) {
    btnSubs.innerText = 'Subscribed';
  } else {
    btnSubs.innerText = 'Subscribe';
  }
});

const btnSubsLg = document.querySelector('#subscribeEoLg') as HTMLDivElement;
const textSubscribe = document.querySelector(
  '#btn_Subscribe',
) as HTMLButtonElement;
btnSubsLg?.addEventListener('click', (e) => {
  btnSubsLg.classList.toggle('btn-light-lg');
  btnSubsLg.classList.toggle('transition-btn-light');
  btnSubsLg.classList.toggle('btn-primary-lg');
  btnSubsLg.classList.toggle('btn-primary-transition');

  if (btnSubsLg.classList.contains('btn-light-lg')) {
    textSubscribe.innerText = 'Subscribed';
  } else {
    textSubscribe.innerText = 'Subscribe';
  }
});

var link = <HTMLInputElement>document.getElementById('logoutBtn');
link.addEventListener('click', logout);

async function logout() {
  try {
    document.cookie = 'access_token=; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (err) {
    console.log(err);
  }
}
