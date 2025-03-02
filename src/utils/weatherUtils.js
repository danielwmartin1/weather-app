export const getHighLowTemps = (day) => {
    const temps = day.map(part => part.main.temp);
    return {
        high: Math.max(...temps),
        low: Math.min(...temps)
    };
};
