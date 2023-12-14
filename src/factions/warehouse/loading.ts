import hud from 'helpers/hud';
import MaterialsLoading from '../materials/loading';
import materials from '../materials/vehicle';
import Warehouse from './warehouse';

class WarehouseLoading extends MaterialsLoading {
	private warehouse: Warehouse;

	constructor(position: PositionEx, warehouse: Warehouse) {
		super(position, 8);

		this.warehouse = warehouse;
	}

	protected async checkCanBeLoaded(player: Player) {
		let err: string;

		if (!player.isDriver()) err = 'Ви повиннi бути за кермом ТЗ';
		else if (!this.warehouse.faction.inFaction(player)) {
			err = 'Ви не можете вивантажити матерiали';}

		return err && mp.events.reject(err);
	}

	protected async loadIteration(player: Player) {
		const { vehicle } = player.mp;

		const amount = materials.getMaterials(vehicle);

		if (vehicle && amount) {
			await this.warehouse.changeMaterials(amount);
			await materials.loadToVehicle(vehicle, -amount);
		}

		hud.showNotification(player, 'info', `Ви вивантажили ${amount} матiв`);
		this.stopLoading();
	}
}

export default WarehouseLoading;
