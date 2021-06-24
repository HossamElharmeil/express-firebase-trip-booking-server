const estimatePrice = (pickup, dropoff, factor) => {
    if (!pickup || !dropoff) return -1

    const latDiff = Math.abs(pickup.lat - dropoff.lat)
    const lngDiff = Math.abs(pickup.lng - dropoff.lng)

    return Math.round(latDiff + lngDiff * (factor || 100))
}

module.exports = estimatePrice