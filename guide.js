
'use strict';

const byId = id => document.getElementById(id);
const select = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const assets = 'assets/';
const pressed = (element, on) => element.setAttribute('aria-pressed', String(on));

const parts = {
  arch: {
    title: 'Khung vòm liên hệ với kiến trúc',
    text: 'Hình vòm gợi lại các ô cửa và phào trên mặt tiền. Khi chuyển từ biển hiệu sang một vật phẩm nhỏ, đường bao vẫn tạo hình dáng dễ nhận ra.'
  },
  av: {
    title: 'Monogram AV rút gọn tên thương hiệu',
    text: 'Hai chữ cái A và V đan vào nhau tạo một dấu hiệu riêng. Có thể dùng biểu tượng trên ảnh đại diện, ghim áo hoặc tem khi tên L’AnVie đã xuất hiện ở gần.'
  },
  ribbon: {
    title: 'Dải lượn làm mềm hình biểu tượng',
    text: 'Đường cong vàng champagne đi qua các nét chéo của AV, tạo nhịp chuyển động nhẹ. Trên nền teal, đây là một chi tiết gợi liên tưởng đến mặt nước Hạ Long.'
  },
  name: {
    title: 'Chữ L’AnVie là điểm nhận biết chính',
    text: 'Nét thanh, nét đậm và dáng chữ có chân tạo sắc thái cổ điển. Bản chỉ chữ trải theo chiều ngang, phù hợp với ô biển dài và phần đầu website.'
  },
  descriptor: {
    title: 'Dòng định danh giới thiệu loại hình và địa điểm',
    text: '“Boutique Hotel · Ha Long” giúp người xem hiểu ngay loại hình lưu trú và vị trí khi gặp thương hiệu lần đầu. Ở cỡ nhỏ, dùng biến thể không slogan để tên L’AnVie dễ đọc.'
  }
};

const forms = {
  full: ['Logo đầy đủ L’AnVie','Dùng khi cần giới thiệu thương hiệu và có đủ chỗ để đọc dòng định danh.',['arch','av','ribbon','name','descriptor']],
  no_slogan: ['Logo biểu tượng và chữ L’AnVie','Dùng cho bao thẻ, lễ tân và bố cục gọn cần nhận biết tên thương hiệu.',['arch','av','ribbon','name']],
  wordmark: ['Logo chỉ chữ L’AnVie','Dùng cho biển mặt tiền dạng ngang hoặc đầu trang có chiều cao hạn chế.',['name']],
  symbol: ['Biểu tượng AV L’AnVie','Dùng khi tên đã xuất hiện ở gần hoặc khi đối tượng đã nhận biết thương hiệu.',['arch','av','ribbon']]
};

const logoForm = byId('logo-form');
const formLabels = {
  full: 'Đầy đủ',
  no_slogan: 'Không slogan',
  wordmark: 'Chỉ chữ',
  symbol: 'Chỉ biểu tượng'
};
let selectedForm = 'full';
for (const [key, name] of Object.entries(formLabels)) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.form = key;
  const preview = document.createElement('img');
  preview.alt = '';
  const label = document.createElement('span');
  label.textContent = name;
  button.append(preview, label);
  button.addEventListener('click', () => {
    selectedForm = key;
    spaceVisible = false;
    renderLogo();
  });
  logoForm.append(button);
}
const lineLayer = document.querySelector('.leader-lines');
for (const pin of select('.pin')) {
  const line = document.createElementNS('http://www.w3.org/2000/svg','path');
  line.dataset.part = pin.dataset.feature;
  lineLayer.append(line);
}
function drawLeaders() {
  const scale = Number(logoScale.value) / 100;
  for (const pin of select('.pin')) {
    const x = parseFloat(pin.style.getPropertyValue('--left'));
    const y = parseFloat(pin.style.getPropertyValue('--top'));
    const [tx, ty] = pin.dataset.target.split(',').map(Number);
    const endX = 50 + (tx - 50) * scale;
    const endY = 50 + (ty - 50) * scale;
    const bendX = x < 50 ? 14 : 86;
    const line = lineLayer.querySelector('[data-part="' + pin.dataset.feature + '"]');
    line.setAttribute('d', 'M ' + x + ' ' + y + ' H ' + bendX + ' L ' + endX + ' ' + endY);
    line.classList.toggle('active', pin.dataset.feature === currentPart);
  }
}
const logoScale = byId('logo-scale');
let tone = 'light';
let currentPart = 'arch';
let spaceVisible = false;

function choosePart(key) {
  currentPart = key;
  for (const button of select('[data-feature]')) pressed(button, button.dataset.feature === key);
  byId('feature-note').querySelector('h3').textContent = parts[key].title;
  byId('feature-note').querySelector('p').textContent = parts[key].text;
  drawLeaders();
}

function renderLogo() {
  const key = selectedForm;
  const [name, use, available] = forms[key];
  const filename = key + '-' + tone + '.svg';
  byId('logo-image').src = assets + filename;
  byId('logo-image').alt = name + (tone === 'light' ? ', bản sáng' : ', nền Ocean Teal');
  byId('logo-stage').dataset.tone = tone;
  byId('logo-use').textContent = use;
  logoForm.dataset.tone = tone;
  for (const button of select('button', logoForm)) {
    const option = button.dataset.form;
    pressed(button, option === key);
    button.querySelector('img').src = assets + option + '-' + tone + '.svg';
  }
  byId('hotspots').hidden = key !== 'full';
  byId('logo-stage').hidden = spaceVisible;
  byId('space-view').hidden = !spaceVisible;
  pressed(byId('space'), spaceVisible);
  byId('space').textContent = spaceVisible ? 'Xem logo' : 'Khoảng trống';
  logoScale.disabled = spaceVisible;
  for (const button of select('.switch [data-tone]')) pressed(button, button.dataset.tone === tone);
  for (const button of select('#feature-buttons button')) button.hidden = !available.includes(button.dataset.feature);
  choosePart(available.includes(currentPart) ? currentPart : available[0]);
}
byId('space').addEventListener('click', () => { spaceVisible = !spaceVisible; renderLogo(); });
logoScale.addEventListener('input', () => {
  byId('logo-frame').style.setProperty('--scale', Number(logoScale.value) / 100);
  byId('scale-value').value = logoScale.value + '%';
  drawLeaders();
});
select('.switch [data-tone]').forEach(button => button.addEventListener('click', () => { tone = button.dataset.tone; renderLogo(); }));
select('[data-feature]').forEach(button => button.addEventListener('click', () => choosePart(button.dataset.feature)));
renderLogo();

const palette = [
  { name: 'Ocean Teal', value: '#35858A' },
  { name: 'Champagne Gold', value: '#B69A68' },
  { name: 'Soft Ivory', value: '#FAF8F2' },
  { name: 'Teal đậm', value: '#28686C' },
  { name: 'Mực teal', value: '#173537' },
  { name: 'Trắng', value: '#FFFFFF' }
];
const fg = byId('fg');
const bg = byId('bg');
const typeSample = byId('type-sample');
const sampleText = byId('sample-text');

async function copyHex(hex) {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(hex);
    byId('copy-message').textContent = 'Đã sao chép ' + hex;
  } catch {
    const fallback = document.createElement('textarea');
    fallback.value = hex;
    fallback.setAttribute('readonly', '');
    fallback.style.cssText = 'position:fixed;left:-999px;top:0';
    const returnFocus = document.activeElement;
    document.body.append(fallback);
    fallback.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Copy is optional on file URLs. */ }
    fallback.remove();
    returnFocus?.focus();
    byId('copy-message').textContent = copied ? 'Đã sao chép ' + hex : 'Mã màu: ' + hex;
  }
}

for (const color of palette) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'swatch';
  button.setAttribute('aria-label', 'Sao chép ' + color.name + ' ' + color.value);
  button.style.setProperty('--chip', color.value);
  button.innerHTML = '<span class="swatch-chip"></span><span class="swatch-info"><b>' + color.name + '</b><code>' + color.value + '</code></span>';
  button.addEventListener('click', () => copyHex(color.value));
  byId('swatches').append(button);
  fg.add(new Option(color.name, color.value));
  bg.add(new Option(color.name, color.value));
}
fg.value = '#173537';
bg.value = '#FAF8F2';

function luminance(hex) {
  const weights = [0.2126, 0.7152, 0.0722];
  return hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
    .reduce((sum, channel, i) => sum + weights[i] * (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4), 0);
}
function updateType() {
  for (const heading of select('.sample-heading')) heading.textContent = sampleText.value.trim() || 'Một kỳ nghỉ ở Bãi Cháy';
  typeSample.style.color = fg.value;
  typeSample.style.background = bg.value;
  for (const button of select('#color-presets button')) {
    pressed(button, button.dataset.fg === fg.value && button.dataset.bg === bg.value);
  }
  const light = [luminance(fg.value), luminance(bg.value)].sort((a, b) => b - a);
  const ratio = (light[0] + 0.05) / (light[1] + 0.05);
  let verdict = 'dưới ngưỡng AA cho chữ';
  if (ratio >= 4.5) verdict = 'đạt AA cho chữ thường';
  else if (ratio >= 3) verdict = 'đạt AA cho chữ lớn';
  byId('contrast-result').textContent = ratio.toFixed(2).replace('.', ',') + ':1 · ' + verdict;
}
const presets = [
  ['Nền ngà, chữ mực teal', '#173537', '#FAF8F2'],
  ['Nền teal đậm, chữ trắng', '#FFFFFF', '#28686C'],
  ['Nền mực teal, chữ ngà', '#FAF8F2', '#173537']
];
for (const [name, fore, back] of presets) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = name;
  button.setAttribute('aria-label', name);
  button.dataset.fg = fore;
  button.dataset.bg = back;
  button.style.setProperty('--sample-fg',fore);
  button.style.setProperty('--sample-bg',back);
  button.addEventListener('click', () => { fg.value = fore; bg.value = back; updateType(); });
  byId('color-presets').append(button);
}
for (const element of [fg, bg, sampleText]) element.addEventListener('input', updateType);
updateType();

const specimen = byId('specimen-rows');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const vietnamese = 'AĂÂEÊIOÔƠUƯY';
const accentMarks = ['\u0300','\u0301','\u0303','\u0309','\u0323'];
function addGlyphRow(label, groups) {
  const row = document.createElement('div');
  const title = document.createElement('h4');
  title.textContent = label;
  const text = document.createElement('p');
  for (const group of groups) {
    const span = document.createElement('span');
    span.textContent = group;
    text.append(span);
  }
  row.append(title, text);
  specimen.append(row);
}
addGlyphRow('Chữ hoa', [...alphabet]);
addGlyphRow('Chữ thường', [...alphabet.toLowerCase()]);
addGlyphRow('Chữ cái tiếng Việt', [...'ĂÂĐÊÔƠƯăâđêôơư']);
for (const [label, letters] of [['Dấu tiếng Việt · Chữ hoa', vietnamese], ['Dấu tiếng Việt · Chữ thường', vietnamese.toLowerCase()]]) {
  addGlyphRow(label, [...letters].map(letter => [letter, ...accentMarks.map(mark => (letter + mark).normalize('NFC'))].join(' ')));
}
addGlyphRow('Chữ số và dấu câu', [...'0123456789.,:;!?()/-–’&%@']);
select('#specimen-weights button').forEach(button => button.addEventListener('click', () => {
  specimen.style.fontWeight = button.dataset.weight;
  for (const other of select('#specimen-weights button')) pressed(other, other === button);
}));

const applications = [
  ['Biển mặt tiền ngày và đêm','Biển hiệu','LanVie_Bien_mat_tien_v01.svg','Mời quý khách chọn cách thể hiện ban ngày và ban đêm. Vị trí biển tham chiếu phối cảnh Artéco. Kích thước, vật liệu và ánh sáng sẽ được xác nhận tại công trình.'],
  ['Thẻ phòng và bao thẻ','Ấn phẩm lễ tân','LanVie_The_phong_va_bao_the_v01.svg','Mời quý khách xác nhận cách bố trí logo trên thẻ và phần thông tin lễ tân trên bao thẻ.'],
  ['Danh thiếp và giấy tiêu đề','Ấn phẩm lễ tân','LanVie_Danh_thiep_va_giay_tieu_de_v01.svg','Duyệt tên pháp lý, định dạng chức danh, thông tin liên hệ và mẫu in đúng khổ.'],
  ['Chỉ dẫn, số tầng và số phòng','Biển hiệu','LanVie_Chi_dan_va_so_phong_v01.svg','Kiểm tra các điểm đến, mũi tên và số phòng theo mặt bằng được duyệt.'],
  ['Bao bì tiện ích','Phòng nghỉ','LanVie_Bao_bi_tien_ich_v01.svg','Mời quý khách chọn nhóm vật phẩm sẽ sử dụng. Quy cách chai, hộp và nội dung nhãn sẽ được hoàn thiện theo nhà cung cấp.'],
  ['Thẻ thông tin và biển treo cửa','Phòng nghỉ','LanVie_The_thong_tin_va_bien_treo_cua_v01.svg','Duyệt giờ trả phòng, kênh hỗ trợ và khe treo theo tay nắm thật.'],
  ['Đồng phục lễ tân','Đồng phục','LanVie_Dong_phuc_Le_tan_v01.svg','Mặt trước và mặt sau theo phom đề xuất. Duyệt vải, vị trí ghim và thẻ tên.'],
  ['Đồng phục buồng phòng','Đồng phục','LanVie_Dong_phuc_Buong_phong_v01.svg','Duyệt độ thoải mái của phom, độ đọc của biểu tượng thêu và mẫu sau khi thử giặt.']
];
const networks = [
  ['Bài đăng dọc','1080 × 1350 px','LanVie_Bai_dang_v01.png','Mẫu bài giới thiệu khách sạn. Hình ảnh là phối cảnh Artéco.'],
  ['Story','1080 × 1920 px','LanVie_Story_v01.png','Mẫu giới thiệu không gian tầng mái. Hình ảnh là phối cảnh Artéco.'],
  ['Ảnh đại diện','1080 × 1080 px','LanVie_Avatar_v01.png','Biểu tượng AV trên nền Ocean Teal.'],
  ['Ảnh bìa','1640 × 624 px','LanVie_Anh_bia_v01.png','Ảnh bìa kết hợp tên điểm đến với phối cảnh lối vào. Vùng cắt sẽ được kiểm tra theo kênh đăng.']
];
const viewer = byId('viewer');
const stage = byId('viewer-stage');
let shown = [];
let index = 0;
let origin = null;

function showItem() {
  const [title,, filename, note] = shown[index];
  byId('viewer-title').textContent = title;
  byId('viewer-note').textContent = note;
  byId('viewer-image').src = assets + filename;
  byId('viewer-image').alt = title;
  stage.dataset.kind = filename.includes('Website_') ? (filename.includes('mobile') ? 'mobile' : 'desktop') : 'design';
  byId('viewer-prev').disabled = index === 0;
  byId('viewer-next').disabled = index === shown.length - 1;
  stage.classList.remove('zoom');
  stage.scrollTo(0, 0);
  pressed(byId('viewer-zoom'), false);
  byId('viewer-zoom').textContent = 'Phóng to';
}
function showViewer(items, i, from) {
  shown = items;
  index = i;
  origin = from;
  showItem();
  viewer.showModal();
}
function moveViewer(by) {
  const next = index + by;
  if (next >= 0 && next < shown.length) { index = next; showItem(); }
}
byId('viewer-prev').addEventListener('click', () => moveViewer(-1));
byId('viewer-next').addEventListener('click', () => moveViewer(1));
byId('viewer-zoom').addEventListener('click', event => {
  const enlarged = stage.classList.toggle('zoom');
  pressed(event.currentTarget, enlarged);
  event.currentTarget.textContent = enlarged ? 'Thu nhỏ' : 'Phóng to';
  if (!enlarged) stage.scrollTo(0,0);
});
viewer.addEventListener('close', () => origin?.focus());

function renderCards(container, items) {
  container.replaceChildren();
  items.forEach(([title, category, filename], i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card';
    button.setAttribute('aria-label', 'Mở mẫu ' + title);
    const preview = document.createElement('img');
    preview.loading = 'lazy';
    preview.src = assets + filename;
    preview.alt = '';
    const details = document.createElement('div');
    details.className = 'card-meta';
    const heading = document.createElement('b');
    heading.textContent = title;
    const subtitle = document.createElement('span');
    subtitle.textContent = category;
    details.append(heading, subtitle);
    button.append(preview, details);
    button.addEventListener('click', () => showViewer(items, i, button));
    container.append(button);
  });
}
const filters = ['Tất cả','Ấn phẩm lễ tân','Biển hiệu','Phòng nghỉ','Đồng phục'];
for (const choice of filters) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = choice;
  pressed(button, choice === 'Tất cả');
  button.addEventListener('click', () => {
    for (const other of select('#filters button')) pressed(other, other === button);
    renderCards(byId('gallery'), choice === 'Tất cả' ? applications : applications.filter(item => item[1] === choice));
  });
  byId('filters').append(button);
}
renderCards(byId('gallery'), applications);
let socialIndex = 0;
function chooseSocial(i) {
  socialIndex = i;
  const [title, size, file, note] = networks[i];
  byId('social-name').textContent = title + ' · ' + size;
  byId('social-note').textContent = note;
  byId('social-image').src = assets + file;
  byId('social-image').alt = 'Mẫu ' + title.toLowerCase() + ' của L’AnVie';
  byId('social-preview').dataset.format = ['post','story','avatar','cover'][i];
  select('#social-gallery button').forEach((button, index) => pressed(button,i === index));
}
for (const [i, [title, size, file]] of networks.entries()) {
  const button = document.createElement('button');
  button.type = 'button';
  const thumbnail = document.createElement('img');
  thumbnail.src = assets + file;
  thumbnail.alt = '';
  const label = document.createElement('span');
  label.textContent = title;
  const dimensions = document.createElement('small');
  dimensions.textContent = size;
  button.append(thumbnail,label,dimensions);
  button.addEventListener('click', () => chooseSocial(i));
  byId('social-gallery').append(button);
}
chooseSocial(0);
for (const id of ['social-preview','social-open']) {
  byId(id).addEventListener('click', event => showViewer(networks,socialIndex,event.currentTarget));
}

const websiteItems = [
  ['Website trên máy tính','', 'LanVie_Website_desktop_v01.png','Duyệt phần mở đầu, hình ảnh công trình và mức độ nổi bật của nút đặt phòng. Cuộn để xem toàn trang.'],
  ['Website trên điện thoại','', 'LanVie_Website_mobile_v01.png','Duyệt thứ tự nội dung và khả năng nhận ra nút đặt phòng trên màn hình hẹp. Cuộn để xem toàn trang.']
];
byId('website-preview').addEventListener('click', event => {
  showViewer(websiteItems, event.currentTarget.dataset.device === 'desktop' ? 0 : 1, event.currentTarget);
});

select('[data-device]', document.querySelector('.webshow .switch')).forEach(button => button.addEventListener('click', () => {
  const device = button.dataset.device;
  for (const other of select('.webshow .switch button')) pressed(other, other === button);
  byId('website-preview').dataset.device = device;
  byId('website-image').src = assets + 'LanVie_Website_' + device + '_v01.png';
  byId('website-image').alt = device === 'desktop' ? 'Mockup website trên máy tính' : 'Mockup website trên điện thoại';
}));

const chapters = select('.chapter');
let chapter = 0;
let presenting = false;
function syncChapter() {
  byId('chapter-name').textContent = chapters[chapter].dataset.chapter;
  byId('prev-chapter').disabled = chapter === 0;
  byId('next-chapter').disabled = chapter === chapters.length - 1;
}
function jump(to) {
  chapter = Math.min(chapters.length - 1, Math.max(0,to));
  syncChapter();
  chapters[chapter].scrollIntoView({ behavior: 'instant' });
}
function setPresent(on) {
  presenting = on;
  pressed(byId('present'), on);
  document.body.classList.toggle('presentation', on);
  byId('present-controls').hidden = !on;
  if (on) {
    const current = chapters.findLastIndex(section => section.getBoundingClientRect().top < 155);
    chapter = Math.max(0, current);
    jump(chapter);
  } else byId('present').focus();
}
byId('present').addEventListener('click', () => setPresent(!presenting));
byId('end-present').addEventListener('click', () => setPresent(false));
byId('prev-chapter').addEventListener('click', () => jump(chapter - 1));
byId('next-chapter').addEventListener('click', () => jump(chapter + 1));
window.addEventListener('scroll', () => {
  if (!presenting) return;
  const reached = chapters.findLastIndex(section => section.getBoundingClientRect().top < 155);
  if (reached >= 0 && reached !== chapter) { chapter = reached; syncChapter(); }
}, { passive: true });
document.addEventListener('keydown', event => {
  if (event.target.matches('input, select, textarea, [contenteditable]')) return;
  if (viewer.open) {
    if (event.key === 'ArrowRight') moveViewer(1);
    if (event.key === 'ArrowLeft') moveViewer(-1);
    return;
  }
  if (!presenting) return;
  if (event.key === 'Escape') setPresent(false);
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    jump(chapter + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
