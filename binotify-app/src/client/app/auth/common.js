export function makeWarningText(message) {
  const warning = document.createElement("p");
  warning.classList.add("text-warning");
  warning.innerText = message;
  return warning;
}

export function enableEmptyWarning(elementId, message) {
  const requiredField = document.querySelector(elementId);
  requiredField.querySelector(".field").addEventListener("input", (e) => {
    if (
      e.target.value == "" &&
      requiredField.querySelector(".text-warning") == null
    ) {
      const warning = makeWarningText(message);
      requiredField.appendChild(warning);
      requiredField.querySelector(".field").classList.add("box-shadow-warning");
    } else if (
      e.target.value != "" &&
      requiredField.querySelector(".text-warning") != null
    ) {
      requiredField.querySelector(".text-warning").remove();
      requiredField
        .querySelector(".field")
        .classList.remove("box-shadow-warning");
    }
  });
}

export function submitListeners(form, postFunc) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    postFunc(e.target);
  });

  form.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      postFunc(e.target);
    }
  });
}
