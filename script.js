// --- SIGNUP / LOGIN --- 
document.getElementById('toLogin').addEventListener('click',()=>{
  document.getElementById('signupSection').style.display='none';
  document.getElementById('loginSection').style.display='block';
});
document.getElementById('toSignup').addEventListener('click',()=>{
  document.getElementById('loginSection').style.display='none';
  document.getElementById('signupSection').style.display='block';
});

// --- PRODUK ---
const products = [
  {id:'k1',type:'kesehatan',title:'SehatPlus Care',desc:'Perlindungan kesehatan dasar dengan biaya rawat inap hingga Rp100 juta/tahun.',price:2500000},
  {id:'k2',type:'kesehatan',title:'MediGuard Pro',desc:'Menanggung rawat jalan, rawat inap, hingga operasi besar.',price:3500000},
  {id:'k3',type:'kesehatan',title:'Hospicare Shield',desc:'Fokus perlindungan rawat inap rumah sakit dengan premi terjangkau.',price:1800000},
  {id:'k4',type:'kesehatan',title:'WellCare Premium',desc:'Perlindungan komprehensif termasuk kesehatan gigi & mata.',price:4200000},
  {id:'k5',type:'kesehatan',title:'HealthSecure Basic',desc:'Asuransi kesehatan dasar untuk individu & keluarga kecil.',price:1500000},

  {id:'j1',type:'jiwa',title:'LifeSecure 1M',desc:'Santunan jiwa hingga Rp1 miliar dengan premi ringan.',price:100000},
  {id:'j2',type:'jiwa',title:'GuardianLife Protect',desc:'Perlindungan jiwa jangka panjang dengan manfaat investasi.',price:250000},
  {id:'j3',type:'jiwa',title:'FamilyCare Assurance',desc:'Memberikan jaminan keuangan untuk keluarga jika risiko terjadi.',price:300000},
  {id:'j4',type:'jiwa',title:'SafeFuture Plan',desc:'Rencana proteksi jiwa dengan manfaat pendidikan anak.',price:400000},
  {id:'j5',type:'jiwa',title:'LifeShield Max',desc:'Perlindungan maksimal dengan fleksibilitas pertanggungan hingga Rp10 miliar.',price:500000},

  {id:'m1',type:'mobil',title:'AutoSafe Basic',desc:'Perlindungan mobil dari kerusakan ringan & kecelakaan kecil.',price:500000},
  {id:'m2',type:'mobil',title:'DriveGuard Plus',desc:'Menanggung kerusakan akibat kecelakaan, tabrakan, dan kebakaran.',price:750000},
  {id:'m3',type:'mobil',title:'CarProtect Premium',desc:'Perlindungan menyeluruh termasuk kehilangan total akibat pencurian.',price:1200000},
  {id:'m4',type:'mobil',title:'MotorShield Smart',desc:'Asuransi kendaraan roda empat dengan premi hemat.',price:600000},
  {id:'m5',type:'mobil',title:'AutoSecure Max',desc:'Proteksi total mobil termasuk bencana alam & banjir.',price:1500000}
];

function renderProducts(filter) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  const filtered = products.filter(p => filter === 'all' ? true : p.type === filter);

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p><strong>Tipe:</strong> ${p.type}</p>
      <p><strong>Harga:</strong> Rp ${p.price.toLocaleString()}</p>
      <p>${p.desc}</p>
      <button onclick="openDetail(${JSON.stringify(p).replace(/"/g,'&quot;')})">Beli</button>
    `;
    grid.appendChild(card);
  });
}

// --- SIGNUP / LOGIN ---
document.getElementById('signupForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('suName').value;
  const email=document.getElementById('suEmail').value;
  const pass=document.getElementById('suPass').value;
  const pass2=document.getElementById('suPass2').value;
  const phone=document.getElementById('suPhone').value;

  if(pass!==pass2){
    document.getElementById('suMsg').innerText="Password tidak sama!";
    document.getElementById('suMsg').style.color="red";
    return;
  }
  if(!phone.match(/^08[0-9]{8,}$/)){
    document.getElementById('suMsg').innerText="Nomor HP harus diawali 08 dan minimal 10 digit!";
    document.getElementById('suMsg').style.color="red";
    return;
  }

  localStorage.setItem('user',JSON.stringify({name,email,pass,phone}));
  document.getElementById('suMsg').innerText="Pendaftaran berhasil, silakan login!";
  document.getElementById('suMsg').style.color="green";
});

document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const email=document.getElementById('loginEmail').value;
  const pass=document.getElementById('loginPass').value;
  const user=JSON.parse(localStorage.getItem('user'));
  if(user && user.email===email && user.pass===pass){
    document.getElementById('signupSection').style.display='none';
    document.getElementById('loginSection').style.display='none';
    document.querySelector('.main-nav').style.display='flex';

    // langsung masuk marketplace
    hideAll();
    document.getElementById('marketSection').style.display='block';
    renderProducts('all');
    document.getElementById('filterCat').addEventListener('change', e => renderProducts(e.target.value));

  } else {
    document.getElementById('loginMsg').innerText="Email atau password salah!";
    document.getElementById('loginMsg').style.color="red";
  }
});

// --- NAVBAR ---
// fungsi set active
function setActiveNav(link) {
  document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
}

// event listener untuk tiap menu
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.textContent.toLowerCase();

    hideAll();
    setActiveNav(link);

    if (page === 'marketplace') {
      document.getElementById('marketSection').style.display = 'block';
      renderProducts('all');
      document.getElementById('filterCat').addEventListener('change', e => renderProducts(e.target.value));
    }
    else if (page === 'history') {
      document.getElementById('historySection').style.display = 'block';
      renderHistory();
    }
    else if (page === 'logout') {
      document.querySelector('.main-nav').style.display = 'none';
      document.getElementById('loginSection').style.display = 'block';
    }
  });
});

function hideAll(){
  ['marketSection','detailSection','checkoutSection','historySection']
    .forEach(id=>document.getElementById(id).style.display='none');
}

let currentPurchase = null;
let history = JSON.parse(localStorage.getItem('history')||'[]');

// --- DETAIL PRODUK ---
function openDetail(p){
  currentPurchase = {product:p};
  hideAll();
  document.getElementById('detailSection').style.display='block';
  document.getElementById('detailTitle').innerText = `Detail ${p.title}`;
  const form = document.getElementById('detailForm');
  form.innerHTML = '';

  if(p.type==='mobil'){
    form.innerHTML = `
      <input id="tahun" type="number" placeholder="Tahun pembuatan" required><br>
      <input id="harga" type="number" placeholder="Harga mobil" required><br>
      <input id="plat" placeholder="Nomor plat" required><br>
      <input id="mesin" placeholder="Nomor mesin" required><br>
      <input id="rangka" placeholder="Nomor rangka" required><br>
      <input id="pemilik" placeholder="Nama pemilik" required><br>
    `;
  }
  else if(p.type==='kesehatan'){
    form.innerHTML = `
      <input id="nama" placeholder="Nama lengkap KTP" required><br>
      <input id="lahir" type="date" required><br>
      <input id="pekerjaan" placeholder="Pekerjaan" required><br>
      <label>Merokok: <select id="smoke"><option value="0">Tidak</option><option value="1">Ya</option></select></label><br>
      <label>Hipertensi: <select id="ht"><option value="0">Tidak</option><option value="1">Ya</option></select></label><br>
      <label>Diabetes: <select id="dm"><option value="0">Tidak</option><option value="1">Ya</option></select></label><br>
    `;
  }
  else if(p.type==='jiwa'){
    form.innerHTML = `
      <input id="nama" placeholder="Nama lengkap KTP" required><br>
      <input id="lahir" type="date" required><br>
      <label>Pertanggungan:
        <select id="tanggungan">
          <option value="1000000000">Rp1M</option>
          <option value="2000000000">Rp2M</option>
          <option value="3500000000">Rp3.5M</option>
          <option value="5000000000">Rp5M</option>
          <option value="10000000000">Rp10M</option>
        </select>
      </label><br>
    `;
  }
}

// --- HITUNG PREMI ---
document.getElementById('toCheckout').addEventListener('click',()=>{
  const p=currentPurchase.product;
  let premi=0;

  if(p.type==='mobil'){
    const tahun=parseInt(document.getElementById('tahun').value);
    const harga=parseInt(document.getElementById('harga').value);
    const umur = new Date().getFullYear() - tahun;

    if(umur<=3) premi=0.025*harga;
    else if(umur<=5 && harga<200000000) premi=0.04*harga;
    else if(umur<=5 && harga>=200000000) premi=0.03*harga;
    else premi=0.05*harga;
  }
  else if(p.type==='kesehatan'){
    const lahir=new Date(document.getElementById('lahir').value);
    const u=new Date().getFullYear()-lahir.getFullYear();
    const smoke=+document.getElementById('smoke').value;
    const ht=+document.getElementById('ht').value;
    const dm=+document.getElementById('dm').value;

    let P=2000000;
    let m=(u<=20)?0.1:(u<=35?0.2:(u<=50?0.25:0.4));

    premi = P + (m*P) + (smoke*0.5*P) + (ht*0.4*P) + (dm*0.5*P);
  }
  else if(p.type==='jiwa'){
    const lahir=new Date(document.getElementById('lahir').value);
    const u=new Date().getFullYear()-lahir.getFullYear();
    const t=parseInt(document.getElementById('tanggungan').value);

    let m=(u<=30)?0.002:(u<=50?0.004:0.01);

    premi = m * t;
  }

  currentPurchase.premi = Math.round(premi);
  hideAll();
  document.getElementById('checkoutSection').style.display='block';
  document.getElementById('checkoutInfo').innerText=`Premi yang harus dibayar: Rp ${premi.toLocaleString()}`;
});

// --- PEMBAYARAN ---
function processPayment(status){
  const payment = {
    product: currentPurchase.product.title,
    type: currentPurchase.product.type,
    date: new Date().toLocaleString(),
    price: currentPurchase.premi,
    method: document.getElementById('paymentMethod').value || '-',
    bank: document.getElementById('bank').value || '-',
    status: status
  };

  if(currentPurchase.editIndex !== undefined){
    // update entry lama
    history[currentPurchase.editIndex] = payment;
    delete currentPurchase.editIndex;
    delete currentPurchase.oldHistory;
  } else {
    // simpan entry baru
    history.push(payment);
  }

  localStorage.setItem('history', JSON.stringify(history));

  hideAll();
  document.getElementById('historySection').style.display='block';
  renderHistory();
}

// --- RENDER HISTORY ---
function renderHistory(){
  const tbody = document.getElementById('historyTable');
  tbody.innerHTML = '';

  history.forEach((h, index) => {
    let statusClass = '';
    if (h.status.toLowerCase() === 'lunas') statusClass = 'status-lunas';
    else if (h.status.toLowerCase() === 'pending') statusClass = 'status-pending';
    else statusClass = 'status-gagal';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${h.product}</td>
      <td>${h.type}</td>
      <td>${h.date}</td>
      <td>Rp ${h.price.toLocaleString()}</td>
      <td>${h.method || '-'}</td>
      <td>${h.bank || '-'}</td>
      <td><span class="${statusClass}">${h.status}</span></td>
      <td>${h.status.toLowerCase()==='pending'
        ? `<button onclick="editPayment(${index})">Edit</button>`
        : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function editPayment(index){
  const hist = history[index];
  const prod = products.find(p => p.title === hist.product);

  currentPurchase = {
    product: prod,
    premi: hist.price,     // simpan premi lama
    editIndex: index,
    oldHistory: hist
  };

  hideAll();
  document.getElementById('checkoutSection').style.display='block';
  document.getElementById('checkoutInfo').innerText =
    `Premi yang harus dibayar: Rp ${hist.price.toLocaleString()}`;

  // Pre-fill metode & bank
  document.getElementById('paymentMethod').value =
    hist.method && hist.method !== '-' ? hist.method : '';
  document.getElementById('bank').value =
    hist.bank && hist.bank !== '-' ? hist.bank : '';
}


// --- CLEAR HISTORY ---
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  if(confirm("Yakin ingin menghapus seluruh history?")){
    history = [];
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
  }
});
