const estimatePrice = (pickup, dropoff) => {
    if (!pickup || !dropoff) return -1

    const latDiff = Math.abs(pickup.lat - dropoff.lat)
    const lngDiff = Math.abs(pickup.lng - dropoff.lng)

    return latDiff + lngDiff * 100
}

module.exports = estimatePrice