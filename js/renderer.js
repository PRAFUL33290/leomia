'use strict';

class Renderer {
  constructor(ctx) { this.ctx = ctx; }

  clear() {
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, CW, CH);
  }

  tile(type, gx, gy, revealed) {
    const c = this.ctx;
    const px = gx * TS, py = gy * TS;
    switch (type) {
      case T.WALL:
        c.fillStyle = CLR.WALL;
        c.fillRect(px, py, TS, TS);
        c.fillStyle = CLR.WALL2;
        c.fillRect(px+2, py+2, TS-4, TS-4);
        c.fillStyle = CLR.WALL;
        c.fillRect(px+4, py+4, TS-8, TS-8);
        break;
      case T.FLOOR:
        c.fillStyle = CLR.FLOOR;
        c.fillRect(px, py, TS, TS);
        c.fillStyle = CLR.FLOOR2;
        c.fillRect(px, py, TS-1, TS-1);
        break;
      case T.DOOR:
        c.fillStyle = CLR.DOOR;
        c.fillRect(px, py, TS, TS);
        c.fillStyle = '#d4a040';
        c.fillRect(px+14, py+14, 12, 12);
        c.fillStyle = '#aa7020';
        c.beginPath(); c.arc(px+TS/2, py+TS/2, 5, 0, Math.PI*2); c.fill();
        break;
      case T.TRAP:
        c.fillStyle = CLR.FLOOR;
        c.fillRect(px, py, TS, TS);
        c.fillStyle = CLR.TRAP;
        for (let i = 0; i < 4; i++) {
          const sx = px + 5 + i * 8;
          c.beginPath();
          c.moveTo(sx, py+TS-4);
          c.lineTo(sx+3, py+6);
          c.lineTo(sx+6, py+TS-4);
          c.fill();
        }
        break;
      case T.INVIS:
        if (revealed) {
          c.fillStyle = '#b088cc';
          c.fillRect(px, py, TS, TS);
          c.fillStyle = '#cc99ee';
          c.fillRect(px+2, py+2, TS-4, TS-4);
        } else {
          c.fillStyle = CLR.FLOOR;
          c.fillRect(px, py, TS, TS);
          c.fillStyle = CLR.FLOOR2;
          c.fillRect(px, py, TS-1, TS-1);
        }
        break;
      case T.BREAK:
        c.fillStyle = CLR.BREAK;
        c.fillRect(px, py, TS, TS);
        c.fillStyle = '#8a6a5c';
        c.fillRect(px+2, py+2, TS-4, TS-4);
        c.strokeStyle = '#5a3a2c';
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(px+6,py+6); c.lineTo(px+20,py+24); c.stroke();
        c.beginPath(); c.moveTo(px+TS-8,py+8); c.lineTo(px+TS-22,py+TS-10); c.stroke();
        break;
      case T.PUSH:
        c.fillStyle = '#8888aa';
        c.fillRect(px, py, TS, TS);
        c.fillStyle = '#aaaacc';
        c.fillRect(px+3, py+3, TS-6, TS-6);
        break;
      default:
        c.fillStyle = CLR.FLOOR;
        c.fillRect(px, py, TS, TS);
        c.fillStyle = CLR.FLOOR2;
        c.fillRect(px, py, TS-1, TS-1);
    }
  }

  item(it, frame) {
    const c = this.ctx;
    const px = it.x * TS, py = it.y * TS;
    const bob = Math.sin(frame * 0.08) * 2;
    if (it.collected) return;

    switch (it.type) {
      case IT.KEY: {
        // Gold key
        c.fillStyle = CLR.KEY;
        c.beginPath(); c.arc(px+TS/2, py+12+bob, 7, 0, Math.PI*2); c.fill();
        c.strokeStyle = '#aa8800'; c.lineWidth = 2;
        c.beginPath(); c.arc(px+TS/2, py+12+bob, 7, 0, Math.PI*2); c.stroke();
        c.fillStyle = CLR.KEY;
        c.fillRect(px+TS/2-2, py+18+bob, 4, 14);
        c.fillRect(px+TS/2+2, py+24+bob, 5, 3);
        c.fillRect(px+TS/2+2, py+29+bob, 5, 3);
        break;
      }
      case IT.FRAGMENT: {
        // Cyan crystal gem
        const pulse = 0.85 + 0.15 * Math.sin(frame * 0.1);
        c.fillStyle = `rgba(0,220,255,${pulse})`;
        const cx = px+TS/2, cy = py+TS/2+bob;
        c.beginPath();
        c.moveTo(cx, cy-14); c.lineTo(cx+10, cy-2);
        c.lineTo(cx+10, cy+6); c.lineTo(cx, cy+14);
        c.lineTo(cx-10, cy+6); c.lineTo(cx-10, cy-2);
        c.closePath(); c.fill();
        c.strokeStyle = '#88ffff'; c.lineWidth = 1.5;
        c.stroke();
        c.fillStyle = 'rgba(255,255,255,0.5)';
        c.beginPath(); c.ellipse(cx-2, cy-4, 3, 5, -0.5, 0, Math.PI*2); c.fill();
        break;
      }
      case IT.CHECKPOINT: {
        // Green star
        c.fillStyle = CLR.CHECK;
        c.save(); c.translate(px+TS/2, py+TS/2+bob); c.rotate(frame*0.02);
        this._star(c, 0, 0, 12, 6, 5);
        c.restore();
        break;
      }
      case IT.TORCH: {
        c.fillStyle = '#886633';
        c.fillRect(px+TS/2-2, py+16+bob, 4, 16);
        c.fillStyle = CLR.TORCH;
        c.beginPath(); c.arc(px+TS/2, py+12+bob, 6, 0, Math.PI*2); c.fill();
        c.fillStyle = '#ffee88';
        c.beginPath(); c.arc(px+TS/2, py+11+bob, 3, 0, Math.PI*2); c.fill();
        break;
      }
      case IT.BOOTS: {
        c.fillStyle = '#4488dd';
        c.fillRect(px+8, py+14+bob, 10, 14);
        c.fillRect(px+22, py+14+bob, 10, 14);
        c.fillStyle = '#88bbff';
        c.fillRect(px+8, py+12+bob, 10, 4);
        c.fillRect(px+22, py+12+bob, 10, 4);
        break;
      }
      case IT.COMPASS: {
        c.strokeStyle = '#aaaaff'; c.lineWidth = 2;
        c.beginPath(); c.arc(px+TS/2, py+TS/2+bob, 12, 0, Math.PI*2); c.stroke();
        c.fillStyle = '#ff4444';
        c.save(); c.translate(px+TS/2, py+TS/2+bob); c.rotate(frame*0.03);
        c.beginPath(); c.moveTo(0,-10); c.lineTo(3,2); c.lineTo(-3,2); c.closePath(); c.fill();
        c.restore();
        break;
      }
      case IT.ORB: {
        const grd = c.createRadialGradient(px+TS/2-2, py+TS/2-2+bob, 2, px+TS/2, py+TS/2+bob, 12);
        grd.addColorStop(0, '#ee88ff');
        grd.addColorStop(1, '#660088');
        c.fillStyle = grd;
        c.beginPath(); c.arc(px+TS/2, py+TS/2+bob, 12, 0, Math.PI*2); c.fill();
        c.strokeStyle = '#cc66ff'; c.lineWidth = 1.5; c.stroke();
        break;
      }
      case IT.CRYSTAL: {
        c.fillStyle = CLR.CRYSTAL;
        c.beginPath(); c.arc(px+TS/2, py+TS/2+bob, 9, 0, Math.PI*2); c.fill();
        c.strokeStyle = '#aaccff'; c.lineWidth = 1; c.stroke();
        break;
      }
      case IT.SWITCH: {
        const on = it.on || false;
        c.fillStyle = on ? '#00cc44' : '#cc4400';
        c.fillRect(px+8, py+14, TS-16, TS-18);
        c.fillStyle = on ? '#00ff66' : '#ff6600';
        c.fillRect(px+12, py+10+bob, TS-24, 8);
        c.fillStyle = '#ffffff';
        c.font = '10px monospace';
        c.textAlign = 'center';
        c.fillText(on ? 'ON' : 'OFF', px+TS/2, py+24);
        break;
      }
    }
  }

  _star(c, cx, cy, outerR, innerR, points) {
    c.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / points - Math.PI / 2;
      if (i === 0) c.moveTo(cx + r*Math.cos(a), cy + r*Math.sin(a));
      else c.lineTo(cx + r*Math.cos(a), cy + r*Math.sin(a));
    }
    c.closePath(); c.fill();
  }

  player(p, frame, active) {
    const c = this.ctx;
    const px = p.x * TS, py = p.y * TS;
    const bob = active ? Math.sin(frame * 0.15) * 1 : 0;

    // invincibility flash
    if (p.invTimer > 0 && Math.floor(p.invTimer / 4) % 2 === 1) return;

    if (active) {
      // glow
      c.shadowColor = p.char === 'leo' ? CLR.LEO : CLR.MIA;
      c.shadowBlur = 10;
    }

    if (p.char === 'leo') {
      // Body (blue shirt)
      c.fillStyle = '#2266cc';
      c.fillRect(px+10, py+16+bob, 20, 16);
      // Head
      c.fillStyle = '#f4c080';
      c.beginPath(); c.arc(px+TS/2, py+11+bob, 9, 0, Math.PI*2); c.fill();
      // Brown hair
      c.fillStyle = '#663300';
      c.fillRect(px+11, py+3+bob, 18, 8);
      c.beginPath(); c.arc(px+TS/2, py+8+bob, 9, Math.PI, 0); c.fill();
      // Legs
      c.fillStyle = '#443300';
      c.fillRect(px+11, py+32+bob, 8, 6);
      c.fillRect(px+21, py+32+bob, 8, 6);
      // Sword
      c.fillStyle = '#cccccc';
      c.fillRect(px+30, py+16+bob, 3, 16);
      c.fillStyle = '#aa8800';
      c.fillRect(px+27, py+17+bob, 9, 3);
    } else {
      // Mia - purple dress
      c.fillStyle = '#9933cc';
      c.beginPath(); c.moveTo(px+10, py+16+bob); c.lineTo(px+30, py+16+bob);
      c.lineTo(px+33, py+32+bob); c.lineTo(px+7, py+32+bob); c.closePath(); c.fill();
      // Head
      c.fillStyle = '#f4c080';
      c.beginPath(); c.arc(px+TS/2, py+11+bob, 9, 0, Math.PI*2); c.fill();
      // Blonde hair
      c.fillStyle = '#ffdd44';
      c.fillRect(px+10, py+3+bob, 20, 8);
      c.beginPath(); c.arc(px+TS/2, py+8+bob, 10, Math.PI, 0); c.fill();
      c.fillRect(px+10, py+6+bob, 4, 14);
      c.fillRect(px+26, py+6+bob, 4, 14);
      // Staff
      c.fillStyle = '#884400';
      c.fillRect(px+30, py+10+bob, 3, 22);
      c.fillStyle = '#cc44ff';
      c.beginPath(); c.arc(px+32, py+9+bob, 5, 0, Math.PI*2); c.fill();
    }

    c.shadowBlur = 0;

    // HP hearts
    for (let i = 0; i < p.maxHp; i++) {
      c.fillStyle = i < p.hp ? '#ee2244' : '#441122';
      c.save(); c.translate(px + 2 + i*10, py - 1);
      this._heart(c, 0, 0, 4);
      c.restore();
    }
  }

  _heart(c, x, y, r) {
    c.beginPath();
    c.moveTo(x, y+r/2);
    c.bezierCurveTo(x, y-r, x-r*2, y-r, x-r*2, y+r/2);
    c.bezierCurveTo(x-r*2, y+r*1.5, x, y+r*2.5, x, y+r*3);
    c.bezierCurveTo(x, y+r*2.5, x+r*2, y+r*1.5, x+r*2, y+r/2);
    c.bezierCurveTo(x+r*2, y-r, x, y-r, x, y+r/2);
    c.fill();
  }

  enemy(e, frame) {
    const c = this.ctx;
    const px = e.x * TS, py = e.y * TS;
    const bob = Math.sin(frame * 0.12 + e.x) * 2;
    // Red blob enemy
    c.fillStyle = CLR.ENEMY;
    c.beginPath(); c.arc(px+TS/2, py+TS/2+bob, 13, 0, Math.PI*2); c.fill();
    c.fillStyle = '#ff6666';
    c.beginPath(); c.arc(px+TS/2-3, py+TS/2-3+bob, 8, 0, Math.PI*2); c.fill();
    // Eyes
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(px+TS/2-5, py+TS/2-4+bob, 4, 0, Math.PI*2); c.fill();
    c.beginPath(); c.arc(px+TS/2+4, py+TS/2-4+bob, 4, 0, Math.PI*2); c.fill();
    c.fillStyle = '#000000';
    c.beginPath(); c.arc(px+TS/2-4, py+TS/2-4+bob, 2, 0, Math.PI*2); c.fill();
    c.beginPath(); c.arc(px+TS/2+5, py+TS/2-4+bob, 2, 0, Math.PI*2); c.fill();
  }

  boss(e, frame) {
    const c = this.ctx;
    const px = e.x * TS, py = e.y * TS;
    const bob = Math.sin(frame * 0.08) * 3;
    c.fillStyle = '#660000';
    c.beginPath(); c.arc(px+TS/2, py+TS/2+bob, 18, 0, Math.PI*2); c.fill();
    c.fillStyle = '#aa0000';
    c.beginPath(); c.arc(px+TS/2, py+TS/2+bob, 13, 0, Math.PI*2); c.fill();
    // Crown
    c.fillStyle = '#ffcc00';
    c.fillRect(px+12, py+8+bob, 16, 6);
    c.fillRect(px+11, py+4+bob, 4, 8);
    c.fillRect(px+18, py+2+bob, 4, 10);
    c.fillRect(px+25, py+4+bob, 4, 8);
    // Eyes
    c.fillStyle = '#ffff00';
    c.beginPath(); c.arc(px+TS/2-6, py+TS/2-4+bob, 5, 0, Math.PI*2); c.fill();
    c.beginPath(); c.arc(px+TS/2+6, py+TS/2-4+bob, 5, 0, Math.PI*2); c.fill();
    c.fillStyle = '#ff0000';
    c.beginPath(); c.arc(px+TS/2-6, py+TS/2-4+bob, 3, 0, Math.PI*2); c.fill();
    c.beginPath(); c.arc(px+TS/2+6, py+TS/2-4+bob, 3, 0, Math.PI*2); c.fill();
  }

  hud(leoHp, leoMaxHp, miaHp, miaMaxHp, leoKeys, miaKeys, levelNum, levelName, mode, activeChar, items, timer, stars) {
    const c = this.ctx;
    c.fillStyle = 'rgba(10,10,30,0.88)';
    c.fillRect(0, CH - 52, CW, 52);
    c.strokeStyle = '#4444aa';
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, CH-52); c.lineTo(CW, CH-52); c.stroke();

    // Level info
    c.fillStyle = '#aaaaff';
    c.font = 'bold 13px monospace';
    c.textAlign = 'left';
    c.fillText(`Niveau ${levelNum}/10`, 10, CH-34);
    c.fillStyle = '#8888cc';
    c.font = '11px monospace';
    c.fillText(levelName, 10, CH-18);

    // Leo portrait & HP
    c.fillStyle = '#2266cc';
    c.fillRect(160, CH-48, 18, 18);
    c.fillStyle = '#ffffff';
    c.font = 'bold 10px monospace';
    c.textAlign = 'left';
    c.fillText('LÉO', 180, CH-34);
    for (let i = 0; i < leoMaxHp; i++) {
      c.fillStyle = i < leoHp ? '#ee2244' : '#441122';
      c.beginPath(); c.arc(182+i*14, CH-20, 5, 0, Math.PI*2); c.fill();
    }
    if (leoKeys > 0) {
      c.fillStyle = CLR.KEY;
      c.font = '11px monospace';
      c.fillText(`🗝 ×${leoKeys}`, 180, CH-8);
    }
    if (mode === 'coop' || activeChar === 'mia') {
      // Mia portrait & HP
      c.fillStyle = '#9933cc';
      c.fillRect(280, CH-48, 18, 18);
      c.fillStyle = '#ffffff';
      c.font = 'bold 10px monospace';
      c.fillText('MIA', 300, CH-34);
      for (let i = 0; i < miaMaxHp; i++) {
        c.fillStyle = i < miaHp ? '#ee2244' : '#441122';
        c.beginPath(); c.arc(302+i*14, CH-20, 5, 0, Math.PI*2); c.fill();
      }
      if (miaKeys > 0) {
        c.fillStyle = CLR.KEY;
        c.font = '11px monospace';
        c.fillText(`🗝 ×${miaKeys}`, 300, CH-8);
      }
    }

    // Active char indicator (solo)
    if (mode === 'solo') {
      const ax = activeChar === 'leo' ? 159 : 279;
      c.strokeStyle = '#ffff00';
      c.lineWidth = 2;
      c.strokeRect(ax, CH-49, 20, 20);
    }

    // Items
    const itemIcons = { torch:'🔦', boots:'👟', compass:'🧭', orb:'🔮', crystal:'💎' };
    let ix = 400;
    c.fillStyle = '#aaaacc';
    c.font = '11px monospace';
    c.textAlign = 'left';
    c.fillText('Objets:', ix, CH-36);
    ix += 48;
    for (const [k, v] of Object.entries(items)) {
      if (v) {
        c.font = '18px monospace';
        c.fillText(itemIcons[k] || '?', ix, CH-18);
        ix += 24;
      }
    }

    // Timer
    if (timer > 0) {
      c.fillStyle = timer < 20 ? '#ff4444' : '#ffcc00';
      c.font = 'bold 16px monospace';
      c.textAlign = 'center';
      c.fillText(`⏱ ${Math.ceil(timer)}s`, CW/2, CH-28);
    }

    // Stars
    c.textAlign = 'right';
    c.font = '18px monospace';
    for (let i = 0; i < 3; i++) {
      c.fillStyle = i < stars ? '#ffcc00' : '#333355';
      c.fillText('★', CW - 10 - i*22, CH-20);
    }
  }

  darkness(px, py, radius) {
    const c = this.ctx;
    const screenPx = px * TS + TS/2;
    const screenPy = py * TS + TS/2;
    const grd = c.createRadialGradient(screenPx, screenPy, radius*0.6, screenPx, screenPy, radius+40);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, 'rgba(0,0,16,0.97)');
    c.fillStyle = 'rgba(0,0,16,0.97)';
    c.fillRect(0, 0, CW, CH);
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.fillStyle = grd;
    c.beginPath(); c.arc(screenPx, screenPy, radius+40, 0, Math.PI*2); c.fill();
    c.restore();
  }

  menu(frame) {
    const c = this.ctx;
    this.clear();
    // Animated background dots
    for (let i = 0; i < 40; i++) {
      const x = (i * 173 + frame * 0.3) % CW;
      const y = (i * 97 + frame * 0.15) % (CH - 52);
      const alpha = 0.1 + 0.1 * Math.sin(frame * 0.05 + i);
      c.fillStyle = `rgba(100,100,200,${alpha})`;
      c.fillRect(x, y, 3, 3);
    }
    // Title
    c.fillStyle = '#6666ff';
    c.font = 'bold 42px monospace';
    c.textAlign = 'center';
    c.fillText('LÉO & MIA', CW/2, 140);
    c.fillStyle = '#00ddff';
    c.font = 'bold 22px monospace';
    c.fillText('LE LABYRINTHE PERDU', CW/2, 175);
    // Crystal
    const pulse = 0.8 + 0.2 * Math.sin(frame * 0.08);
    c.fillStyle = `rgba(0,220,255,${pulse})`;
    c.save(); c.translate(CW/2, 240); c.rotate(frame * 0.01);
    this._star(c, 0, 0, 30, 15, 6);
    c.restore();
    // Prompt
    const blink = Math.floor(frame / 30) % 2 === 0;
    c.fillStyle = blink ? '#ffffff' : '#888888';
    c.font = '18px monospace';
    c.fillText('Appuyez sur ENTRÉE pour commencer', CW/2, 330);
    // Sub
    c.fillStyle = '#888899';
    c.font = '13px monospace';
    c.fillText('Récupérez les 10 fragments du Cristal du Savoir !', CW/2, 370);
    c.fillText('Léo : combattant  |  Mia : mage', CW/2, 392);
  }

  modeSelect(sel, frame) {
    const c = this.ctx;
    this.clear();
    c.fillStyle = '#6666ff';
    c.font = 'bold 28px monospace';
    c.textAlign = 'center';
    c.fillText('CHOISISSEZ UN MODE', CW/2, 120);

    const opts = ['Solo (un joueur)', 'Co-op (deux joueurs)'];
    opts.forEach((txt, i) => {
      const y = 220 + i * 90;
      c.fillStyle = sel === i ? '#4444aa' : '#222244';
      c.strokeStyle = sel === i ? '#aaaaff' : '#444488';
      c.lineWidth = 2;
      c.beginPath(); c.roundRect(CW/2-160, y-35, 320, 60, 10); c.fill(); c.stroke();
      c.fillStyle = sel === i ? '#ffffff' : '#8888aa';
      c.font = 'bold 20px monospace';
      c.fillText(txt, CW/2, y+5);
    });

    const blink = Math.floor(frame / 30) % 2 === 0;
    c.fillStyle = blink ? '#aaaaff' : '#555577';
    c.font = '14px monospace';
    c.fillText('↑↓ pour choisir, ENTRÉE pour valider', CW/2, 430);
    c.fillStyle = '#555577';
    c.fillText('Solo: Tab pour changer de personnage', CW/2, 455);
  }

  levelDone(levelNum, stars, time, frame) {
    const c = this.ctx;
    c.fillStyle = 'rgba(0,0,20,0.85)';
    c.fillRect(0, 0, CW, CH);
    c.fillStyle = '#00ff88';
    c.font = 'bold 36px monospace';
    c.textAlign = 'center';
    c.fillText('NIVEAU TERMINÉ !', CW/2, 160);
    c.fillStyle = '#aaaaff';
    c.font = '20px monospace';
    c.fillText(`Niveau ${levelNum}`, CW/2, 210);
    c.fillText(`Temps : ${Math.floor(time)}s`, CW/2, 240);
    // Stars
    for (let i = 0; i < 3; i++) {
      const pulse = i < stars ? 1 + 0.15*Math.sin(frame*0.1+i) : 1;
      c.save(); c.translate(CW/2 - 60 + i*60, 310); c.scale(pulse, pulse);
      c.fillStyle = i < stars ? '#ffcc00' : '#333344';
      this._star(c, 0, 0, 28, 12, 5);
      c.restore();
    }
    const blink = Math.floor(frame / 30) % 2 === 0;
    c.fillStyle = blink ? '#ffffff' : '#555566';
    c.font = '16px monospace';
    c.fillText('ENTRÉE : niveau suivant', CW/2, 400);
  }

  gameOver(frame) {
    const c = this.ctx;
    c.fillStyle = 'rgba(0,0,0,0.85)';
    c.fillRect(0, 0, CW, CH);
    c.fillStyle = '#ff2244';
    c.font = 'bold 48px monospace';
    c.textAlign = 'center';
    c.fillText('GAME OVER', CW/2, 220);
    const blink = Math.floor(frame / 30) % 2 === 0;
    c.fillStyle = blink ? '#ffffff' : '#555566';
    c.font = '18px monospace';
    c.fillText('R : réessayer le niveau', CW/2, 320);
    c.fillText('ENTRÉE : menu principal', CW/2, 355);
  }

  win(frame) {
    const c = this.ctx;
    this.clear();
    for (let i = 0; i < 20; i++) {
      const x = (i * 200 + frame * 2) % CW;
      const y = (i * 137 + frame) % (CH-52);
      c.fillStyle = `hsla(${(i*36+frame*2)%360},100%,70%,0.6)`;
      c.font = '20px monospace';
      c.textAlign = 'left';
      c.fillText('✨', x, y);
    }
    c.fillStyle = '#ffcc00';
    c.font = 'bold 40px monospace';
    c.textAlign = 'center';
    c.fillText('VICTOIRE !', CW/2, 130);
    c.fillStyle = '#00ddff';
    c.font = 'bold 20px monospace';
    c.fillText('Le Cristal du Savoir est restauré !', CW/2, 180);
    const pulse = 0.9 + 0.1*Math.sin(frame*0.08);
    c.save(); c.translate(CW/2, 270); c.rotate(frame*0.02); c.scale(pulse, pulse);
    c.fillStyle = '#00ddff';
    this._star(c, 0, 0, 50, 25, 10);
    c.restore();
    c.fillStyle = '#aaffaa';
    c.font = '16px monospace';
    c.fillText('Félicitations, aventuriers !', CW/2, 380);
    const blink = Math.floor(frame/30)%2===0;
    c.fillStyle = blink ? '#ffffff' : '#555566';
    c.font = '16px monospace';
    c.fillText('ENTRÉE : retour au menu', CW/2, 430);
  }

  paused() {
    const c = this.ctx;
    c.fillStyle = 'rgba(0,0,20,0.75)';
    c.fillRect(0, 0, CW, CH);
    c.fillStyle = '#ffffff';
    c.font = 'bold 36px monospace';
    c.textAlign = 'center';
    c.fillText('PAUSE', CW/2, CH/2 - 20);
    c.font = '18px monospace';
    c.fillStyle = '#aaaacc';
    c.fillText('P ou ÉCHAP : reprendre', CW/2, CH/2 + 30);
  }

  hint(text, alpha) {
    if (alpha <= 0) return;
    const c = this.ctx;
    c.fillStyle = `rgba(0,0,40,${alpha * 0.85})`;
    c.fillRect(CW/2 - 260, CH/2 - 30, 520, 60);
    c.strokeStyle = `rgba(100,100,255,${alpha})`;
    c.lineWidth = 2;
    c.strokeRect(CW/2 - 260, CH/2 - 30, 520, 60);
    c.fillStyle = `rgba(255,255,200,${alpha})`;
    c.font = '16px monospace';
    c.textAlign = 'center';
    c.fillText(text, CW/2, CH/2 + 8);
  }

  flashOverlay(color, alpha) {
    if (alpha <= 0) return;
    const c = this.ctx;
    c.fillStyle = `rgba(${color},${alpha})`;
    c.fillRect(0, 0, CW, CH - 52);
  }
}
