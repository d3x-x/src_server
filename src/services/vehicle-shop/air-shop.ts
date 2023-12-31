import VehicleShop from './shop';

const items = ['havok', 'swift2', 'duster', 'dodo', 'vestra', 'luxor2', 'shamal'];

class AirShop extends VehicleShop {
	constructor() {
		super('airshop', { name: 'Авiасалон', model: 307, color: 3, scale: 1 }, items);
	}

	protected async canBuy(player: Player) {
		await super.canBuy(player);

		if (!player.hasLicense('air')) {
			return mp.events.reject('У вас немає лiцензiї на повiтряний транспорт');
		}
	}
}

const shop = new AirShop();
