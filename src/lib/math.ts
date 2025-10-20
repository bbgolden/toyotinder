// ----------------------------
// Financial Calculation Utils
// ----------------------------

// Discrete allowed values for term length
export type TermLength = 24 | 36 | 48 | 60 | 72;

/**
 * Calculate APR based on mock Toyota estimations.
 * @param creditScore User's credit score
 * @param months User's preferred term length in months
 * @returns Estimated APR value
 */
export const getAPR = (creditScore: number, months: TermLength): number => {
  const isLowerBracket = months < 72;

  if (creditScore < 580) {
    return 0.18;
  } else if (creditScore < 610) {
    return isLowerBracket ? 0.1769 : 0.18;
  } else if (creditScore < 630) {
    return isLowerBracket ? 0.1553 : 0.1699;
  } else if (creditScore < 650) {
    return isLowerBracket ? 0.1361 : 0.1399;
  } else if (creditScore < 670) {
    return isLowerBracket ? 0.1252 : 0.1298;
  } else if (creditScore < 690) {
    return isLowerBracket ? 0.1177 : 0.1257;
  } else if (creditScore < 720) {
    return isLowerBracket ? 0.0949 : 0.1005;
  }
  return isLowerBracket ? 0.0872 : 0.0911;
};

/**
 * Calculate monthly finance payment for a vehicle.
 * @param msrp Vehicle price (excluding DPH)
 * @param downPayment User's preferred down payment
 * @param creditScore User's credit score
 * @param months Term length in months
 * @returns Monthly finance payment
 */
export const getMonthlyPaymentFinance = (
  msrp: number,
  downPayment: number,
  creditScore: number,
  months: TermLength
): number => {
  const apr = getAPR(creditScore, months);
  const principal = msrp - downPayment;
  const monthlyRate = apr / 12;

  // Standard amortized loan payment formula
  return (
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
};

/**
 * Estimate vehicle depreciation rate based on annual mileage.
 * @param mileage Annual mileage
 * @returns Depreciation factor (residual value = MSRP * factor)
 */
const getDepreciation = (mileage: number): number => {
  if (mileage <= 7500) return 0.61;
  if (mileage <= 10000) return 0.6;
  if (mileage <= 12000) return 0.59;
  if (mileage <= 15000) return 0.57;
  if (mileage <= 18000) return 0.55;
  if (mileage <= 20000) return 0.53;
  if (mileage <= 25000) return 0.5;
  return 0.46;
};

/**
 * Calculate monthly lease payment for a vehicle.
 * @param msrp Vehicle price (excluding DPH)
 * @param downPayment User's preferred down payment
 * @param creditScore User's credit score
 * @param months Lease term in months
 * @param mileage User's estimated annual mileage
 * @returns Monthly lease payment
 */
export const getMonthlyPaymentLease = (
  msrp: number,
  downPayment: number,
  creditScore: number,
  months: TermLength,
  mileage: number
): number => {
  const apr = getAPR(creditScore, months);
  const capCost = msrp - downPayment; // Capitalized cost
  const residualValue = msrp * getDepreciation(mileage); // End-of-lease value
  const moneyFactor = apr / 24; // Lease-specific finance rate

  const depreciationFee = (capCost - residualValue) / months;
  const financeFee = (capCost + residualValue) * moneyFactor;

  return depreciationFee + financeFee;
};
