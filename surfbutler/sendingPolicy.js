exports.filter = (meta) => {
    const hasNoActiveStars = meta.activeStars === 0;
    const hasLessThan2InactiveStars = meta.inactiveStars < 2;
    return hasNoActiveStars && hasLessThan2InactiveStars;
};