import factions from 'factions';
import materials from '../materials/vehicle';
import MaterialsLoading from '../materials/loading';
import fortWar from './fort';

class WarsLoading extends MaterialsLoading {
	private war: typeof fortWar;

	constructor(position: PositionEx, war: typeof fortWar) {
		super(position);

		this.war = war;
	}

	protected async checkCanBeLoaded(player: Player) {
		let err: string;

		if (!player.isDriver()) err = 'Ви повиннi бути за кермом ТЗ';
		else if (!player.faction || factions.getFaction(player.faction).government) {
			err = 'Ви не можете завантажувати матерiали';
		} else if (!this.war.isStarted) err = 'Матерiалiв бiльше немає';

		return err && mp.events.reject(err);
	}

	protected async loadIteration(player: Player) {
		await materials.loadToVehicle(player.mp.vehicle, 250);
		this.war.changeMaterials(-250);
	}
}

export default WarsLoading;
