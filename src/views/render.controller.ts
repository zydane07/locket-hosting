import { Request, Response } from 'express';
import axios from 'axios';
import { request } from 'http';
export class RenderController {
  constructor() {
    this.index = this.index.bind(this);
    this.event = this.event.bind(this);
    this.detail_event = this.detail_event.bind(this);
    this.my_event = this.my_event.bind(this);
    this.login = this.login.bind(this);
    this.lupa_pass_1 = this.lupa_pass_1.bind(this);
    this.lupa_pass_2 = this.lupa_pass_2.bind(this);
    this.new_pass_1 = this.new_pass_1.bind(this);
    this.register = this.register.bind(this);
    this.register_participant = this.register_participant.bind(this);
    this.register_eo = this.register_eo.bind(this);
    this.register_verifikasi = this.register_verifikasi.bind(this);
    this.verifikasi_ulang = this.verifikasi_ulang.bind(this);
    this.verifikasi_sukses = this.verifikasi_sukses.bind(this);
    this.verifikasi = this.verifikasi.bind(this);
    this.verifikasiEO = this.verifikasiEO.bind(this);
    this.dashboard_eo = this.dashboard_eo.bind(this);
    this.event_eo = this.event_eo.bind(this);
    this.create_event_eo = this.create_event_eo.bind(this);
    this.edit_event_eo = this.edit_event_eo.bind(this);
    this.detail_event_eo = this.detail_event_eo.bind(this);
    this.subscribers = this.subscribers.bind(this);
    this.komentar = this.komentar.bind(this);
    this.detail_komentar = this.detail_komentar.bind(this);
    this.pengaturan = this.pengaturan.bind(this);

    this.dashboard_admin = this.dashboard_admin.bind(this);
    this.event_manajement = this.event_manajement.bind(this);
    this.detail_event_manajement = this.detail_event_manajement.bind(this);
    this.detail_event_konfirmasi = this.detail_event_konfirmasi.bind(this);
    this.daftar_participants = this.daftar_participants.bind(this);
    this.daftar_eo = this.daftar_eo.bind(this);
    this.login_admin = this.login_admin.bind(this);

    this.profile_participant = this.profile_participant.bind(this);
    this.hubungi_kami = this.hubungi_kami.bind(this);
    this.tentang_locket = this.tentang_locket.bind(this);
    this.semua_event_eo = this.semua_event_eo.bind(this);
  }

  async index(req: Request, res: Response) {
    const fetchDataWebinar = await axios.get(
      `${process.env.BASE_URL}api/event?category_id=1665979642&per_page=3&page=1`,
      {
        headers: {
          'x-api-key': process.env.API_KEY,
        },
      },
    );
    const fetchDataLomba = await axios.get(
      `${process.env.BASE_URL}api/event?category_id=1666244822&per_page=3&page=1`,
      {
        headers: {
          'x-api-key': process.env.API_KEY,
        },
      },
    );
    const events = fetchDataWebinar.data.data;
    const lomba = fetchDataLomba.data.data;

    return res.render('index', {
      events,
      lomba,
    });
  }
  async event(req: Request, res: Response) {
    const fetchAllEvents = await axios.get(`${process.env.BASE_URL}api/event`, {
      headers: {
        'x-api-key': process.env.API_KEY,
      },
    });
    const allEvents = fetchAllEvents.data.data;
    console.log(allEvents);

    return res.render('event', {
      allEvents,
    });
  }
  async detail_event(req: Request, res: Response) {
    const { id } = req.params;
    const fetchDetailEvents = await axios.get(
      `${process.env.BASE_URL}api/event/${id}`,
      {
        headers: {
          'x-api-key': process.env.API_KEY,
        },
      },
    );

    const detailEvents = fetchDetailEvents.data.data;
    console.log(detailEvents);
    return res.render('detail-event', {
      detailEvents,
    });
  }
  async my_event(req: Request, res: Response) {
    return res.render('my-event');
  }
  async login(req: Request, res: Response) {
    return res.render('login');
  }
  async lupa_pass_1(req: Request, res: Response) {
    return res.render('lupa-pass-1');
  }
  async lupa_pass_2(req: Request, res: Response) {
    return res.render('lupa-pass-2');
  }
  async new_pass_1(req: Request, res: Response) {
    return res.render('new-pass-1');
  }
  async new_pass_2(req: Request, res: Response) {
    return res.render('new-pass-2');
  }
  async register(req: Request, res: Response) {
    return res.render('register');
  }
  async register_participant(req: Request, res: Response) {
    return res.render('register-participant');
  }
  async register_eo(req: Request, res: Response) {
    return res.render('register-eo');
  }
  async register_verifikasi(req: Request, res: Response) {
    return res.render('register-verifikasi');
  }
  async verifikasi_ulang(req: Request, res: Response) {
    return res.render('register-verifikasi-2');
  }
  async verifikasi_sukses(req: Request, res: Response) {
    return res.render('verifikasi-sukses');
  }
  async verifikasi(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verification = await axios.post(
        `${process.env.BASE_URL}/api/verification-participant`,
        {
          token,
        },
        {
          headers: {
            'x-api-key': process.env.API_KEY,
          },
        },
      );
      return res.redirect('/verifikasi-sukses');
    } catch (err) {
      return res.redirect('/verifikasi-ulang');
    }
  }

  async verifikasiEO(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verification = await axios.post(
        `${process.env.BASE_URL}/api/verification-eo`,
        {
          token,
        },
        {
          headers: {
            'x-api-key': process.env.API_KEY,
          },
        },
      );
      return res.redirect('/verifikasi-sukses');
    } catch (err) {
      return res.redirect('/verifikasi-ulang');
    }
  }

  async dashboard_eo(req: Request, res: Response) {
    return res.render('eo-views/dashboard');
  }
  async event_eo(req: Request, res: Response) {
    return res.render('eo-views/event');
  }
  async create_event_eo(req: Request, res: Response) {
    return res.render('eo-views/create-event');
  }
  async edit_event_eo(req: Request, res: Response) {
    return res.render('eo-views/edit-event');
  }
  async detail_event_eo(req: Request, res: Response) {
    return res.render('eo-views/detail-event');
  }
  async subscribers(req: Request, res: Response) {
    return res.render('eo-views/subscribers');
  }
  async komentar(req: Request, res: Response) {
    return res.render('eo-views/komentar');
  }
  async detail_komentar(req: Request, res: Response) {
    return res.render('eo-views/detail-komentar');
  }
  async pengaturan(req: Request, res: Response) {
    return res.render('eo-views/pengaturan');
  }

  async login_admin(req: Request, res: Response) {
    return res.render('admin-views/login');
  }
  async dashboard_admin(req: Request, res: Response) {
    return res.render('admin-views/dashboard');
  }
  async event_manajement(req: Request, res: Response) {
    return res.render('admin-views/event-manajement');
  }
  async detail_event_manajement(req: Request, res: Response) {
    return res.render('admin-views/detail-event');
  }
  async detail_event_konfirmasi(req: Request, res: Response) {
    return res.render('admin-views/detail-konfirmasi');
  }
  async daftar_participants(req: Request, res: Response) {
    return res.render('admin-views/participants');
  }
  async daftar_eo(req: Request, res: Response) {
    return res.render('admin-views/event-organizer');
  }

  async profile_participant(req: Request, res: Response) {
    const fetchProfile = await axios.get(
      `${process.env.BASE_URL}/api/profile`,
      {
        headers: {
          'x-api-key': process.env.API_KEY,
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      },
    );

    const fetchSubscribedEO = await axios.get(
      `${process.env.BASE_URL}/api/participant/subscribed`,
      {
        headers: {
          'x-api-key': process.env.API_KEY,
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      },
    );
    console.log(fetchSubscribedEO.data.data);
    return res.render('profile', {
      data: fetchProfile.data,
      subscribedEO: fetchSubscribedEO.data,
    });
  }
  async hubungi_kami(req: Request, res: Response) {
    return res.render('hubungi-kami');
  }
  async tentang_locket(req: Request, res: Response) {
    return res.render('tentang-locket');
  }
  async semua_event_eo(req: Request, res: Response) {
    return res.render('event-eo');
  }
}
