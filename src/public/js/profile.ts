import { setCookie } from './cookies';

var link = <HTMLInputElement>document.getElementById('savePictureBtn');
link.addEventListener('click', savePictureProfile);

async function savePictureProfile() {
  try {
    const profilePicture = <HTMLInputElement>document.getElementById('file');
    console.log(profilePicture);
    if (!profilePicture.files) {
      return 'err';
    }
    console.log(profilePicture.files[0]);
    const formData = new FormData();
    formData.append('image', profilePicture.files[0]);
    formData.append('type', 'participant');
    const postPicture = await fetch('/api/image', {
      method: 'POST',
      headers: {
        'x-api-key': 'joemama',
      },
      body: formData,
    });
    const data = await postPicture.json();

    console.log(data.data.id);
  } catch (err) {
    console.log(err);
  }
}
