
// import { easeOutQuad, easeInOutQuad, easeOutSine, easeInOutSine } from '../../utils/easing.utils';
import { Texture } from 'ogl'
import Mouse from './mouse'
export default class TouchTexture {
	constructor(parent) {
		this.parent = parent;
		this.size = 64;
		this.maxAge = 100;
		this.radius = 0.1;
		this.trail = [];

		this.initTexture();

        Mouse.on('move', this.move.bind(this))
	}

	initTexture() {
		this.canvas = document.createElement('canvas');
        document.documentElement.appendChild(this.canvas)
		this.canvas.width = this.canvas.height = this.size;
		
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        console.log(this.parent.Scene)
		this.texture = new Texture(this.parent.Scene.gl);
        this.texture.image = this.canvas

		this.canvas.id = 'touchTexture';
		this.canvas.style.width = this.canvas.style.height = `${this.canvas.width}px`;
	}

    move(){
        this.addTouch(Mouse.cursor)
    }

	update(delta) {
		this.clear();

		// age points
		this.trail.forEach((point, i) => {
			point.age++;
			// remove old
			if (point.age > this.maxAge) {
				this.trail.splice(i, 1);
			}
		});

		this.trail.forEach((point, i) => {
			this.drawTouch(point);
		});

		this.texture.needsUpdate = true;
	}

	clear() {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	addTouch(point) {
		let force = 0;
		const last = this.trail[this.trail.length - 1];
		if (last) {
			const dx = last.x - (point[0] * 2 - 1);
			const dy = last.y - point[1];
			const dd = dx * dx + dy * dy;
			force = Math.min(dd * 10000, 1);
		}
		this.trail.push({ x: point[0], y: point[1], age: 0, force });
	}

	drawTouch(point) {
		const pos = {
			x: point.x * this.size,
			y: (1 - point.y) * this.size
		};

		let intensity = 1;
		// if (point.age < this.maxAge * 0.3) {
		// 	intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
        //     intensity = 1
		// } else {
		// 	intensity = easeOutSine(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
        //     intensity = 1
		// }

		intensity *= point.force;

		const radius = this.size * this.radius * intensity;
		const grd = this.ctx.createRadialGradient(pos.x,this.canvas.height - pos.y, radius * 0.25 , pos.x, this.canvas.height - pos.y, radius );
		grd.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
		grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

		this.ctx.beginPath();
		this.ctx.fillStyle = grd;
		this.ctx.arc(pos.x, this.canvas.height -pos.y, radius / (point.age * 0.05), 0, Math.PI * 2);
		this.ctx.fill();
	}
}