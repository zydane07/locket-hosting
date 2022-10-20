var link = <HTMLInputElement>document.getElementById('registerParticipantBtn');
link.addEventListener('click', register);

async function register() {
  try {
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const name = (<HTMLInputElement>document.getElementById('name')).value;
    const phoneNumber = (<HTMLInputElement>document.getElementById('no-phone'))
      .value;
    const password = (<HTMLInputElement>document.getElementById('password'))
      .value;
    const repassword = (<HTMLInputElement>document.getElementById('password-2'))
      .value;

    const res = await fetch('/api/participant/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'joemama',
      },
      body: JSON.stringify({
        email,
        name,
        phoneNumber,
        password,
        repassword,
      }),
    });
    const data = await res.json();
    // const sendPost = await axios.post(`${process.env.BASE_URL}/api/login`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': process.env.API_KEY,
    //   },
    //   data: {
    //     email,
    //     name,
    //     phoneNumber,
    //     password,
    //     repassword,
    //   },
    // });
    console.log(data.data);
  } catch (err) {
    console.log(err);
  }
}
