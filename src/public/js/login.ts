import { setCookie } from './cookies';

var link = <HTMLInputElement>document.getElementById('loginBtn');
link.addEventListener('click', login);

async function login() {
  try {
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password'))
      .value;
    console.log(email, password);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'joemama',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) {
      console.log(data.message);
    } else {
      console.log('Setting up Cookies');
      setCookie('access_token', data.data.access_token, 1);
      setCookie('refresh_token', data.data.refresh_token, 3);
      window.location.href = '/';
    }
  } catch (err) {
    console.log(err);
  }
}
