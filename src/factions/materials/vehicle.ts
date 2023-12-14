class VehicleMaterials {
	private capacity: { [name: string]: number };

	constructor() {
		this.capacity = {
			titan: 50000,
			barracks: 10000,
			burrito3: 5000
		};
	}

	getCapacity(vehicle: VehicleMp) {
		return this.capacity[vehicle.name] ?? 0;
	}

	getMaterials(vehicle: VehicleMp) {
		return (vehicle?.getVariable('materials') as number) ?? 0;
	}

	loadToVehicle(vehicle: VehicleMp, amount: number) {
		const capacity = this.getCapacity(vehicle);

		if (capacity <= 0) {
			return mp.events.reject('Дане ТЗ не може перевозити матерiали');
		}

		const materials = this.getMaterials(vehicle);
		const totalAmount = materials + amount;

		if (totalAmount > capacity) {
			return mp.events.reject('ТЗ переповнено матерiалами');
		}

		vehicle.setVariable('materials', totalAmount);
	}
}

export default new VehicleMaterials();
