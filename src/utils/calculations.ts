export interface CaloricResult {
  imc: number;
  imcStatus: string;
  imcStatusEn: string;
  tmb: number;
  tdee: number;
  caloriasAlvo: number;
  proteinasG: number;
  carboidratosG: number;
  gordurasG: number;
  fibrasG: number;
  aguaIdealMl: number;
}

export function calculateMacros(
  peso: number,
  altura: number, // cm
  idade: number,
  sexo: 'M' | 'F' | 'Outro',
  nivelAtividade: 'sedentario' | 'moderado' | 'intenso',
  objetivo: 'ganhar_massa' | 'emagrecer' | 'recomposicao' | 'manter_peso'
): CaloricResult {
  // BMI (IMC)
  const alturaM = altura / 100;
  const imc = peso / (alturaM * alturaM);

  let imcStatus = '';
  let imcStatusEn = '';
  if (imc < 18.5) {
    imcStatus = 'Abaixo do peso';
    imcStatusEn = 'Underweight';
  } else if (imc < 24.9) {
    imcStatus = 'Peso normal';
    imcStatusEn = 'Normal weight';
  } else if (imc < 29.9) {
    imcStatus = 'Sobrepeso';
    imcStatusEn = 'Overweight';
  } else {
    imcStatus = 'Obesidade';
    imcStatusEn = 'Obesity';
  }

  // TMB (Mifflin-St Jeor)
  let tmb = 10 * peso + 6.25 * altura - 5 * idade;
  if (sexo === 'M') {
    tmb += 5;
  } else {
    tmb -= 161;
  }

  // TDEE (Gasto Energético Diário Total)
  let multiplicador = 1.2;
  if (nivelAtividade === 'sedentario') {
    multiplicador = 1.2;
  } else if (nivelAtividade === 'moderado') {
    multiplicador = 1.45; // balanced for physical/active
  } else {
    multiplicador = 1.65; // intense training
  }
  const tdee = tmb * multiplicador;

  // Calorie targets based on specific goal and sex-specific sports science adjustments
  let caloriasAlvo = tdee;
  let protMultiplier = 2.0; // g/kg
  let fatMultiplier = 1.0;  // g/kg

  const isMale = sexo === 'M';

  if (objetivo === 'ganhar_massa') {
    caloriasAlvo = tdee + (isMale ? 450 : 300); // Higher surplus for men, moderate for women to minimize fat storage
    protMultiplier = isMale ? 2.2 : 2.0;       // Differentiated protein requirements based on muscle mass percentage
    fatMultiplier = isMale ? 1.0 : 1.15;       // Women benefit from higher fat ratios for endocrine health
  } else if (objetivo === 'emagrecer') {
    caloriasAlvo = tdee - (isMale ? 500 : 400); // Moderated deficit for women to protect thyroid & metabolic health
    protMultiplier = isMale ? 2.4 : 2.2;       // High proteins to prevent muscle breakdown during cutting
    fatMultiplier = isMale ? 0.8 : 0.95;       // Sparing essential fats for hormonal balance
  } else if (objetivo === 'recomposicao') {
    caloriasAlvo = tdee;
    protMultiplier = isMale ? 2.3 : 2.1;
    fatMultiplier = isMale ? 0.9 : 1.05;
  } else {
    // manter_peso
    caloriasAlvo = tdee;
    protMultiplier = isMale ? 2.0 : 1.8;
    fatMultiplier = isMale ? 1.0 : 1.1;
  }

  // Minimum calories clamp to prevent unsafe metabolic crash
  caloriasAlvo = Math.max(isMale ? 1400 : 1200, caloriasAlvo);

  // Protein target
  const proteinasG = Math.round(peso * protMultiplier);

  // Fat target
  const gordurasG = Math.round(peso * fatMultiplier);

  // Carbohydrates target (remaining calories)
  // Protein = 4 kcal/g, Fat = 9 kcal/g, Carbs = 4 kcal/g
  const calProteina = proteinasG * 4;
  const calGordura = gordurasG * 9;
  const calRestante = Math.max(100, caloriasAlvo - (calProteina + calGordura));
  const carboidratosG = Math.round(calRestante / 4);

  // Fiber target: 12g per 1000 kcal
  const fibrasG = Math.round((caloriasAlvo / 1000) * 12);

  // Ideal water: 40ml per kg for men, 35ml per kg for women
  const aguaIdealMl = Math.max(2000, Math.round(peso * (isMale ? 40 : 35)));

  return {
    imc: parseFloat(imc.toFixed(1)),
    imcStatus,
    imcStatusEn,
    tmb: Math.round(tmb),
    tdee: Math.round(tdee),
    caloriasAlvo: Math.round(caloriasAlvo),
    proteinasG,
    carboidratosG,
    gordurasG,
    fibrasG,
    aguaIdealMl
  };
}
