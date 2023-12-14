import Job from '../job';
import Courier from './courier';

class Smuggling extends Job {
	constructor() {
		super('Smuggling', [130, 130, 130], { x: 1443.863, y: 1132.018, z: 114.334 });
		this.cooldown.setTimeLimit(20 * 60 * 1000);
	}

	async startWork(player: Player, level: number) {
		if (player.level < 3) {
			return mp.events.reject('Потрiбен 3-й iгровий рiвень');
		}
		if (player.faction !== 'armenian') {
			return mp.events.reject('Поки нiчого немає, чекайте на поставку товару');
		}

		await super.startWork(player, level);
	}

	protected getBranchOfLevel() {
		return Courier;
	}
}

const job = new Smuggling();

job.addBranch(Courier);
