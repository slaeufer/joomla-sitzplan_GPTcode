(() => {
'use strict';

const TN = [
  { id: 1, name: 'Ahmad Karimi', g: 'M' },
  { id: 2, name: 'Fatima Al-Rashid', g: 'F' },
  { id: 3, name: 'Yusuf Demir', g: 'M' },
  { id: 4, name: 'Maryam Hosseini', g: 'F' },
  { id: 5, name: 'Ibrahim Sahin', g: 'M' },
  { id: 6, name: 'Aisha Nasser', g: 'F' },
  { id: 7, name: 'Omar Benali', g: 'M' },
  { id: 8, name: 'Zainab Malik', g: 'F' },
  { id: 9, name: 'Tariq Mansour', g: 'M' },
  { id: 10, name: 'Hana Bergmann', g: 'F' },
  { id: 11, name: 'Karim El-Amin', g: 'M' },
  { id: 12, name: 'Leila Ozdemir', g: 'F' },
  { id: 13, name: 'Bilal Rahman', g: 'M' },
  { id: 14, name: 'Samira Tounsi', g: 'F' },
  { id: 15, name: 'Hassan Al-Farsi', g: 'M' },
  { id: 16, name: 'Nour Abdallah', g: 'F' },
  { id: 17, name: 'Mustafa Celik', g: 'M' },
  { id: 18, name: 'Rania Khalil', g: 'F' },
];

let seats = {};
let zones = [];
let mode = 'admin';
let sel = null;

const SW = 34;
const SH = 28;
const GAP = 5;
const NS = 'http://www.w3.org/2000/svg';
let zoneIdCtr = 0;

const cfg = () => ({
  rows: +document.getElementById('cR').value || 8,
  left: +document.getElementById('cL').value || 6,
  right: +document.getElementById('cRR').value || 6,
  aisle: +document.getElementById('cG').value || 44,
});

function setMode(m) {
  mode = m;
  document.querySelector('#com-sitzplan-app .mode-btn.admin').classList.toggle('active', m === 'admin');
  document.querySelector('#com-sitzplan-app .mode-btn.helfer').classList.toggle('active', m === 'helfer');
  render();
}

function rebuild() {
  if (Object.keys(seats).length > 0 && !window.confirm('Neuaufbau setzt alle Zuweisungen zurueck. Fortfahren?')) return;
  seats = {};
  render(); renderList(); stats();
}

function addZone() {
  const name = document.getElementById('zName').value.trim();
  const count = +document.getElementById('zCount').value || 5;
  const pos = document.getElementById('zPos').value;
  const gender = document.getElementById('zGender').value;
  if (!name) { window.alert('Bitte eine Bezeichnung eingeben.'); return; }

  zones.push({ id: ++zoneIdCtr, name, count, pos, gender });
  document.getElementById('zName').value = '';
  renderZoneList();
  render(); renderList(); stats();
}

function removeZone(id) {
  if (!window.confirm('Bereich loeschen? Alle Zuweisungen in diesem Bereich gehen verloren.')) return;
  Object.keys(seats).forEach((k) => { if (k.startsWith(`Z${id}_`)) delete seats[k]; });
  zones = zones.filter((z) => z.id !== id);
  renderZoneList();
  render(); renderList(); stats();
}

function renderZoneList() {
  const el = document.getElementById('zoneList');
  if (!zones.length) {
    el.innerHTML = '<div class="empty-state">Noch keine Sonderbereiche.</div>';
    return;
  }

  el.innerHTML = zones.map((z) => {
    const belegt = Object.keys(seats).filter((k) => k.startsWith(`Z${z.id}_`)).length;
    return `<div class="zone-item"><div class="ztop"><span class="zone-label">${z.name}</span><div class="zone-actions"><span class="zone-badge ${z.pos}">${z.pos}</span>${mode === 'admin' ? `<button class="zone-del" onclick="removeZone(${z.id})" title="Loeschen">✕</button>` : ''}</div></div><div class="zone-info">${z.count} Stuehle &bull; ${z.gender === 'offen' ? 'M &amp; F' : z.gender} &bull; ${belegt}/${z.count} belegt</div></div>`;
  }).join('');
}

function ovRows(c) {
  const f = Object.values(seats).filter((s) => s.g === 'F').length;
  const m = Object.values(seats).filter((s) => s.g === 'M').length;
  const diff = Math.max(0, f - m);
  const rows = [];
  if (diff > 0) {
    const n = Math.ceil(diff / c.left);
    for (let i = 0; i < n; i += 1) rows.push(c.rows - i);
  }
  return rows;
}

function render() {
  const c = cfg();
  const ov = ovRows(c);
  const blkL = c.left * (SW + GAP) - GAP;
  const blkR = c.right * (SW + GAP) - GAP;
  const offX = 44;
  const saalW = offX + blkL + c.aisle + blkR + 10;

  const zonesVorne = zones.filter((z) => z.pos === 'vorne');
  const zonesHinten = zones.filter((z) => z.pos === 'hinten');

  const zoneH = (zList) => (zList.length ? zList.length * (SH + GAP + 18) + 10 : 0);
  const vorneH = zoneH(zonesVorne);
  const hintenH = zoneH(zonesHinten);
  const hauptH = 22 + c.rows * (SH + GAP + 4) + 8;
  const totalH = vorneH + hauptH + hintenH + 10;
  const totalW = Math.max(saalW, 400);

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', totalW);
  svg.setAttribute('height', totalH);
  svg.style.display = 'block';

  let curY = 0;

  if (zonesVorne.length) {
    tx(svg, offX, curY + 12, 'Sonderbereiche vorne', '#8e44ad', 10, true, 'start');
    curY += 18;
    zonesVorne.forEach((z) => {
      curY = drawZone(svg, z, offX, curY, saalW);
    });
    curY += 6;
    drawLine(svg, offX, curY, saalW - 10, curY, '#c5cad5');
    curY += 8;
  }

  tx(svg, offX + blkL / 2, curY + 14, 'Maenner (links)', '#2980b9', 11, true);
  tx(svg, offX + blkL + c.aisle + blkR / 2, curY + 14, 'Frauen (rechts)', '#c0392b', 11, true);
  curY += 18;

  for (let r = 1; r <= c.rows; r += 1) {
    const y = curY + (r - 1) * (SH + GAP + 4);
    const isOv = ov.includes(r);
    tx(svg, offX - 6, y + SH / 2 + 4, String(r), '#bbb', 10, false, 'end');

    for (let s = 1; s <= c.left; s += 1) {
      drawSeat(svg, offX + (s - 1) * (SW + GAP), y, `R${r}_L${s}`, 'L', r, s, isOv);
    }

    if (r === 1) tx(svg, offX + blkL + c.aisle / 2, y + SH / 2 + 4, 'Gang', '#ccc', 10, false, 'middle');

    for (let s = 1; s <= c.right; s += 1) {
      drawSeat(svg, offX + blkL + c.aisle + (s - 1) * (SW + GAP), y, `R${r}_R${s}`, 'R', r, s, false);
    }

    if (isOv) tx(svg, offX + blkL + c.aisle / 2, y + SH / 2 + 4, 'Ueberlauf', '#e67e22', 8, false, 'middle');
  }

  curY += c.rows * (SH + GAP + 4) + 4;

  if (zonesHinten.length) {
    drawLine(svg, offX, curY, saalW - 10, curY, '#c5cad5');
    curY += 8;
    tx(svg, offX, curY + 12, 'Sonderbereiche hinten', '#16a085', 10, true, 'start');
    curY += 18;
    zonesHinten.forEach((z) => {
      curY = drawZone(svg, z, offX, curY, saalW);
    });
  }

  const wrap = document.getElementById('svg-wrap');
  wrap.innerHTML = '';
  wrap.appendChild(svg);
  stats();
  renderZoneList();
}

function drawZone(svg, z, offX, startY, saalW) {
  const baseColor = z.pos === 'vorne' ? '#8e44ad' : '#16a085';
  tx(svg, offX, startY + 10, z.name, baseColor, 9, true, 'start');

  const y = startY + 14;
  const totalSeatW = z.count * (SW + GAP) - GAP;
  const saalUsable = saalW - offX - 10;
  const startX = offX + Math.max(0, (saalUsable - totalSeatW) / 2);

  for (let s = 1; s <= z.count; s += 1) {
    const x = startX + (s - 1) * (SW + GAP);
    const key = `Z${z.id}_S${s}`;
    const occ = seats[key];

    let fill = z.pos === 'vorne' ? '#e8d5f5' : '#d0ede8';
    if (occ) fill = occ.g === 'M' ? '#2980b9' : '#c0392b';

    const g = document.createElementNS(NS, 'g');
    g.style.cursor = mode === 'admin' ? 'pointer' : 'default';

    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', SW); rect.setAttribute('height', SH);
    rect.setAttribute('rx', 5); rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', occ ? 'rgba(0,0,0,.15)' : baseColor);
    rect.setAttribute('stroke-width', '1.5');
    rect.setAttribute('stroke-dasharray', occ ? 'none' : '4,3');

    g.addEventListener('mouseenter', () => rect.setAttribute('opacity', '.75'));
    g.addEventListener('mouseleave', () => rect.setAttribute('opacity', '1'));

    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', x + SW / 2); lbl.setAttribute('y', y + SH / 2 + 4);
    lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('font-size', '9');
    lbl.setAttribute('fill', occ ? '#fff' : baseColor);
    lbl.setAttribute('pointer-events', 'none');
    lbl.setAttribute('font-family', 'Segoe UI,Arial,sans-serif');
    lbl.textContent = occ ? occ.name.split(' ').map((p) => p[0]).join('').substring(0, 2).toUpperCase() : String(s);

    const title = document.createElementNS(NS, 'title');
    title.textContent = occ ? `${occ.name} | ${z.name}, Stuhl ${s}` : `${z.name}, Stuhl ${s} — frei`;

    g.appendChild(title); g.appendChild(rect); g.appendChild(lbl);

    if (mode === 'admin') g.addEventListener('click', () => openZonePopup(key, z, s));

    svg.appendChild(g);
  }

  return y + SH + 8;
}

function drawLine(svg, x1, y1, x2, y2, color) {
  const line = document.createElementNS(NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '1');
  line.setAttribute('stroke-dasharray', '6,4');
  svg.appendChild(line);
}

function drawSeat(svg, x, y, key, side, row, pos, isOv) {
  const occ = seats[key];
  let fill = '#dde1e9';
  if (occ) fill = occ.g === 'M' ? '#2980b9' : (side === 'R' ? '#c0392b' : '#e67e22');
  else if (isOv && side === 'L') fill = '#fde8d0';

  const g = document.createElementNS(NS, 'g');
  g.style.cursor = mode === 'admin' ? 'pointer' : 'default';

  const rect = document.createElementNS(NS, 'rect');
  rect.setAttribute('x', x); rect.setAttribute('y', y);
  rect.setAttribute('width', SW); rect.setAttribute('height', SH);
  rect.setAttribute('rx', 5); rect.setAttribute('fill', fill);
  rect.setAttribute('stroke', occ ? 'rgba(0,0,0,.15)' : '#c8cdd8');
  rect.setAttribute('stroke-width', '1');

  g.addEventListener('mouseenter', () => rect.setAttribute('opacity', '.75'));
  g.addEventListener('mouseleave', () => rect.setAttribute('opacity', '1'));

  const lbl = document.createElementNS(NS, 'text');
  lbl.setAttribute('x', x + SW / 2); lbl.setAttribute('y', y + SH / 2 + 4);
  lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('font-size', '9');
  lbl.setAttribute('fill', occ ? '#fff' : '#aaa');
  lbl.setAttribute('pointer-events', 'none');
  lbl.setAttribute('font-family', 'Segoe UI,Arial,sans-serif');
  lbl.textContent = occ ? occ.name.split(' ').map((p) => p[0]).join('').substring(0, 2).toUpperCase() : `${row}.${pos}`;

  const title = document.createElementNS(NS, 'title');
  title.textContent = occ ? `${occ.name} | Reihe ${row}, Platz ${pos} ${side === 'L' ? 'links' : 'rechts'}` : `Reihe ${row}, Platz ${pos} ${side === 'L' ? 'links' : 'rechts'} — frei`;

  g.appendChild(title); g.appendChild(rect); g.appendChild(lbl);
  if (mode === 'admin') g.addEventListener('click', () => openPopup(key, side, row, pos, isOv));
  svg.appendChild(g);
}

function tx(svg, x, y, text, fill, size, bold, anchor = 'middle') {
  const t = document.createElementNS(NS, 'text');
  t.setAttribute('x', x); t.setAttribute('y', y);
  t.setAttribute('text-anchor', anchor);
  t.setAttribute('font-size', size); t.setAttribute('fill', fill);
  t.setAttribute('font-family', 'Segoe UI,Arial,sans-serif');
  if (bold) t.setAttribute('font-weight', 'bold');
  t.textContent = text; svg.appendChild(t);
}

function openPopup(key, side, row, pos, isOv) {
  sel = { key, side, row, pos, isOv, zone: null };
  const occ = seats[key];
  document.getElementById('pTitle').textContent = occ ? 'Sitzplatz bearbeiten' : 'Sitzplatz zuweisen';
  document.getElementById('pInfo').textContent = `Reihe ${row}, Platz ${pos} ${side === 'L' ? 'links' : 'rechts'}`;

  const taken = new Set(Object.values(seats).map((s) => s.id));
  const avail = TN.filter((p) => !taken.has(p.id) || (occ && occ.id === p.id));
  const rec = side === 'R' ? 'F' : (isOv ? 'F' : 'M');
  buildPopupBody(avail, rec, occ, '');
  document.getElementById('overlay').className = 'overlay on';
}

function openZonePopup(key, zone, sNum) {
  sel = { key, side: null, row: null, pos: sNum, isOv: false, zone };
  const occ = seats[key];
  document.getElementById('pTitle').textContent = occ ? 'Stuhl bearbeiten' : 'Stuhl zuweisen';
  document.getElementById('pInfo').textContent = `${zone.name}, Stuhl ${sNum}`;

  const taken = new Set(Object.values(seats).map((s) => s.id));
  const avail = TN.filter((p) => {
    if (taken.has(p.id) && !(occ && occ.id === p.id)) return false;
    if (zone.gender !== 'offen' && p.g !== zone.gender) return false;
    return true;
  });

  const rec = zone.gender === 'offen' ? null : zone.gender;
  const hint = zone.gender !== 'offen' ? `Dieser Bereich ist fuer ${zone.gender === 'M' ? 'Maenner' : 'Frauen'} reserviert.` : '';
  buildPopupBody(avail, rec, occ, hint);
  document.getElementById('overlay').className = 'overlay on';
}

function buildPopupBody(avail, rec, occ, hint) {
  const yes = rec ? avail.filter((p) => p.g === rec) : avail;
  const no = rec ? avail.filter((p) => p.g !== rec) : [];

  let opts = '<option value="">-- Bitte waehlen --</option>';
  if (yes.length) {
    const grpLabel = rec ? (rec === 'M' ? 'Maenner (empfohlen)' : 'Frauen (empfohlen)') : 'Alle Teilnehmer';
    opts += `<optgroup label="${grpLabel}">`;
    yes.forEach((p) => { opts += `<option value="${p.id}"${occ && occ.id === p.id ? ' selected' : ''}>${p.name} (${p.g})</option>`; });
    opts += '</optgroup>';
  }
  if (no.length) {
    opts += `<optgroup label="${rec === 'M' ? 'Frauen (Regelverstoss)' : 'Maenner (Regelverstoss)'}">`;
    no.forEach((p) => { opts += `<option value="${p.id}"${occ && occ.id === p.id ? ' selected' : ''}>${p.name} (${p.g})</option>`; });
    opts += '</optgroup>';
  }
  if (!yes.length && !no.length) opts += '<option disabled>Keine verfuegbaren Teilnehmer</option>';

  document.getElementById('pBody').innerHTML = `${hint ? `<div class="rule-warn on">${hint}</div>` : ''}<select id="pSel" onchange="chkRule(this)">${opts}</select><div class="rule-warn" id="rW"></div><div class="pactions"><button class="ba" onclick="assign()">✓ Zuweisen</button>${occ ? '<button class="bf" onclick="freeSeat()">✕ Freigeben</button>' : ''}<button class="bc" onclick="closePopup()">Abbrechen</button></div>`;
}

function chkRule(el) {
  if (!sel) return;
  const p = TN.find((t) => t.id === +el.value);
  if (!p) return;
  const w = document.getElementById('rW');
  let msg = '';

  if (sel.zone) {
    if (sel.zone.gender !== 'offen' && p.g !== sel.zone.gender) msg = `⚠️ Dieser Bereich ist fuer ${sel.zone.gender === 'M' ? 'Maenner' : 'Frauen'} reserviert!`;
  } else if (sel.side === 'L' && !sel.isOv && p.g === 'F') msg = '⚠️ Frau links — nur bei Ueberlauf-Reihen erlaubt!';
  else if (sel.side === 'R' && p.g === 'M') msg = '⚠️ Mann auf Frauenseite — Regelverstoss!';

  w.innerHTML = msg;
  w.className = `rule-warn${msg ? ' on' : ''}`;
}

function assign() {
  const pid = +document.getElementById('pSel').value;
  if (!pid) { window.alert('Bitte eine Person auswaehlen.'); return; }
  const p = TN.find((t) => t.id === pid);
  seats[sel.key] = { id: p.id, name: p.name, g: p.g };
  closePopup(); render(); renderList(); stats();
}

function freeSeat() {
  delete seats[sel.key];
  closePopup(); render(); renderList(); stats();
}

function closePopup() {
  document.getElementById('overlay').className = 'overlay';
  sel = null;
}

function stats() {
  const c = cfg();
  const all = Object.values(seats);
  const m = all.filter((s) => s.g === 'M').length;
  const f = all.filter((s) => s.g === 'F').length;
  const zoneTotal = zones.reduce((sum, z) => sum + z.count, 0);
  const tot = c.rows * (c.left + c.right) + zoneTotal;
  document.getElementById('sM').textContent = m;
  document.getElementById('sF').textContent = f;
  document.getElementById('sFr').textContent = tot - all.length;
  document.getElementById('sG').textContent = tot;
  document.getElementById('wOv').className = `warn-box${f > m ? ' on' : ''}`;
}

function renderList() {
  const taken = new Set(Object.values(seats).map((s) => s.id));
  document.getElementById('pList').innerHTML = TN.map((p) => {
    const done = taken.has(p.id);
    const seatKey = Object.keys(seats).find((k) => seats[k].id === p.id);
    let wo = '';
    if (seatKey) {
      if (seatKey.startsWith('Z')) {
        const zid = +seatKey.split('_')[0].replace('Z', '');
        const z = zones.find((zone) => zone.id === zid);
        wo = z ? ` (${z.name})` : '';
      } else {
        const m = seatKey.match(/R(\d+)_([LR])(\d+)/);
        if (m) wo = ` (R${m[1]} ${m[2] === 'L' ? 'li' : 're'})`;
      }
    }
    return `<div class="pitem ${done ? 'done' : 'open'}"><div class="pd" style="background:${p.g === 'M' ? '#2980b9' : '#c0392b'}"></div>${p.name}${done ? ` ✓${wo}` : ''}</div>`;
  }).join('');
}

function init() {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });

  zones.push({ id: ++zoneIdCtr, name: 'Ehrenreihe', count: 6, pos: 'vorne', gender: 'offen' });
  zones.push({ id: ++zoneIdCtr, name: 'Orchester', count: 8, pos: 'hinten', gender: 'M' });

  render(); renderList(); stats();
}

window.setMode = setMode;
window.rebuild = rebuild;
window.addZone = addZone;
window.removeZone = removeZone;
window.chkRule = chkRule;
window.assign = assign;
window.freeSeat = freeSeat;
window.closePopup = closePopup;

document.addEventListener('DOMContentLoaded', init);
})();
