// discrete allowed values for term length
type TermLength = 24 | 36 | 48 | 60 | 72;

/**
 * @description
 * Calculate APR based on Toyota estimations.
 * @param creditScore user's credit score
 * @param months user's preferred term length in months
 * @returns appropriate mock APR
 */
const getAPR = (creditScore: number, months: TermLength): number => {
    // APR values are lower for term lengths less than 72 months
    const isLowerBracket = months < 72;

    // mock APR values
    if(creditScore < 580) {
        return 0.18;
    } else if(creditScore < 610) {
        return isLowerBracket ? 0.1769 : 0.18;
    } else if(creditScore < 630) {
        return isLowerBracket ? 0.1553 : 0.1699;
    } else if(creditScore < 650) {
        return isLowerBracket ? 0.1361 : 0.1399;
    } else if(creditScore < 670) {
        return isLowerBracket ? 0.1252 : 0.1298;
    } else if(creditScore < 690) {
        return isLowerBracket ? 0.1177 : 0.1257;
    } else if(creditScore < 720) {
        return isLowerBracket ? 0.949 : 0.1005;
    }
    return isLowerBracket ? 0.0872 : 0.0911;
}

/**
 * @description
 * Get monthly payment required to finance a vehicle given msrp and the downPayment.
 * @param msrp the retail price of the car, not including DPH
 * @param downPayment user's preferred down payment
 * @param creditScore user's credit score
 * @param months user's preferred term length in months
 * @returns approximate monthly finance payment
 */
const getMonthlyPaymentFinance = (
        msrp: number, 
        downPayment: number,
        creditScore: number, 
        months: TermLength
): number => {
    const apr = getAPR(creditScore, months);

    // accepted formula for monthly payment 
    return (msrp - downPayment) 
        * (apr / 12 * (1 + apr / 12) ** months) 
        / ((1 + apr / 12) ** months - 1);
}

/**
 * @description
 * Get depreciation rate of a leased vehicle. Rates are mockups based on practical data.
 * @param mileage mileage per year
 * @returns depreciation rate of vehicle
 */
const getDepreciation = (mileage: number): number => {
    if(mileage <= 7500) {
        return 0.61;
    } else if(mileage <= 10000) {
        return 0.6;
    } else if(mileage <= 12000) {
        return 0.59;
    } else if(mileage <= 15000) {
        return 0.57;
    } else if(mileage <= 18000) {
        return 0.55;
    } else if(mileage <= 20000) {
        return 0.53;
    } else if(mileage <= 25000) {
        return 0.5;
    }
    return 0.46;
}

/**
 * @description
 * Get monthly payment required to lease a vehicle given msrp, the downPayment, and estimated yearly
 * mileage.
 * @param msrp the retail price of the car, not including DPH
 * @param downPayment user's preferred down payment
 * @param creditScore user's credit score
 * @param months user's preferred term length in months
 * @param mileage user's estimated yearly mileage
 * @returns approximate monthly lease payment
 */
const getMonthlyPaymentLease = (
    msrp: number,
    downPayment: number,
    creditScore: number,
    months: TermLength,
    mileage: number,
): number => {
    const apr = getAPR(creditScore, months);
    const presentValue = msrp - downPayment;
    const depreciatedValue = msrp * getDepreciation(mileage);

    // accepted formula for monthly payment
    return (presentValue - depreciatedValue / ((1 + apr / 12) ** months)) 
        / (1 - apr / 12 / (1 + (1 + apr / 12) ** months));
}