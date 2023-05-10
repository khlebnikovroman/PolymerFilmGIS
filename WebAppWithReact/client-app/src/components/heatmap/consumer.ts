type Consumer = {
    lat: number,
    long: number,
    power: number
}

class Consumer2 {
    lat: number
    long: number
    power: number

    constructor(lat: number, long: number, power: number) {
        this.lat = lat
        this.long = long
        this.power = power
    }
}

export default Consumer2