import factions from 'factions';
import owning from './owning';
import passengers from './passengers';

class VehicleDespawn {
	private despawnTimeout: number;

	constructor() {
		this.despawnTimeout = 2;

		mp.events.subscribe({
			'Vehicle-DespawnItem': this.despawnByPlayer.bind(this)
		});
	}

	despawnFactionsVehicles() {
		Object.values(factions.items).forEach(({ garage }) => {
			if (!garage) return;

			garage.vehicles.forEach((vehicle) => {
				if (vehicle.despawnAt && Date.now() >= vehicle.despawnAt) {
					garage.despawnVehicle(vehicle);
				}
			});
		});
	}

	despawnPlayerVehicles(player: Player) {
		player.vehicles.forEach((item) => this.removeVehicle(mp.vehicles.getById(item)));
	}

	private despawnByPlayer(player: Player, id: string) {
		const vehicle = mp.vehicles.getById(id);
		const error = this.checkErrors(player, vehicle);

		if (error) return mp.events.reject(error);

		mp.players.withTimeout(
			player.mp,
			() => {
				player.mp.setOwnVariable('vehicleDespawn', false);

				if (this.checkErrors(player, vehicle)) return;

				this.removeVehicle(vehicle);
			},
			this.despawnTimeout * 60 * 1000
		);

		player.mp.setOwnVariable('vehicleDespawn', true);
	}

	private removeVehicle(vehicle: VehicleMp) {
		mp.vehicles.delete(vehicle);
	}

	private checkErrors(player: Player, vehicle: VehicleMp) {
		let error: string;

		if (!vehicle) error = 'Дане ТЗ вже евакуйовано';
		else if (player.mp.getOwnVariable('vehicleDespawn')) error = 'Дочекайтеся евакуацiї ТЗ';
		else if (!owning.isRealOwner(vehicle, player))
			error = 'Ви не є власником цього ТЗ';
		else if (passengers.isExists(vehicle)) error = 'У ТС виявлено пасажира';

		return error;
	}
}

export default new VehicleDespawn();
