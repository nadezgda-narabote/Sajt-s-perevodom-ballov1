const totalInput = document.getElementById("total");
const g1Input = document.getElementById("g1");
const g2Input = document.getElementById("g2");
const g3Input = document.getElementById("g3");
const g4Input = document.getElementById("g4");

const literacySumElement = document.getElementById("literacySum");
const resultBlock = document.getElementById("res");

const totalError = document.getElementById("totalError");
const g1Error = document.getElementById("g1Error");
const g2Error = document.getElementById("g2Error");
const g3Error = document.getElementById("g3Error");
const g4Error = document.getElementById("g4Error");

const calcBtn = document.getElementById("calcBtn");
const resetBtn = document.getElementById("resetBtn");

function safeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function updateLiteracySum() {
  const sum =
    safeNumber(g1Input.value) +
    safeNumber(g2Input.value) +
    safeNumber(g3Input.value) +
    safeNumber(g4Input.value);

  literacySumElement.textContent = String(sum);
}

function validateInteger(value, min, max, fieldName) {
  if (value === "") {
    return { valid: false, message: `Поле «${fieldName}» не заполнено.` };
  }

  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { valid: false, message: `Поле «${fieldName}» должно содержать число.` };
  }
  if (!Number.isInteger(num)) {
    return { valid: false, message: `Поле «${fieldName}» должно содержать целое число.` };
  }
  if (num < min) {
    return { valid: false, message: `Поле «${fieldName}» не может быть меньше ${min}.` };
  }
  if (num > max) {
    return { valid: false, message: `Поле «${fieldName}» не может быть больше ${max}.` };
  }

  return { valid: true, value: num };
}

function getInlineErrorMessage(rawValue, min, max) {
  if (rawValue === "") return `Заполните поле (${min}-${max}).`;
  const num = Number(rawValue);
  if (!Number.isFinite(num)) return "Введите число.";
  if (!Number.isInteger(num)) return "Введите целое число.";
  if (num < min || num > max) return `Введите число от ${min} до ${max}.`;
  return "";
}

function setFieldError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

function clearFieldError(input, errorElement) {
  input.classList.remove("input-error");
  errorElement.textContent = "";
  errorElement.classList.remove("show");
}

function validateAndPaintField(input, errorElement, min, max, fieldName) {
  const validation = validateInteger(input.value, min, max, fieldName);
  if (!validation.valid) {
    setFieldError(input, errorElement, getInlineErrorMessage(input.value, min, max));
    return validation;
  }
  clearFieldError(input, errorElement);
  return validation;
}

function bindInlineValidation(input, errorElement, min, max, fieldName) {
  input.addEventListener("input", () => {
    validateAndPaintField(input, errorElement, min, max, fieldName);
  });
}

function show(text, cls, title = "Результат") {
  resultBlock.className = `result show ${cls}`;
  resultBlock.innerHTML = `<h2>${title}</h2>${text}`;
}

function calculateGrade(totalScore, literacySum) {
  if (totalScore >= 0 && totalScore <= 14) {
    return {
      grade: 2,
      explanation: "Общий балл в диапазоне 0-14, итоговая оценка: 2.",
      status: "bad",
    };
  }

  if (totalScore >= 15 && totalScore <= 25) {
    return {
      grade: 3,
      explanation: "Общий балл в диапазоне 15-25, итоговая оценка: 3.",
      status: "warn",
    };
  }

  if (totalScore >= 26 && totalScore <= 32) {
    if (literacySum >= 6) {
      return {
        grade: 4,
        explanation: "Баллов по грамотности достаточно для получения оценки 4.",
        status: "good",
      };
    }
    return {
      grade: 3,
      explanation: "Сумма по ГК1-ГК4 меньше 6, поэтому оценка снижена до 3.",
      status: "warn",
    };
  }

  if (totalScore >= 33 && totalScore <= 37) {
    if (literacySum >= 9) {
      return {
        grade: 5,
        explanation: "Баллов по грамотности достаточно для получения оценки 5.",
        status: "good",
      };
    }
    return {
      grade: 4,
      explanation: "Сумма по ГК1-ГК4 меньше 9, поэтому оценка снижена до 4.",
      status: "warn",
    };
  }

  return {
    grade: "-",
    explanation: "Не удалось определить оценку. Проверьте введенные данные.",
    status: "bad",
  };
}

function calc() {
  const totalValidation = validateAndPaintField(totalInput, totalError, 0, 37, "Общий первичный балл");
  if (!totalValidation.valid) {
    show(`<p>${totalValidation.message}</p>`, "bad", "Ошибка ввода");
    return;
  }

  const g1Validation = validateAndPaintField(g1Input, g1Error, 0, 3, "ГК1");
  if (!g1Validation.valid) {
    show(`<p>${g1Validation.message}</p>`, "bad", "Ошибка ввода");
    return;
  }

  const g2Validation = validateAndPaintField(g2Input, g2Error, 0, 3, "ГК2");
  if (!g2Validation.valid) {
    show(`<p>${g2Validation.message}</p>`, "bad", "Ошибка ввода");
    return;
  }

  const g3Validation = validateAndPaintField(g3Input, g3Error, 0, 3, "ГК3");
  if (!g3Validation.valid) {
    show(`<p>${g3Validation.message}</p>`, "bad", "Ошибка ввода");
    return;
  }

  const g4Validation = validateAndPaintField(g4Input, g4Error, 0, 3, "ГК4");
  if (!g4Validation.valid) {
    show(`<p>${g4Validation.message}</p>`, "bad", "Ошибка ввода");
    return;
  }

  const totalScore = totalValidation.value;
  const literacySum = g1Validation.value + g2Validation.value + g3Validation.value + g4Validation.value;
  const gradeData = calculateGrade(totalScore, literacySum);

  show(
    `
      <p><strong>Общий первичный балл:</strong> ${totalScore}</p>
      <p><strong>Сумма баллов за грамотность:</strong> ${literacySum} из 12</p>
      <p><strong>Итоговая оценка:</strong> ${gradeData.grade}</p>
      <p><strong>Комментарий:</strong> ${gradeData.explanation}</p>
    `,
    gradeData.status
  );
}

function resetForm() {
  totalInput.value = "";
  g1Input.value = "";
  g2Input.value = "";
  g3Input.value = "";
  g4Input.value = "";
  literacySumElement.textContent = "0";
  resultBlock.className = "result";
  resultBlock.innerHTML = "";
  clearFieldError(totalInput, totalError);
  clearFieldError(g1Input, g1Error);
  clearFieldError(g2Input, g2Error);
  clearFieldError(g3Input, g3Error);
  clearFieldError(g4Input, g4Error);
}

function clampInputValue(input, min, max) {
  input.addEventListener("change", () => {
    if (input.value === "") return;
    let value = Number(input.value);
    if (!Number.isFinite(value)) return;
    value = Math.floor(value);
    if (value < min) value = min;
    if (value > max) value = max;
    input.value = String(value);
    updateLiteracySum();
  });
}

[g1Input, g2Input, g3Input, g4Input].forEach((input) => {
  input.addEventListener("input", updateLiteracySum);
});

clampInputValue(totalInput, 0, 37);
clampInputValue(g1Input, 0, 3);
clampInputValue(g2Input, 0, 3);
clampInputValue(g3Input, 0, 3);
clampInputValue(g4Input, 0, 3);

bindInlineValidation(totalInput, totalError, 0, 37, "Общий первичный балл");
bindInlineValidation(g1Input, g1Error, 0, 3, "ГК1");
bindInlineValidation(g2Input, g2Error, 0, 3, "ГК2");
bindInlineValidation(g3Input, g3Error, 0, 3, "ГК3");
bindInlineValidation(g4Input, g4Error, 0, 3, "ГК4");

calcBtn.addEventListener("click", calc);
resetBtn.addEventListener("click", resetForm);
