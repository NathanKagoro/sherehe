/* Sherehe – offline event planner. Everything is kept on this phone (localStorage); use More › Backup to save a copy. */
'use strict';
const VERSION = '1.0.0';
const KEY = 'sherehe:data', PKEY = 'sherehe:prefs';
const TABLES = ['events', 'tasks', 'lines', 'vendors', 'bookings', 'pledges', 'guests', 'items'];
const TYPES = ['wedding', 'sendoff', 'kitchen', 'birthday', 'corporate', 'other'];
const CATS = ['venue', 'food', 'drinks', 'decor', 'sound', 'photo', 'transport', 'cards', 'attire', 'other'];
const TABS = ['tasks', 'budget', 'bookings', 'pledges', 'guests', 'items'];

/* Starter checklists: [days before the event, English, Swahili] */
const TPL = {
  wedding: [[-120, 'Set the budget and form the committee', 'Weka bajeti na unda kamati'], [-90, 'Book the venue', 'Kodi ukumbi'], [-75, 'Book the MC', 'Pata MC'], [-60, 'Book decor', 'Pata mpambaji'], [-60, 'Book catering', 'Pata mpishi / chakula'], [-60, 'Book photo and video', 'Pata mpiga picha na video'], [-45, 'Print invitation cards', 'Chapisha kadi za mwaliko'], [-30, 'Hand out cards and follow up pledges', 'Gawa kadi na fuatilia ahadi'], [-21, 'Attire and rings ready', 'Mavazi na pete tayari'], [-7, 'Confirm every vendor', 'Thibitisha kila mhudumu'], [-3, 'Pay vendor balances', 'Lipa salio la wahudumu'], [-3, 'Finish the programme of the day', 'Kamilisha ratiba ya siku'], [-1, 'Guest list and cards to the gate team', 'Orodha ya wageni kwa walinzi wa mlango']],
  sendoff: [[-90, 'Set the budget and form the committee', 'Weka bajeti na unda kamati'], [-75, 'Book the venue', 'Kodi ukumbi'], [-60, 'Book MC, decor and catering', 'Pata MC, mpambaji na chakula'], [-45, 'Print invitation cards', 'Chapisha kadi za mwaliko'], [-30, 'Follow up pledges', 'Fuatilia ahadi'], [-7, 'Confirm every vendor', 'Thibitisha kila mhudumu'], [-3, 'Pay vendor balances', 'Lipa salio la wahudumu'], [-2, 'Finish the programme', 'Kamilisha ratiba']],
  kitchen: [[-45, 'Set the budget', 'Weka bajeti'], [-30, 'Book the venue and host', 'Pata ukumbi na mshereheshaji'], [-21, 'Send invitations', 'Tuma mialiko'], [-14, 'Decor and food', 'Mapambo na chakula'], [-7, 'Gifts list', 'Orodha ya zawadi'], [-2, 'Confirm everything', 'Thibitisha kila kitu']],
  birthday: [[-30, 'Set the budget', 'Weka bajeti'], [-21, 'Book the venue', 'Pata sehemu'], [-14, 'Send invitations', 'Tuma mialiko'], [-7, 'Order the cake', 'Agiza keki'], [-5, 'Food, drinks and decor', 'Chakula, vinywaji na mapambo'], [-1, 'Confirm guests', 'Thibitisha wageni']],
  corporate: [[-45, 'Agree budget and agenda', 'Kubaliana bajeti na ajenda'], [-30, 'Book the venue', 'Kodi ukumbi'], [-21, 'Sound, screen and projector', 'Sauti, skrini na projekta'], [-21, 'Send invitations', 'Tuma mialiko'], [-14, 'Catering', 'Chakula'], [-3, 'Confirm numbers and vendors', 'Thibitisha idadi na wahudumu'], [-1, 'Print programme and name list', 'Chapisha ratiba na orodha ya majina']],
  other: [[-30, 'Set the budget', 'Weka bajeti'], [-21, 'Book the venue', 'Pata sehemu'], [-14, 'Invite guests', 'Alika wageni'], [-7, 'Food and drinks', 'Chakula na vinywaji'], [-2, 'Confirm everything', 'Thibitisha kila kitu']]
};

const I18N = {
  en: {
    app_sub: 'Event planner', nav_home: 'Events', nav_vendors: 'Vendors', nav_more: 'More',
    t_wedding: 'Wedding', t_sendoff: 'Send-off', t_kitchen: 'Kitchen party', t_birthday: 'Birthday', t_corporate: 'Company event', t_other: 'Other',
    c_venue: 'Venue', c_food: 'Food', c_drinks: 'Drinks', c_decor: 'Decor', c_sound: 'MC, sound and music', c_photo: 'Photo and video', c_transport: 'Transport', c_cards: 'Cards and printing', c_attire: 'Attire', c_other: 'Other',
    tab_tasks: 'Checklist', tab_budget: 'Budget', tab_bookings: 'Vendors', tab_pledges: 'Michango', tab_guests: 'Guests', tab_items: 'Programme',
    upcoming: 'Upcoming events', past: 'Past events', show_past: n => 'Show past events (' + n + ')', hide_past: 'Hide past events', new_event: 'New event', no_events: 'No events yet. Tap New event to plan the first one.',
    attention: 'Needs attention', overdue: d => 'Overdue since ' + d, bal_due: (v, e) => 'Owe ' + v + ' for ' + e,
    today: 'Today', tomorrow: 'Tomorrow', in_days: n => 'In ' + n + ' days', days_ago: n => n + ' days ago', no_date: 'No date yet',
    tasks_done: (a, b) => a + ' of ' + b + ' tasks done', collected_of: (a, b) => a + ' of ' + b + ' collected',
    edit: 'Edit', edit_event: 'Edit event', save: 'Save', cancel: 'Cancel', delete: 'Delete', confirm_delete: 'Tap again to delete', close: 'Close', saved: 'Saved', deleted: 'Deleted', back: '‹ All events',
    name: 'Name', ev_name: 'Event name', ev_name_ph: 'e.g. Wedding of Juma and Neema', type: 'Type', date: 'Date', time: 'Time', venue: 'Venue', host: 'Host or family', phone: 'Phone / WhatsApp', expected: 'Guests expected', budget_t: 'Budget (TZS)', target: 'Michango target (TZS)', notes: 'Notes',
    add_tpl: 'Add the usual checklist for this type', need_name: 'Please write a name.', need_amount: 'Please write an amount.',
    calendar: 'Add to calendar', g_cal: 'Google Calendar', ics: 'Phone calendar', share: 'Share summary', copied: 'Copied',
    k_tasks: 'Checklist', k_budget: 'Spent so far', k_michango: 'Michango', k_guests: 'Guests coming',
    task: 'Task', new_task: 'New task', due: 'Due date', who: 'Who', done: 'Done', no_tasks: 'No tasks yet.', open_tasks: 'To do', done_tasks: 'Done',
    cost_item: 'Cost', new_cost: 'Add a cost', item: 'Item', category: 'Category', cost: 'Cost (TZS)', paid: 'Paid so far (TZS)', no_costs: 'No costs yet. Add costs here, or book vendors in the Vendors tab.',
    b_budget: 'Budget', b_committed: 'Agreed costs', b_paid: 'Paid', b_left: 'Still to pay', b_over: v => 'Over budget by ' + v, b_under: v => v + ' left in the budget', by_cat: 'By category', from_vendors: 'from vendors',
    vendor: 'Vendor', new_vendor: 'New vendor', service: 'Service', area: 'Location', vendors_title: 'Vendors', no_vendors: 'No vendors yet. Add the venue, MC, decorator, caterer and others you use.', booked_for: l => 'Booked for ' + l, not_booked: 'Not booked yet',
    booking: 'Booking', book_vendor: 'Book a vendor', agreed: 'Agreed price (TZS)', no_bookings: 'No vendors booked for this event yet.', balance: v => 'Balance ' + v, paid_full: 'Paid in full', vendor_pick: 'Vendor', new_vendor_opt: '+ New vendor', vendor_used: 'This vendor is booked for an event. Remove the booking first.',
    pledge: 'Contributor', new_pledge: 'Add contributor', pledged: 'Pledged (TZS)', add_pay: 'Payment', pay_amount: 'Amount paid (TZS)', no_pledges: 'No contributors yet.', p_paid: 'Paid', p_part: 'Part paid', p_none: 'Not paid',
    m_target: 'Target', m_pledged: 'Pledged', m_collected: 'Collected', m_left: 'Not yet paid', remind: 'Remind', thank: 'Thank', share_list: 'Share list to committee',
    remind_msg: (n, e, p, d, b) => 'Hello ' + n + ', thank you for your pledge to ' + e + '. Pledged ' + p + ', paid ' + d + ', balance ' + b + '. Thank you!',
    thank_msg: (n, e, d) => 'Hello ' + n + ', we have received your contribution of ' + d + ' to ' + e + '. Thank you very much!',
    guest: 'Guest', new_guest: 'Add guest', group: 'Side or group', seats: 'Seats', card: 'Card number', rsvp: 'Coming?', r_: 'Not answered', r_yes: 'Coming', r_no: 'Not coming', r_maybe: 'Maybe',
    no_guests: 'No guests yet.', search_guest: 'Search name or card number', check_in: 'Check in', undo: 'Undo', invite: 'Invite', g_invited: 'Invited', g_yes: 'Coming', g_in: 'Arrived', paste_list: 'Paste a list',
    paste_hint: 'One per line: name, phone. Example: Juma Ali, 0712 345 678', added_n: n => n + ' added',
    invite_msg: (n, e, d, v, c) => 'Hello ' + n + ', you are invited to ' + e + (d ? ' on ' + d : '') + (v ? ' at ' + v : '') + '.' + (c ? ' Your card number is ' + c + '.' : '') + ' Please let us know if you will come.',
    prog_item: 'Programme item', new_item: 'Add item', what: 'What happens', no_items: 'No programme yet. Add the order of the day: arrival, entrance, speeches, food, cake, dance.', share_prog: 'Share programme',
    more_title: 'More', language: 'Language', theme: 'Look', th_auto: 'Phone', th_light: 'Light', th_dark: 'Dark',
    backup: 'Save a backup', backup_sub: 'Download a file with everything. Keep it safe; this app keeps data only on this phone.', restore: 'Restore a backup', restore_sub: 'Replace what is here with a backup file.', restored: 'Backup restored', bad_file: 'That file is not a Sherehe backup.', restore_confirm: 'Replace everything on this phone with this backup?',
    install: 'Install on this phone', install_sub: 'Puts Sherehe on the home screen and works without internet.', install_ios: 'In Safari tap Share, then Add to Home Screen.', install_and: 'In Chrome tap ⋮, then Install app or Add to Home screen.',
    phone_only: 'Everything stays on this phone. Save a backup now and then.', version: 'Version', summary: 'Summary', all: 'All'
  },
  sw: {
    app_sub: 'Mpangaji wa sherehe', nav_home: 'Matukio', nav_vendors: 'Wahudumu', nav_more: 'Zaidi',
    t_wedding: 'Harusi', t_sendoff: 'Send-off', t_kitchen: 'Kitchen party', t_birthday: 'Siku ya kuzaliwa', t_corporate: 'Tukio la kampuni', t_other: 'Mengineyo',
    c_venue: 'Ukumbi', c_food: 'Chakula', c_drinks: 'Vinywaji', c_decor: 'Mapambo', c_sound: 'MC, sauti na muziki', c_photo: 'Picha na video', c_transport: 'Usafiri', c_cards: 'Kadi na uchapishaji', c_attire: 'Mavazi', c_other: 'Mengineyo',
    tab_tasks: 'Orodha', tab_budget: 'Bajeti', tab_bookings: 'Wahudumu', tab_pledges: 'Michango', tab_guests: 'Wageni', tab_items: 'Ratiba',
    upcoming: 'Matukio yajayo', past: 'Yaliyopita', show_past: n => 'Onyesha yaliyopita (' + n + ')', hide_past: 'Ficha yaliyopita', new_event: 'Tukio jipya', no_events: 'Bado hakuna tukio. Bonyeza Tukio jipya kuanza.',
    attention: 'Yanahitaji kushughulikiwa', overdue: d => 'Imechelewa tangu ' + d, bal_due: (v, e) => 'Deni ' + v + ' kwa ' + e,
    today: 'Leo', tomorrow: 'Kesho', in_days: n => 'Baada ya siku ' + n, days_ago: n => 'Siku ' + n + ' zilizopita', no_date: 'Bado haina tarehe',
    tasks_done: (a, b) => a + ' kati ya ' + b + ' zimekamilika', collected_of: (a, b) => a + ' kati ya ' + b + ' zimekusanywa',
    edit: 'Badili', edit_event: 'Badili tukio', save: 'Hifadhi', cancel: 'Ghairi', delete: 'Futa', confirm_delete: 'Bonyeza tena kufuta', close: 'Funga', saved: 'Imehifadhiwa', deleted: 'Imefutwa', back: '‹ Matukio yote',
    name: 'Jina', ev_name: 'Jina la tukio', ev_name_ph: 'mf. Harusi ya Juma na Neema', type: 'Aina', date: 'Tarehe', time: 'Saa', venue: 'Ukumbi / mahali', host: 'Mwenyeji au familia', phone: 'Simu / WhatsApp', expected: 'Wageni wanaotarajiwa', budget_t: 'Bajeti (TZS)', target: 'Lengo la michango (TZS)', notes: 'Maelezo',
    add_tpl: 'Ongeza orodha ya kawaida ya aina hii', need_name: 'Tafadhali andika jina.', need_amount: 'Tafadhali andika kiasi.',
    calendar: 'Weka kwenye kalenda', g_cal: 'Google Calendar', ics: 'Kalenda ya simu', share: 'Shiriki muhtasari', copied: 'Imenakiliwa',
    k_tasks: 'Orodha', k_budget: 'Kilicholipwa', k_michango: 'Michango', k_guests: 'Wageni watakaokuja',
    task: 'Kazi', new_task: 'Kazi mpya', due: 'Tarehe ya mwisho', who: 'Nani', done: 'Imekamilika', no_tasks: 'Bado hakuna kazi.', open_tasks: 'Za kufanya', done_tasks: 'Zimekamilika',
    cost_item: 'Gharama', new_cost: 'Ongeza gharama', item: 'Kitu', category: 'Kundi', cost: 'Gharama (TZS)', paid: 'Kilicholipwa (TZS)', no_costs: 'Bado hakuna gharama. Ziongeze hapa, au weka wahudumu kwenye kichupo cha Wahudumu.',
    b_budget: 'Bajeti', b_committed: 'Gharama zilizokubaliwa', b_paid: 'Kilicholipwa', b_left: 'Bado kulipa', b_over: v => 'Umezidi bajeti kwa ' + v, b_under: v => 'Zimebaki ' + v + ' kwenye bajeti', by_cat: 'Kwa kundi', from_vendors: 'kutoka kwa wahudumu',
    vendor: 'Mhudumu', new_vendor: 'Mhudumu mpya', service: 'Huduma', area: 'Eneo', vendors_title: 'Wahudumu', no_vendors: 'Bado hakuna wahudumu. Ongeza ukumbi, MC, mpambaji, mpishi na wengine.', booked_for: l => 'Amewekwa kwa ' + l, not_booked: 'Bado hajawekwa',
    booking: 'Makubaliano', book_vendor: 'Weka mhudumu', agreed: 'Bei iliyokubaliwa (TZS)', no_bookings: 'Bado hakuna mhudumu kwa tukio hili.', balance: v => 'Salio ' + v, paid_full: 'Amelipwa yote', vendor_pick: 'Mhudumu', new_vendor_opt: '+ Mhudumu mpya', vendor_used: 'Mhudumu huyu yupo kwenye tukio. Ondoa makubaliano kwanza.',
    pledge: 'Mchangiaji', new_pledge: 'Ongeza mchangiaji', pledged: 'Ahadi (TZS)', add_pay: 'Malipo', pay_amount: 'Kiasi kilicholipwa (TZS)', no_pledges: 'Bado hakuna wachangiaji.', p_paid: 'Amelipa', p_part: 'Amelipa sehemu', p_none: 'Hajalipa',
    m_target: 'Lengo', m_pledged: 'Ahadi', m_collected: 'Zilizokusanywa', m_left: 'Bado hazijalipwa', remind: 'Kumbusha', thank: 'Shukuru', share_list: 'Tuma orodha kwa kamati',
    remind_msg: (n, e, p, d, b) => 'Habari ' + n + ', asante kwa ahadi yako kwa ' + e + '. Ahadi ' + p + ', umeshalipa ' + d + ', salio ' + b + '. Asante!',
    thank_msg: (n, e, d) => 'Habari ' + n + ', tumepokea mchango wako wa ' + d + ' kwa ' + e + '. Asante sana!',
    guest: 'Mgeni', new_guest: 'Ongeza mgeni', group: 'Upande au kundi', seats: 'Viti', card: 'Namba ya kadi', rsvp: 'Atakuja?', r_: 'Hajajibu', r_yes: 'Anakuja', r_no: 'Hatakuja', r_maybe: 'Labda',
    no_guests: 'Bado hakuna wageni.', search_guest: 'Tafuta jina au namba ya kadi', check_in: 'Ameingia', undo: 'Rudisha', invite: 'Alika', g_invited: 'Walioalikwa', g_yes: 'Wanakuja', g_in: 'Wameingia', paste_list: 'Bandika orodha',
    paste_hint: 'Mmoja kwa mstari: jina, simu. Mfano: Juma Ali, 0712 345 678', added_n: n => 'Wameongezwa ' + n,
    invite_msg: (n, e, d, v, c) => 'Habari ' + n + ', unaalikwa kwenye ' + e + (d ? ' tarehe ' + d : '') + (v ? ' ' + v : '') + '.' + (c ? ' Namba ya kadi yako ni ' + c + '.' : '') + ' Tafadhali tujulishe kama utafika.',
    prog_item: 'Kipengele cha ratiba', new_item: 'Ongeza kipengele', what: 'Kinachofanyika', no_items: 'Bado hakuna ratiba. Ongeza mpangilio wa siku: kuwasili, kuingia, hotuba, chakula, keki, ngoma.', share_prog: 'Shiriki ratiba',
    more_title: 'Zaidi', language: 'Lugha', theme: 'Mwonekano', th_auto: 'Simu', th_light: 'Mwanga', th_dark: 'Giza',
    backup: 'Hifadhi nakala', backup_sub: 'Pakua faili lenye kila kitu. Liweke salama; programu hii inaweka data kwenye simu hii tu.', restore: 'Rejesha nakala', restore_sub: 'Badilisha kilichopo kwa faili la nakala.', restored: 'Nakala imerejeshwa', bad_file: 'Faili hili si nakala ya Sherehe.', restore_confirm: 'Badilisha kila kitu kwenye simu hii kwa nakala hii?',
    install: 'Weka kwenye simu', install_sub: 'Inaweka Sherehe kwenye skrini ya mwanzo na inafanya kazi bila intaneti.', install_ios: 'Kwenye Safari bonyeza Share, kisha Add to Home Screen.', install_and: 'Kwenye Chrome bonyeza ⋮, kisha Install app au Add to Home screen.',
    phone_only: 'Kila kitu kinabaki kwenye simu hii. Hifadhi nakala mara kwa mara.', version: 'Toleo', summary: 'Muhtasari', all: 'Wote'
  }
};

/* ---------- state and storage ---------- */
const P = Object.assign({ lang: 'sw', theme: 'auto' }, readJSON(PKEY) || {});
const DB = Object.assign(Object.fromEntries(TABLES.map(t => [t, {}])), readJSON(KEY) || {});
TABLES.forEach(tb => { if (!DB[tb] || typeof DB[tb] !== 'object') DB[tb] = {}; });
const ui = { view: 'home', eid: '', tab: 'tasks', past: false, q: '', form: null };
function readJSON(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function persist() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { toast('Storage full'); } }
function savePrefs() { localStorage.setItem(PKEY, JSON.stringify(P)); }

const $ = s => document.querySelector(s);
const t = (k, ...a) => { const d = I18N[P.lang] || I18N.en, x = d[k] != null ? d[k] : I18N.en[k]; return typeof x === 'function' ? x(...a) : (x == null ? k : x); };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const n = x => { const v = parseFloat(String(x == null ? '' : x).replace(/[, ]/g, '')); return isFinite(v) ? v : 0; };
const money = x => 'TZS ' + Math.round(n(x)).toLocaleString('en-US');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const pad = x => String(x).padStart(2, '0');
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => iso(new Date());
const pd = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, k) => { const d = pd(s); d.setDate(d.getDate() + k); return iso(d); };
const daysTo = s => Math.round((pd(s) - pd(today())) / 864e5);
const MONTHS = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], sw: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'] };
const nice = s => { if (!s) return ''; const d = pd(s); return d.getDate() + ' ' + MONTHS[P.lang === 'sw' ? 'sw' : 'en'][d.getMonth()] + ' ' + d.getFullYear(); };
const when = s => { if (!s) return t('no_date'); const k = daysTo(s); return k === 0 ? t('today') : k === 1 ? t('tomorrow') : k > 1 ? t('in_days', k) : t('days_ago', -k); };
const chip = (cls, txt) => `<span class="chip ${cls}">${esc(txt)}</span>`;
const phone255 = p => { let d = String(p || '').replace(/\D/g, ''); if (d.startsWith('0')) d = '255' + d.slice(1); else if (d.length === 9) d = '255' + d; return d.length >= 11 ? d : ''; };
const waLink = (p, msg) => 'https://wa.me/' + phone255(p) + '?text=' + encodeURIComponent(msg);
const rows = (tb, f) => Object.values(DB[tb]).filter(r => !f || f(r));
const of = (tb, eid) => rows(tb, r => r.eventId === eid);
const get = (tb, id) => DB[tb][id];
function put(tb, o) { o.id = o.id || uid(); const now = new Date().toISOString(); o.createdAt = o.createdAt || now; o.updatedAt = now; DB[tb][o.id] = o; persist(); return o.id; }
function remove(tb, id) {
  delete DB[tb][id];
  if (tb === 'events') TABLES.forEach(x => { if (x !== 'events' && x !== 'vendors') rows(x, r => r.eventId === id).forEach(r => delete DB[x][r.id]); });
  persist();
}
const byDate = (a, b) => (a.date || '9999').localeCompare(b.date || '9999') || (a.name || '').localeCompare(b.name || '');
const byName = (a, b) => (a.name || '').localeCompare(b.name || '');
const paidOf = p => (p.payments || []).reduce((s, x) => s + n(x.amount), 0);

/* ---------- event figures ---------- */
function stats(e) {
  const tasks = of('tasks', e.id), lines = of('lines', e.id), bk = of('bookings', e.id), pl = of('pledges', e.id), gs = of('guests', e.id);
  const committed = lines.reduce((s, x) => s + n(x.cost), 0) + bk.reduce((s, x) => s + n(x.agreed), 0);
  const paid = lines.reduce((s, x) => s + n(x.paid), 0) + bk.reduce((s, x) => s + n(x.paid), 0);
  const seats = g => n(g.seats) || 1;
  return {
    tasks: tasks.length, done: tasks.filter(x => x.done).length, committed, paid,
    pledged: pl.reduce((s, x) => s + n(x.pledged), 0), collected: pl.reduce((s, x) => s + paidOf(x), 0),
    invited: gs.reduce((s, g) => s + seats(g), 0), yes: gs.filter(g => g.rsvp === 'yes').reduce((s, g) => s + seats(g), 0), arrived: gs.filter(g => g.arrived).reduce((s, g) => s + seats(g), 0)
  };
}
const evName = e => e ? e.name : '';
const isPast = e => e.date && daysTo(e.date) < 0;

/* ---------- chrome ---------- */
const MARK = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="10" fill="#0F0E0E"/><path fill="#F2B705" d="M24 9l2.9 8.1 7.7-3.7-3.7 7.7L39 24l-8.1 2.9 3.7 7.7-7.7-3.7L24 39l-2.9-8.1-7.7 3.7 3.7-7.7L9 24l8.1-2.9-3.7-7.7 7.7 3.7z"/><circle cx="24" cy="24" r="2.6" fill="#0F0E0E"/><circle cx="11" cy="11" r="2.2" fill="#C8211E"/><circle cx="38" cy="10" r="1.8" fill="#C8211E"/><circle cx="39" cy="37" r="2.4" fill="#C8211E"/><circle cx="10" cy="38" r="1.8" fill="#C8211E"/></svg>';
const ICON = {
  home: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  vendors: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>'
};
function applyTheme() { if (P.theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', P.theme); }
function renderChrome() {
  $('#band').innerHTML = `<span class="mark">${MARK}</span><div class="brand"><h1>Sherehe</h1><p>${t('app_sub')}</p></div>`;
  const cur = ui.view === 'event' ? 'home' : ui.view;
  $('#nav').className = 'nav-in n3';
  $('#nav').innerHTML = ['home', 'vendors', 'more'].map(v => `<button data-act="nav" data-v="${v}"${cur === v ? ' aria-current="page"' : ''}>${ICON[v]}<span>${t('nav_' + v)}</span></button>`).join('');
  document.documentElement.lang = P.lang; applyTheme();
}
function render() {
  if (ui.view === 'event' && !get('events', ui.eid)) ui.view = 'home';
  $('#view').innerHTML = ui.view === 'event' ? vEvent() : ui.view === 'vendors' ? vVendors() : ui.view === 'more' ? vMore() : vHome();
  const q = $('#gq'); if (q && ui.focusQ) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); ui.focusQ = false; }
}
function renderAll() { renderChrome(); render(); }
function go(v, eid) { ui.view = v; if (eid) { if (ui.eid !== eid) { ui.tab = 'tasks'; ui.q = ''; } ui.eid = eid; } renderAll(); window.scrollTo(0, 0); }
const seg = (id, act, opts, cur) => `<div class="seg" id="${id}" role="group">${opts.map(o => `<button type="button" data-act="${act}" data-v="${o[0]}" aria-pressed="${cur === o[0]}">${esc(o[1])}</button>`).join('')}</div>`;
const bar = (a, b, cls) => `<div class="bar ${cls || ''}"><i style="width:${b > 0 ? Math.min(100, Math.round(a / b * 100)) : 0}%"></i></div>`;

/* ---------- views ---------- */
function eventCard(e) {
  const s = stats(e), k = e.date ? daysTo(e.date) : null;
  const c = k == null ? chip('plain', t('no_date')) : k < 0 ? chip('plain', when(e.date)) : k <= 7 ? chip('bad', when(e.date)) : k <= 30 ? chip('warn', when(e.date)) : chip('good', when(e.date));
  return `<button class="card" data-act="open" data-id="${e.id}"><span class="c1"><b>${esc(e.name)}</b>${c}</span>` +
    `<span class="c2"><span>${esc([t('t_' + e.type), e.date ? nice(e.date) + (e.time ? ' ' + e.time : '') : '', e.venue].filter(Boolean).join(' · '))}</span></span>` +
    (s.tasks ? `<span class="c3">${esc(t('tasks_done', s.done, s.tasks))}</span>${bar(s.done, s.tasks, 'good')}` : '') +
    (s.pledged ? `<span class="c3">${esc(t('k_michango'))}: ${esc(t('collected_of', money(s.collected), money(s.pledged)))}</span>` : '') + `</button>`;
}
function vHome() {
  const ev = rows('events'), up = ev.filter(e => !isPast(e)).sort(byDate), past = ev.filter(isPast).sort((a, b) => b.date.localeCompare(a.date));
  let h = `<div class="row"><h2>${t('upcoming')}</h2><button class="btn primary" id="addBtn" data-act="form" data-f="event">+ ${t('new_event')}</button></div>`;
  const att = [];
  up.forEach(e => {
    of('tasks', e.id).filter(x => !x.done && x.due && x.due < today()).forEach(x => att.push([x.due, `<button class="li" data-act="open" data-id="${e.id}" data-tab="tasks" style="width:100%;background:none;border-left:0;border-right:0;border-top:0;text-align:left"><span><span class="who">${esc(x.title)}</span><br><span class="meta">${esc(e.name)}</span></span><span class="right">${chip('bad', t('overdue', nice(x.due)))}</span></button>`]));
    if (e.date && daysTo(e.date) <= 14) of('bookings', e.id).filter(b => n(b.agreed) > n(b.paid)).forEach(b => att.push([e.date, `<button class="li" data-act="open" data-id="${e.id}" data-tab="bookings" style="width:100%;background:none;border-left:0;border-right:0;border-top:0;text-align:left"><span><span class="who">${esc((get('vendors', b.vendorId) || {}).name || t('vendor'))}</span><br><span class="meta">${esc(e.name)}</span></span><span class="right">${chip('warn', t('balance', money(n(b.agreed) - n(b.paid))))}</span></button>`]));
  });
  if (att.length) h += `<section class="panel" id="attention"><h3>${t('attention')}</h3><div>${att.sort((a, b) => a[0].localeCompare(b[0])).slice(0, 8).map(a => a[1]).join('')}</div></section>`;
  h += `<div class="list" id="events">${up.length ? up.map(eventCard).join('') : `<div class="empty">${t('no_events')}</div>`}</div>`;
  if (past.length) h += `<button class="btn block" data-act="past">${ui.past ? t('hide_past') : t('show_past', past.length)}</button>` + (ui.past ? `<div class="list">${past.map(eventCard).join('')}</div>` : '');
  return h;
}
function vEvent() {
  const e = get('events', ui.eid), s = stats(e), k = e.date ? daysTo(e.date) : null;
  let h = `<button class="btn link" data-act="nav" data-v="home">${t('back')}</button>`;
  h += `<section class="evhead" id="evHead"><span class="sub">${esc(t('t_' + e.type))}</span><h2>${esc(e.name)}</h2>` +
    `<span class="count">${esc(k == null ? t('no_date') : when(e.date))}</span><span class="sub">${esc([e.date ? nice(e.date) + (e.time ? ', ' + e.time : '') : '', e.venue, e.host].filter(Boolean).join(' · '))}</span>` +
    `<div class="actions"><button class="btn sm" data-act="form" data-f="event" data-id="${e.id}">${t('edit')}</button>${e.date ? `<button class="btn sm" data-act="form" data-f="calendar" data-id="${e.id}">${t('calendar')}</button>` : ''}<button class="btn sm" data-act="share-sum">${t('share')}</button></div></section>`;
  h += `<div class="kpis" id="kpis">` +
    `<button class="kpi" data-act="tab" data-v="tasks"><span class="l">${t('k_tasks')}</span><span class="v">${s.done}/${s.tasks}</span>${bar(s.done, s.tasks, 'good')}</button>` +
    `<button class="kpi" data-act="tab" data-v="budget"><span class="l">${t('k_budget')}</span><span class="v">${money(s.paid)}</span><span class="s">${n(e.budget) ? t('b_budget') + ' ' + money(e.budget) : t('b_committed') + ' ' + money(s.committed)}</span></button>` +
    `<button class="kpi" data-act="tab" data-v="pledges"><span class="l">${t('k_michango')}</span><span class="v">${money(s.collected)}</span><span class="s">${t('m_pledged')} ${money(s.pledged)}</span></button>` +
    `<button class="kpi" data-act="tab" data-v="guests"><span class="l">${t('k_guests')}</span><span class="v">${s.yes}</span><span class="s">${t('g_invited')} ${s.invited}${n(e.expected) ? ' / ' + n(e.expected) : ''}</span></button></div>`;
  h += seg('tabs', 'tab', TABS.map(x => [x, t('tab_' + x)]), ui.tab);
  return h + `<div id="tabBody" class="list">${TAB[ui.tab](e, s)}</div>`;
}
const addBtn = (f, label) => `<button class="btn primary block" id="addBtn" data-act="form" data-f="${f}">+ ${label}</button>`;
const empty = m => `<div class="empty">${m}</div>`;
const TAB = {
  tasks(e) {
    const l = of('tasks', e.id).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999')), open = l.filter(x => !x.done), done = l.filter(x => x.done);
    const card = x => `<div class="cardwrap"><div class="card" style="grid-template-columns:auto 1fr;display:grid;align-items:start;gap:4px 12px"><label class="check" style="grid-row:span 2"><input type="checkbox" data-act="toggle" data-id="${x.id}"${x.done ? ' checked' : ''} aria-label="${t('done')}"></label>` +
      `<span class="c1"><b>${esc(x.title)}</b>${x.done ? '' : x.due ? (x.due < today() ? chip('bad', nice(x.due)) : daysTo(x.due) <= 7 ? chip('warn', nice(x.due)) : chip('plain', nice(x.due))) : ''}</span>` +
      `<span class="c2"><span>${esc(x.who || '')}</span><button class="btn link" data-act="form" data-f="task" data-id="${x.id}" style="padding:0">${t('edit')}</button></span></div></div>`;
    return addBtn('task', t('new_task')) + (l.length ? (open.length ? `<h3>${t('open_tasks')} (${open.length})</h3>` + open.map(card).join('') : '') + (done.length ? `<h3>${t('done_tasks')} (${done.length})</h3>` + done.map(card).join('') : '') : empty(t('no_tasks')));
  },
  budget(e, s) {
    const lines = of('lines', e.id), bk = of('bookings', e.id), cat = {};
    lines.forEach(x => { const c = cat[x.category] = cat[x.category] || [0, 0]; c[0] += n(x.cost); c[1] += n(x.paid); });
    bk.forEach(x => { const c = cat[x.service] = cat[x.service] || [0, 0]; c[0] += n(x.agreed); c[1] += n(x.paid); });
    const B = n(e.budget);
    let h = `<section class="panel" id="budgetSum"><div class="ledger">${B ? `<div><span>${t('b_budget')}</span><span>${money(B)}</span></div>` : ''}<div><span>${t('b_committed')}</span><span>${money(s.committed)}</span></div><div><span>${t('b_paid')}</span><span>${money(s.paid)}</span></div><div class="tot"><span>${t('b_left')}</span><span>${money(s.committed - s.paid)}</span></div></div>` +
      (B ? (s.committed > B ? `<div class="warnbox">${esc(t('b_over', money(s.committed - B)))}</div>` : `<p class="hint">${esc(t('b_under', money(B - s.committed)))}</p>`) + bar(s.committed, B) : '') + `</section>`;
    const cs = CATS.filter(c => cat[c]);
    if (cs.length) h += `<section class="panel"><h3>${t('by_cat')}</h3><div class="tw"><table><tr><th>${t('category')}</th><th class="r">${t('b_committed')}</th><th class="r">${t('b_paid')}</th></tr>${cs.map(c => `<tr><td>${esc(t('c_' + c))}</td><td class="r">${money(cat[c][0])}</td><td class="r">${money(cat[c][1])}</td></tr>`).join('')}</table></div></section>`;
    h += addBtn('line', t('new_cost'));
    h += lines.length ? lines.sort((a, b) => CATS.indexOf(a.category) - CATS.indexOf(b.category)).map(x => `<button class="card" data-act="form" data-f="line" data-id="${x.id}"><span class="c1"><b>${esc(x.item)}</b><b>${money(x.cost)}</b></span><span class="c2"><span>${esc(t('c_' + x.category))}</span>${n(x.paid) >= n(x.cost) && n(x.cost) ? chip('good', t('paid_full')) : chip('warn', t('balance', money(n(x.cost) - n(x.paid))))}</span></button>`).join('') : (bk.length ? '' : empty(t('no_costs')));
    if (bk.length) h += `<p class="hint">+ ${bk.length} ${t('from_vendors')}: ${money(bk.reduce((a, x) => a + n(x.agreed), 0))}</p>`;
    return h;
  },
  bookings(e) {
    const bk = of('bookings', e.id);
    return addBtn('booking', t('book_vendor')) + (bk.length ? bk.sort((a, b) => CATS.indexOf(a.service) - CATS.indexOf(b.service)).map(b => {
      const v = get('vendors', b.vendorId) || {}, bal = n(b.agreed) - n(b.paid);
      return `<div class="cardwrap"><button class="card" data-act="form" data-f="booking" data-id="${b.id}"><span class="c1"><b>${esc(v.name || '—')}</b><b>${money(b.agreed)}</b></span><span class="c2"><span>${esc(t('c_' + b.service))}${v.phone ? ' · ' + esc(v.phone) : ''}</span>${bal > 0 ? chip('warn', t('balance', money(bal))) : chip('good', t('paid_full'))}</span>${b.notes ? `<span class="c3">${esc(b.notes)}</span>` : ''}</button>` +
        (phone255(v.phone) ? `<div class="acts"><a class="btn sm" href="tel:${esc(v.phone.replace(/\s/g, ''))}">Call</a><a class="btn sm" href="${esc(waLink(v.phone, ''))}" target="_blank" rel="noopener">WhatsApp</a></div>` : '') + `</div>`;
    }).join('') : empty(t('no_bookings')));
  },
  pledges(e, s) {
    const l = of('pledges', e.id).sort(byName), T = n(e.target);
    let h = `<section class="panel" id="pledgeSum"><div class="ledger">${T ? `<div><span>${t('m_target')}</span><span>${money(T)}</span></div>` : ''}<div><span>${t('m_pledged')}</span><span>${money(s.pledged)}</span></div><div><span>${t('m_collected')}</span><span>${money(s.collected)}</span></div><div class="tot"><span>${t('m_left')}</span><span>${money(s.pledged - s.collected)}</span></div></div>${bar(s.collected, T || s.pledged, 'good')}` +
      (l.length ? `<button class="btn" data-act="share-pledges">${t('share_list')}</button>` : '') + `</section>`;
    h += `<div class="actions">${addBtn('pledge', t('new_pledge')).replace('btn primary block', 'btn primary')}<button class="btn" data-act="form" data-f="paste" data-v="pledges">${t('paste_list')}</button></div>`;
    return h + (l.length ? l.map(p => {
      const d = paidOf(p), b = n(p.pledged) - d, st = d <= 0 ? chip('bad', t('p_none')) : b > 0 ? chip('warn', t('p_part')) : chip('good', t('p_paid'));
      const msg = b > 0 ? t('remind_msg', p.name.split(' ')[0], e.name, money(p.pledged), money(d), money(b)) : t('thank_msg', p.name.split(' ')[0], e.name, money(d));
      return `<div class="cardwrap"><button class="card" data-act="form" data-f="pledge" data-id="${p.id}"><span class="c1"><b>${esc(p.name)}</b>${st}</span><span class="c2"><span>${t('m_pledged')} ${money(p.pledged)} · ${t('b_paid')} ${money(d)}</span></span></button>` +
        `<div class="acts"><button class="btn sm good" data-act="form" data-f="payment" data-id="${p.id}">+ ${t('add_pay')}</button>${phone255(p.phone) && (b > 0 || d > 0) ? `<a class="btn sm" href="${esc(waLink(p.phone, msg))}" target="_blank" rel="noopener">${b > 0 ? t('remind') : t('thank')}</a>` : ''}</div></div>`;
    }).join('') : empty(t('no_pledges')));
  },
  guests(e, s) {
    const all = of('guests', e.id).sort(byName), q = ui.q.trim().toLowerCase();
    const l = q ? all.filter(g => (g.name || '').toLowerCase().includes(q) || String(g.card || '').toLowerCase() === q || String(g.card || '').toLowerCase().includes(q)) : all;
    let h = `<div class="kpis" id="guestSum"><div class="kpi"><span class="l">${t('g_invited')}</span><span class="v">${s.invited}</span></div><div class="kpi"><span class="l">${t('g_yes')}</span><span class="v">${s.yes}</span></div><div class="kpi hero"><span class="l">${t('g_in')}</span><span class="v">${s.arrived}</span></div></div>`;
    h += `<div class="actions">${addBtn('guest', t('new_guest')).replace('btn primary block', 'btn primary')}<button class="btn" data-act="form" data-f="paste" data-v="guests">${t('paste_list')}</button></div>`;
    if (all.length) h += `<input class="search" id="gq" type="search" placeholder="${esc(t('search_guest'))}" value="${esc(ui.q)}" autocomplete="off">`;
    return h + (l.length ? l.map(g => {
      const r = g.rsvp || '', rc = r === 'yes' ? 'good' : r === 'no' ? 'bad' : r === 'maybe' ? 'warn' : 'plain';
      return `<div class="cardwrap${g.arrived ? ' arrived' : ''}"><button class="card" data-act="form" data-f="guest" data-id="${g.id}"><span class="c1"><b>${esc(g.name)}</b>${g.arrived ? chip('good', '✓ ' + t('g_in')) : chip(rc, t('r_' + r))}</span><span class="c2"><span>${esc([g.card ? '#' + g.card : '', (n(g.seats) || 1) + ' × ' + t('seats').toLowerCase(), g.group].filter(Boolean).join(' · '))}</span></span></button>` +
        `<div class="acts"><button class="btn sm ${g.arrived ? '' : 'good'}" data-act="checkin" data-id="${g.id}">${g.arrived ? t('undo') : t('check_in')}</button>${phone255(g.phone) ? `<a class="btn sm" href="${esc(waLink(g.phone, t('invite_msg', g.name.split(' ')[0], e.name, nice(e.date), e.venue, g.card)))}" target="_blank" rel="noopener">${t('invite')}</a>` : ''}</div></div>`;
    }).join('') : empty(t('no_guests')));
  },
  items(e) {
    const l = of('items', e.id).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
    return addBtn('item', t('new_item')) + (l.length ? `<section class="panel" id="programme">${l.map(x => `<button class="li" data-act="form" data-f="item" data-id="${x.id}" style="width:100%;background:none;border-left:0;border-right:0;border-top:0;text-align:left"><span><b class="num">${esc(x.time || '—')}</b> ${esc(x.title)}${x.who ? `<br><span class="meta">${esc(x.who)}</span>` : ''}</span><span class="right">›</span></button>`).join('')}</section><button class="btn" data-act="share-prog">${t('share_prog')}</button>` : empty(t('no_items')));
  }
};
function vVendors() {
  const l = rows('vendors').sort((a, b) => CATS.indexOf(a.service) - CATS.indexOf(b.service) || byName(a, b));
  return `<div class="row"><h2>${t('vendors_title')}</h2><button class="btn primary" id="addBtn" data-act="form" data-f="vendor">+ ${t('new_vendor')}</button></div><div class="list" id="list">` +
    (l.length ? l.map(v => {
      const evs = rows('bookings', b => b.vendorId === v.id).map(b => get('events', b.eventId)).filter(Boolean);
      return `<div class="cardwrap"><button class="card" data-act="form" data-f="vendor" data-id="${v.id}"><span class="c1"><b>${esc(v.name)}</b>${chip('plain', t('c_' + v.service))}</span><span class="c2"><span>${esc([v.area, v.phone].filter(Boolean).join(' · ') || '—')}</span></span><span class="c3">${esc(evs.length ? t('booked_for', evs.map(evName).join(', ')) : t('not_booked'))}</span>${v.notes ? `<span class="c3">${esc(v.notes)}</span>` : ''}</button>` +
        (phone255(v.phone) ? `<div class="acts"><a class="btn sm" href="tel:${esc(v.phone.replace(/\s/g, ''))}">Call</a><a class="btn sm" href="${esc(waLink(v.phone, ''))}" target="_blank" rel="noopener">WhatsApp</a></div>` : '') + `</div>`;
    }).join('') : empty(t('no_vendors'))) + `</div>`;
}
let installEvt = null;
function vMore() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  return `<h2>${t('more_title')}</h2>` +
    `<section class="panel"><h3>${t('language')}</h3>${seg('langSeg', 'lang', [['sw', 'Kiswahili'], ['en', 'English']], P.lang)}<h3>${t('theme')}</h3>${seg('themeSeg', 'theme', [['auto', t('th_auto')], ['light', t('th_light')], ['dark', t('th_dark')]], P.theme)}</section>` +
    `<div class="menu"><button data-act="backup" id="backupBtn"><span><span class="mt">${t('backup')}</span><br><span class="ms">${t('backup_sub')}</span></span><span class="go">›</span></button>` +
    `<button data-act="restore"><span><span class="mt">${t('restore')}</span><br><span class="ms">${t('restore_sub')}</span></span><span class="go">›</span></button>` +
    (standalone ? '' : `<button data-act="install"><span><span class="mt">${t('install')}</span><br><span class="ms">${installEvt ? t('install_sub') : ios ? t('install_ios') : t('install_and')}</span></span><span class="go">›</span></button>`) + `</div>` +
    `<p class="hint">${t('phone_only')}</p><p class="hint">Sherehe, ${t('version')} ${VERSION}</p><input type="file" id="restoreFile" accept="application/json,.json" hidden>`;
}

/* ---------- forms ---------- */
const v = id => { const el = document.getElementById(id); return el ? el.value : ''; };
const fld = (id, label, inner) => `<div class="f"><label for="${id}">${label}</label>${inner}</div>`;
const inp = (id, label, val, attrs) => fld(id, label, `<input id="${id}" value="${esc(val == null ? '' : val)}" ${attrs || ''}>`);
const num = (id, label, val) => inp(id, label, val || val === 0 ? val : '', 'type="number" inputmode="decimal" min="0" step="any"');
const area = (id, label, val, ph) => fld(id, label, `<textarea id="${id}" placeholder="${esc(ph || '')}">${esc(val || '')}</textarea>`);
const sel = (id, label, opts, val) => fld(id, label, `<select id="${id}">${opts.map(o => `<option value="${esc(o[0])}"${String(o[0]) === String(val == null ? '' : val) ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`);
const two = (a, b) => `<div class="f2">${a}${b}</div>`;
const catOpts = () => CATS.map(c => [c, t('c_' + c)]);
const fail = m => { $('#fmsg').textContent = m; return false; };
const tel = (id, val) => inp(id, t('phone'), val, 'inputmode="tel" placeholder="07…"');
const FORMS = {
  event: {
    tb: 'events', title: id => id ? t('edit_event') : t('new_event'),
    html(id) {
      const x = id ? get('events', id) : { type: 'wedding' };
      return inp('e-name', t('ev_name'), x.name, `placeholder="${esc(t('ev_name_ph'))}"`) + sel('e-type', t('type'), TYPES.map(k => [k, t('t_' + k)]), x.type) +
        two(inp('e-date', t('date'), x.date, 'type="date"'), inp('e-time', t('time'), x.time, 'type="time"')) + inp('e-venue', t('venue'), x.venue) +
        two(inp('e-host', t('host'), x.host), tel('e-phone', x.phone)) + two(num('e-budget', t('budget_t'), x.budget), num('e-target', t('target'), x.target)) +
        num('e-expected', t('expected'), x.expected) + area('e-notes', t('notes'), x.notes) +
        (id ? '' : `<label class="check"><input type="checkbox" id="e-tpl" checked><span>${t('add_tpl')}</span></label>`);
    },
    save(id) {
      const name = v('e-name').trim(); if (!name) return fail(t('need_name'));
      const old = id ? get('events', id) : null;
      const eid = put('events', Object.assign({}, old || {}, { name, type: v('e-type'), date: v('e-date'), time: v('e-time'), venue: v('e-venue').trim(), host: v('e-host').trim(), phone: v('e-phone').trim(), budget: n(v('e-budget')), target: n(v('e-target')), expected: n(v('e-expected')), notes: v('e-notes').trim() }));
      if (!id && $('#e-tpl').checked) (TPL[v('e-type')] || []).forEach(([d, en, sw]) => { const due = v('e-date') ? addDays(v('e-date'), d) : ''; put('tasks', { eventId: eid, title: P.lang === 'sw' ? sw : en, due: due && due < today() ? today() : due, who: '', done: false }); });
      if (!id) return () => go('event', eid);
      return true;
    }
  },
  task: {
    tb: 'tasks', title: id => id ? t('task') : t('new_task'),
    html(id) { const x = id ? get('tasks', id) : {}; return inp('k-title', t('task'), x.title) + two(inp('k-due', t('due'), x.due, 'type="date"'), inp('k-who', t('who'), x.who)) + `<label class="check"><input type="checkbox" id="k-done"${x.done ? ' checked' : ''}><span>${t('done')}</span></label>`; },
    save(id) { const title = v('k-title').trim(); if (!title) return fail(t('need_name')); put('tasks', Object.assign({}, id ? get('tasks', id) : { eventId: ui.eid }, { title, due: v('k-due'), who: v('k-who').trim(), done: $('#k-done').checked })); return true; }
  },
  line: {
    tb: 'lines', title: () => t('cost_item'),
    html(id) { const x = id ? get('lines', id) : { category: 'food' }; return inp('l-item', t('item'), x.item) + sel('l-cat', t('category'), catOpts(), x.category) + two(num('l-cost', t('cost'), x.cost), num('l-paid', t('paid'), x.paid)) + area('l-notes', t('notes'), x.notes); },
    save(id) { const item = v('l-item').trim(); if (!item) return fail(t('need_name')); put('lines', Object.assign({}, id ? get('lines', id) : { eventId: ui.eid }, { item, category: v('l-cat'), cost: n(v('l-cost')), paid: n(v('l-paid')), notes: v('l-notes').trim() })); return true; }
  },
  vendor: {
    tb: 'vendors', title: id => id ? t('vendor') : t('new_vendor'),
    html(id) { const x = id ? get('vendors', id) : { service: 'venue' }; return inp('v-name', t('name'), x.name) + sel('v-service', t('service'), catOpts(), x.service) + tel('v-phone', x.phone) + inp('v-area', t('area'), x.area) + area('v-notes', t('notes'), x.notes); },
    save(id) { const name = v('v-name').trim(); if (!name) return fail(t('need_name')); put('vendors', Object.assign({}, id ? get('vendors', id) : {}, { name, service: v('v-service'), phone: v('v-phone').trim(), area: v('v-area').trim(), notes: v('v-notes').trim() })); return true; },
    canDelete: id => rows('bookings', b => b.vendorId === id).length ? t('vendor_used') : ''
  },
  booking: {
    tb: 'bookings', title: () => t('book_vendor'),
    html(id) {
      const x = id ? get('bookings', id) : { service: 'venue' };
      return sel('b-vendor', t('vendor_pick'), [['__new', t('new_vendor_opt')]].concat(rows('vendors').sort(byName).map(o => [o.id, o.name + ' (' + t('c_' + o.service) + ')'])), x.vendorId || (rows('vendors').length ? rows('vendors').sort(byName)[0].id : '__new')) +
        `<div class="newbox" id="b-new">${inp('b-vname', t('name'), '')}${tel('b-vphone', '')}</div>` + sel('b-service', t('service'), catOpts(), x.service) + two(num('b-agreed', t('agreed'), x.agreed), num('b-paid', t('paid'), x.paid)) + area('b-notes', t('notes'), x.notes);
    },
    init() { const f = () => { $('#b-new').hidden = v('b-vendor') !== '__new'; const o = get('vendors', v('b-vendor')); if (o && !ui.form.id) $('#b-service').value = o.service; }; $('#b-vendor').addEventListener('change', f); f(); },
    save(id) {
      let vid = v('b-vendor');
      if (vid === '__new') { const name = v('b-vname').trim(); if (!name) return fail(t('need_name')); vid = put('vendors', { name, service: v('b-service'), phone: v('b-vphone').trim(), area: '', notes: '' }); }
      put('bookings', Object.assign({}, id ? get('bookings', id) : { eventId: ui.eid }, { vendorId: vid, service: v('b-service'), agreed: n(v('b-agreed')), paid: n(v('b-paid')), notes: v('b-notes').trim() })); return true;
    }
  },
  pledge: {
    tb: 'pledges', title: () => t('pledge'),
    html(id) { const x = id ? get('pledges', id) : {}; return inp('p-name', t('name'), x.name) + tel('p-phone', x.phone) + num('p-pledged', t('pledged'), x.pledged) + (id ? '' : num('p-paid', t('pay_amount'), '')) + ((x.payments || []).length ? `<div class="f"><span class="flabel">${t('add_pay')}</span>${x.payments.map(p => `<div class="li"><span>${nice(p.date)}</span><span class="num">${money(p.amount)}</span></div>`).join('')}</div>` : '') + area('p-notes', t('notes'), x.notes); },
    save(id) {
      const name = v('p-name').trim(); if (!name) return fail(t('need_name'));
      const o = Object.assign({ payments: [] }, id ? get('pledges', id) : { eventId: ui.eid }, { name, phone: v('p-phone').trim(), pledged: n(v('p-pledged')), notes: v('p-notes').trim() });
      if (!id && n(v('p-paid'))) o.payments = [{ date: today(), amount: n(v('p-paid')) }];
      put('pledges', o); return true;
    }
  },
  payment: {
    tb: 'pledges', custom: true, title: () => t('add_pay'),
    html(id) { const p = get('pledges', id), b = n(p.pledged) - paidOf(p); return `<p class="hint">${esc(p.name)} · ${t('m_pledged')} ${money(p.pledged)} · ${t('b_left')} ${money(Math.max(0, b))}</p>` + two(num('y-amount', t('pay_amount'), b > 0 ? b : ''), inp('y-date', t('date'), today(), 'type="date"')) + `<div class="msg" id="fmsg" role="alert"></div><div class="actions"><button class="btn primary" type="submit">${t('save')}</button><button class="btn" type="button" data-act="close">${t('cancel')}</button></div>`; },
    save(id) { const a = n(v('y-amount')); if (!a) return fail(t('need_amount')); const p = get('pledges', id); put('pledges', Object.assign({}, p, { payments: (p.payments || []).concat([{ date: v('y-date') || today(), amount: a }]) })); return true; }
  },
  guest: {
    tb: 'guests', title: id => id ? t('guest') : t('new_guest'),
    html(id) { const x = id ? get('guests', id) : { seats: 1, rsvp: '' }; return inp('g-name', t('name'), x.name) + tel('g-phone', x.phone) + two(inp('g-card', t('card'), x.card), num('g-seats', t('seats'), x.seats)) + inp('g-group', t('group'), x.group) + sel('g-rsvp', t('rsvp'), ['', 'yes', 'maybe', 'no'].map(r => [r, t('r_' + r)]), x.rsvp); },
    save(id) { const name = v('g-name').trim(); if (!name) return fail(t('need_name')); put('guests', Object.assign({ arrived: false }, id ? get('guests', id) : { eventId: ui.eid }, { name, phone: v('g-phone').trim(), card: v('g-card').trim(), seats: n(v('g-seats')) || 1, group: v('g-group').trim(), rsvp: v('g-rsvp') })); return true; }
  },
  paste: {
    custom: true, title: () => t('paste_list'),
    html() { return `<p class="hint">${t('paste_hint')}</p><textarea id="z-text" rows="8"></textarea><div class="msg" id="fmsg" role="alert"></div><div class="actions"><button class="btn primary" type="submit">${t('save')}</button><button class="btn" type="button" data-act="close">${t('cancel')}</button></div>`; },
    save() {
      const tb = ui.form.v, lines = v('z-text').split('\n').map(s => s.trim()).filter(Boolean); if (!lines.length) return fail(t('need_name'));
      lines.forEach(s => { const m = s.match(/^(.*?)[,;\t ]+((?:\+?255|0)[\d\s]{8,})\s*$/), name = (m ? m[1] : s).replace(/[,;\s]+$/, '').trim(), phone = m ? m[2].trim() : ''; if (!name) return;
        put(tb, tb === 'pledges' ? { eventId: ui.eid, name, phone, pledged: 0, payments: [], notes: '' } : { eventId: ui.eid, name, phone, card: '', seats: 1, group: '', rsvp: '', arrived: false }); });
      return () => toast(t('added_n', lines.length));
    }
  },
  item: {
    tb: 'items', title: () => t('prog_item'),
    html(id) { const x = id ? get('items', id) : {}; return two(inp('i-time', t('time'), x.time, 'type="time"'), inp('i-who', t('who'), x.who)) + inp('i-title', t('what'), x.title); },
    save(id) { const title = v('i-title').trim(); if (!title) return fail(t('need_name')); put('items', Object.assign({}, id ? get('items', id) : { eventId: ui.eid }, { time: v('i-time'), title, who: v('i-who').trim() })); return true; }
  },
  calendar: {
    custom: true, title: () => t('calendar'),
    html(id) { const e = get('events', id); return `<div class="actions" style="flex-direction:column"><a class="btn big" href="${esc(gcal(e))}" target="_blank" rel="noopener">${t('g_cal')}</a><button class="btn big" type="button" data-act="ics" data-id="${id}">${t('ics')}</button><button class="btn" type="button" data-act="close">${t('close')}</button></div>`; },
    save: () => true
  }
};
function openForm(f, id, extra) {
  const F = FORMS[f]; if (!F) return;
  ui.form = Object.assign({ f, id: id || '' }, extra || {});
  const del = id && F.tb && f !== 'payment' ? `<button class="btn danger" type="button" data-act="del">${t('delete')}</button>` : '';
  $('#sheet').innerHTML = `<div class="sheet-head"><h3 id="sheetTitle">${F.title(id)}</h3><button type="button" data-act="close" aria-label="${t('close')}">×</button></div><form id="form" novalidate>${F.html(id)}${F.custom ? '' : `<div class="msg" id="fmsg" role="alert"></div><div class="actions"><button class="btn primary" type="submit">${t('save')}</button>${del}<button class="btn" type="button" data-act="close">${t('cancel')}</button></div>`}</form>`;
  $('#sheet').setAttribute('aria-labelledby', 'sheetTitle'); $('#sheet').hidden = false; $('#scrim').hidden = false; $('#sheet').scrollTop = 0;
  if (F.init) F.init(id);
  $('#form').addEventListener('submit', e => { e.preventDefault(); $('#fmsg') && ($('#fmsg').textContent = ''); const ok = F.save(ui.form.id); if (ok) { closeForm(); if (typeof ok !== 'function' && f !== 'calendar') toast(t('saved')); renderAll(); if (typeof ok === 'function') ok(); } });
}
function closeForm() { ui.form = null; $('#sheet').hidden = true; $('#scrim').hidden = true; $('#sheet').innerHTML = ''; }
let toastTimer;
function toast(m) { const el = $('#toast'); el.textContent = m; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 2600); }

/* ---------- calendar, sharing, backup ---------- */
function gcal(e) {
  const d = (e.date || today()).replace(/-/g, ''); let dates;
  if (e.time) { const [h, m] = e.time.split(':').map(Number), end = new Date(2000, 0, 1, h + 4, m); dates = d + 'T' + pad(h) + pad(m) + '00/' + d + 'T' + pad(end.getHours()) + pad(end.getMinutes()) + '00'; }
  else dates = d + '/' + addDays(e.date || today(), 1).replace(/-/g, '');
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(e.name) + '&dates=' + dates + '&ctz=Africa/Dar_es_Salaam&location=' + encodeURIComponent(e.venue || '') + '&details=' + encodeURIComponent(e.notes || '');
}
function icsFile(e) {
  const d = e.date.replace(/-/g, ''), x = s => String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const start = e.time ? 'DTSTART;TZID=Africa/Dar_es_Salaam:' + d + 'T' + e.time.replace(':', '') + '00' : 'DTSTART;VALUE=DATE:' + d;
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sherehe//EN', 'BEGIN:VEVENT', 'UID:' + e.id + '@sherehe', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', start, 'SUMMARY:' + x(e.name), 'LOCATION:' + x(e.venue), 'DESCRIPTION:' + x(e.notes),
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + x(e.name), 'END:VALARM', 'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', 'DESCRIPTION:' + x(e.name), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function download(name, type, text) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
async function shareText(text) {
  if (navigator.share) { try { await navigator.share({ text }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(text); toast(t('copied')); } catch (e) { window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank'); }
}
function summaryText(e) {
  const s = stats(e);
  return [e.name, [t('t_' + e.type), e.date ? nice(e.date) + (e.time ? ' ' + e.time : '') + ' (' + when(e.date) + ')' : '', e.venue].filter(Boolean).join(' · '), '',
    t('k_tasks') + ': ' + t('tasks_done', s.done, s.tasks), t('b_committed') + ': ' + money(s.committed) + (n(e.budget) ? ' / ' + t('b_budget') + ' ' + money(e.budget) : ''), t('b_paid') + ': ' + money(s.paid),
    t('k_michango') + ': ' + t('collected_of', money(s.collected), money(s.pledged)), t('k_guests') + ': ' + s.yes + ' (' + t('g_invited') + ' ' + s.invited + ')'].join('\n');
}

/* ---------- actions ---------- */
const ACT = {
  nav: b => go(b.dataset.v),
  open: b => { go('event', b.dataset.id); if (b.dataset.tab) { ui.tab = b.dataset.tab; render(); } },
  tab: b => { ui.tab = b.dataset.v; render(); },
  past: () => { ui.past = !ui.past; render(); },
  form: b => openForm(b.dataset.f, b.dataset.id, b.dataset.v ? { v: b.dataset.v } : null),
  close: () => closeForm(),
  del: b => {
    const f = ui.form, F = FORMS[f.f], why = F.canDelete ? F.canDelete(f.id) : ''; if (why) return fail(why);
    if (!b.classList.contains('armed')) { b.classList.add('armed'); b.textContent = t('confirm_delete'); return; }
    remove(F.tb, f.id); closeForm(); toast(t('deleted')); renderAll();
  },
  toggle: b => { const x = get('tasks', b.dataset.id); put('tasks', Object.assign({}, x, { done: b.checked })); render(); },
  checkin: b => { const g = get('guests', b.dataset.id); put('guests', Object.assign({}, g, { arrived: !g.arrived })); if (!g.arrived) toast('✓ ' + g.name); if (ui.q) { ui.q = ''; ui.focusQ = true; } render(); },
  ics: b => { const e = get('events', b.dataset.id); download((e.name || 'event').replace(/[^\w]+/g, '-') + '.ics', 'text/calendar', icsFile(e)); },
  'share-sum': () => shareText(summaryText(get('events', ui.eid))),
  'share-prog': () => { const e = get('events', ui.eid); shareText(e.name + (e.date ? ' – ' + nice(e.date) : '') + '\n' + t('tab_items') + '\n\n' + of('items', e.id).sort((a, b) => (a.time || '99').localeCompare(b.time || '99')).map(x => (x.time || '—') + '  ' + x.title + (x.who ? ' (' + x.who + ')' : '')).join('\n')); },
  'share-pledges': () => { const e = get('events', ui.eid), s = stats(e); shareText(e.name + ' – ' + t('k_michango') + '\n' + t('collected_of', money(s.collected), money(s.pledged)) + '\n\n' + of('pledges', e.id).sort(byName).map((p, i) => (i + 1) + '. ' + p.name + ' – ' + money(p.pledged) + ' / ' + money(paidOf(p)) + (paidOf(p) >= n(p.pledged) && n(p.pledged) ? ' ✓' : '')).join('\n')); },
  lang: b => { P.lang = b.dataset.v; savePrefs(); renderAll(); },
  theme: b => { P.theme = b.dataset.v; savePrefs(); renderAll(); },
  backup: () => download('sherehe-backup-' + today() + '.json', 'application/json', JSON.stringify({ app: 'sherehe', version: VERSION, saved: new Date().toISOString(), data: DB })),
  restore: () => $('#restoreFile').click(),
  install: async () => { if (installEvt) { installEvt.prompt(); await installEvt.userChoice; installEvt = null; render(); } }
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  if (e.target === $('#scrim')) return;
  const a = ACT[b.dataset.act]; if (!a) return;
  if (b.tagName !== 'INPUT') e.preventDefault();
  a(b);
});
$('#scrim').addEventListener('click', closeForm);
document.addEventListener('input', e => { if (e.target.id === 'gq') { ui.q = e.target.value; ui.focusQ = true; render(); } });
document.addEventListener('change', e => {
  if (e.target.id !== 'restoreFile' || !e.target.files[0]) return;
  e.target.files[0].text().then(txt => {
    let d; try { d = JSON.parse(txt); } catch (x) { d = null; }
    if (!d || d.app !== 'sherehe' || !d.data) return toast(t('bad_file'));
    if (!confirm(t('restore_confirm'))) return;
    TABLES.forEach(tb => { DB[tb] = d.data[tb] || {}; }); persist(); toast(t('restored')); go('home');
  });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && ui.form) closeForm(); });
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (ui.view === 'more') render(); });

/* ---------- start ---------- */
if (!localStorage.getItem(PKEY)) P.lang = /^sw/i.test(navigator.language || '') ? 'sw' : (navigator.language || '').startsWith('en') ? 'en' : 'sw';
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
renderAll();
window.__sherehe = { DB, P, ui };
