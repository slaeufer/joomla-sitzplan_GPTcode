<?php

declare(strict_types=1);

defined('_JEXEC') or die;
?>
<div id="com-sitzplan-app">
    <header>
        <div>
            <h1>🪑 <?php echo $this->escape($this->title); ?></h1>
            <div class="sub"><?php echo $this->escape($this->subtitle); ?></div>
        </div>
        <div class="mode-row">
            <span class="mode-label">Modus:</span>
            <button class="mode-btn admin active" onclick="setMode('admin')">👤 Admin</button>
            <button class="mode-btn helfer" onclick="setMode('helfer')">👁️ Helfer</button>
        </div>
    </header>

    <div class="layout">
        <aside>
            <div>
                <h2>Raumkonfiguration</h2>
                <div class="cfg-grid">
                    <div><label>Reihen</label><input id="cR" type="number" value="8" min="1" max="30"></div>
                    <div><label>Sitze links</label><input id="cL" type="number" value="6" min="1" max="20"></div>
                    <div><label>Sitze rechts</label><input id="cRR" type="number" value="6" min="1" max="20"></div>
                    <div><label>Gang (px)</label><input id="cG" type="number" value="44" min="10" max="120"></div>
                </div>
                <button class="btn-build" onclick="rebuild()">↺ Saal neu aufbauen</button>
            </div>

            <div>
                <h2>Sonderbereiche</h2>
                <div class="zone-list" id="zoneList"></div>

                <div class="add-zone-form space-top">
                    <div>
                        <label>Bezeichnung</label>
                        <input id="zName" type="text" placeholder="z.B. Ehrenreihe, Orchester">
                    </div>
                    <div class="cfg-grid">
                        <div>
                            <label>Anzahl Stühle</label>
                            <input id="zCount" type="number" value="5" min="1" max="30">
                        </div>
                        <div>
                            <label>Position</label>
                            <select id="zPos">
                                <option value="vorne">Vorne</option>
                                <option value="hinten">Hinten</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>Geschlecht-Regel</label>
                        <select id="zGender">
                            <option value="offen">Offen (M &amp; F)</option>
                            <option value="M">Nur Männer</option>
                            <option value="F">Nur Frauen</option>
                        </select>
                    </div>
                    <button class="btn-addzone" onclick="addZone()">+ Bereich hinzufügen</button>
                </div>
            </div>

            <div>
                <h2>Legende</h2>
                <div class="legend">
                    <div class="leg"><div class="ldot free"></div>Frei (Hauptraster)</div>
                    <div class="leg"><div class="ldot male"></div>Mann (links)</div>
                    <div class="leg"><div class="ldot female"></div>Frau (rechts)</div>
                    <div class="leg"><div class="ldot female-left"></div>Frau links (Überlauf)</div>
                    <div class="leg"><div class="ldot front"></div>Sonderbereich vorne</div>
                    <div class="leg"><div class="ldot back"></div>Sonderbereich hinten</div>
                </div>
            </div>

            <div>
                <h2>Belegung</h2>
                <div class="stats">
                    <div class="sbox sm"><div class="n" id="sM">0</div><div class="l">Männer</div></div>
                    <div class="sbox sf"><div class="n" id="sF">0</div><div class="l">Frauen</div></div>
                    <div class="sbox sfr"><div class="n" id="sFr">0</div><div class="l">Frei</div></div>
                    <div class="sbox sg"><div class="n" id="sG">0</div><div class="l">Gesamt</div></div>
                </div>
                <div class="warn-box" id="wOv">⚠️ Mehr Frauen als Männer — hintere Reihen links als Überlauf freigegeben.</div>
            </div>

            <div>
                <h2>Teilnehmer</h2>
                <div class="plist" id="pList"></div>
            </div>
        </aside>

        <main>
            <div class="stage">🎭 Bühne — Vorne</div>
            <div id="svg-wrap"></div>
        </main>
    </div>

    <div class="overlay" id="overlay">
        <div class="popup">
            <h3 id="pTitle"></h3>
            <div class="pinfo" id="pInfo"></div>
            <div id="pBody"></div>
        </div>
    </div>
</div>
