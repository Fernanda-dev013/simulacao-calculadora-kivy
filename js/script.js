var expr = "";
var histItems = [];

function updateDisplay() {
  document.getElementById("expr").textContent = expr || "";
}

function setCode(code) {
  document.getElementById("code-panel").innerHTML = code;
  flash();
}

function flash() {
  var p = document.getElementById("code-panel");
  p.classList.add("flash");
  setTimeout(function () {
    p.classList.remove("flash");
  }, 300);
}

function pressNum(number) {
  expr += number;
  updateDisplay();
  setCode(
    '<span class="kw">def</span> on_number_press<span class="self">(self, number)</span>:<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">current = self.input_field.text</span><br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">self.input_field.text = current + number</span>'
  );
}

function pressOp(op) {
  expr += op;
  updateDisplay();
  setCode(
    '<span class="kw">def</span> on_operator_press<span class="self">(self, operator)</span>:<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">current = self.input_field.text</span><br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">self.input_field.text = current + operator</span>'
  );
}

function clearAll() {
  expr = "";
  updateDisplay();
  setCode(
    '<span class="kw">def</span> clear_input<span class="self">(self)</span>:<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">self.input_field.text = ""</span><br><br>' +
    '<b>clear_input()</b> — zera o MDTextField'
  );
}

function calculate() {
  if (!expr.trim()) return;
  var original = expr;

  try {
    var result = Function('"use strict"; return (' + expr + ')')();
    var rounded = parseFloat(result.toFixed(10));
    var entry = original.trim() + " = " + rounded;

    histItems.unshift(entry);
    if (histItems.length > 8) {
      histItems.pop();
    }

    updateHistory();
    expr = String(rounded);
    updateDisplay();

    setCode(
      '<span class="kw">def</span> calculate_result<span class="self">(self)</span>:<br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">result = calcular(expressão)</span><br>' +
      '&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">resultado = ' + rounded + '</span>'
    );
  } catch (error) {
    expr = "Erro";
    updateDisplay();
    setCode('<span class="error-msg">Erro: expressão inválida</span>');

    setTimeout(function () {
      expr = "";
      updateDisplay();
    }, 1200);
  }
}

function updateHistory() {
  var h = document.getElementById("history");
  if (histItems.length === 0) {
    h.innerHTML = '<span class="placeholder-text">nenhum cálculo ainda</span>';
    return;
  }
  h.innerHTML = histItems.map(function (item) {
    return '<div>' + item + '</div>';
  }).join("");
}

updateDisplay();