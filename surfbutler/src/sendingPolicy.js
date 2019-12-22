exports.filter = ({ activeStars, inactiveStars }) => {
    const hasNoActiveStars = activeStars === 0;
    const hasLessThan2InactiveStars = inactiveStars < 2;
    return hasNoActiveStars && hasLessThan2InactiveStars;
};