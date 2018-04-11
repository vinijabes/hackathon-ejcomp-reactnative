export const getFont = (weight = 'Regular', style = '') => {
    const font = 'Raleway';

    return {
        fontFamily: `${font}-${weight}${style}`
    };
};