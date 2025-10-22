export const formatNumberWithCommas = (num: string | number): string => {
    // CONVERT TO NUMBER AND FIX TO 2 DECIMAL PLACES
    const numberWithDecimals = Number(num.toString().replace(/,/g, '')).toFixed(2);

    // SPLIT NUMBER INTO WHOLE AND DECIMAL PARTS
    const [wholePart, decimalPart] = numberWithDecimals.split('.');

    // ADD COMMAS TO WHOLE PART
    const withCommas = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // COMBINE WITH DECIMAL PART
    return `${withCommas}.${decimalPart}`;
};
