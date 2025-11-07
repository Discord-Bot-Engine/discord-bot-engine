export default class StoreCalculation {
    static type = "Store Calculation"
    static variableTypes = ["Number"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Calculation"></dbe-label>
            <dbe-input name="calc" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store number in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
    `
    static load(context) {}
    static async run({id, data, actionManager, setVariable}) {
        setVariable(data.get("value"), calculateText(data.get("calc")));
        actionManager.runNext(id, "action");

        function calculateText(input) {
            const constants = {
                pi: Math.PI,
                e: Math.E,
                epsilon: Number.EPSILON,
                tau: 2 * Math.PI
            };

            const functions = {
                sin: Math.sin,
                cos: Math.cos,
                tan: Math.tan,
                cot: (x) => 1 / Math.tan(x),
                sec: (x) => 1 / Math.cos(x),
                csc: (x) => 1 / Math.sin(x),

                sinh: Math.sinh,
                cosh: Math.cosh,
                tanh: Math.tanh,
                coth: (x) => 1 / Math.tanh(x),

                asin: Math.asin,
                acos: Math.acos,
                atan: Math.atan,
                atan2: Math.atan2,
                acot: (x) => Math.atan(1 / x),
                asec: (x) => Math.acos(1 / x),
                acsc: (x) => Math.asin(1 / x),

                asinh: Math.asinh,
                acosh: Math.acosh,
                atanh: Math.atanh,
                acoth: (x) => 0.5 * Math.log((x + 1) / (x - 1)),

                sqrt: Math.sqrt,
                abs: Math.abs,
                sign: Math.sign,
                log: Math.log,
                ln: Math.log,
                log10: Math.log10 || ((x) => Math.log(x) / Math.LN10),
                pow: Math.pow
            };

            const tokenPattern = /\d+(\.\d+)?|[+\-*/^(),]|[a-zA-Z_]\w*/g;
            const tokens = input.match(tokenPattern);
            if (!tokens) return NaN;

            const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
            const rightAssociative = new Set(['^']);

            const outputQueue = [];
            const operatorStack = [];

            tokens.forEach(token => {
                if (!isNaN(token)) {
                    outputQueue.push(parseFloat(token));
                } else if (token in constants) {
                    outputQueue.push(constants[token]);
                } else if (token in functions) {
                    operatorStack.push(token);
                } else if ('+-*/^'.includes(token)) {
                    while (
                        operatorStack.length &&
                        ('+-*/^'.includes(operatorStack[operatorStack.length - 1]) || operatorStack[operatorStack.length - 1] in functions) &&
                        ((rightAssociative.has(token)
                            ? precedence[token] < precedence[operatorStack[operatorStack.length - 1]]
                            : precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]))
                        ) {
                        outputQueue.push(operatorStack.pop());
                    }
                    operatorStack.push(token);
                } else if (token === '(') {
                    operatorStack.push(token);
                } else if (token === ')') {
                    while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                        outputQueue.push(operatorStack.pop());
                    }
                    if (operatorStack.length === 0) throw new Error('Mismatched parentheses');
                    operatorStack.pop(); // remove '('
                    if (operatorStack.length && operatorStack[operatorStack.length - 1] in functions) {
                        outputQueue.push(operatorStack.pop());
                    }
                } else {
                    throw new Error('Unknown token: ' + token);
                }
            });

            while (operatorStack.length) {
                const op = operatorStack.pop();
                if (op === '(' || op === ')') throw new Error('Mismatched parentheses');
                outputQueue.push(op);
            }

            const stack = [];
            for (const token of outputQueue) {
                if (typeof token === 'number') {
                    stack.push(token);
                } else if (token in functions) {
                    if (token === 'pow') {
                        const exponent = stack.pop();
                        const base = stack.pop();
                        stack.push(functions[token](base, exponent));
                    } else if (token === 'atan2') {
                        const x = stack.pop();
                        const y = stack.pop();
                        stack.push(functions[token](y, x));
                    } else {
                        const arg = stack.pop();
                        stack.push(functions[token](arg));
                    }
                } else {
                    const b = stack.pop();
                    const a = stack.pop();
                    switch (token) {
                        case '+': stack.push(a + b); break;
                        case '-': stack.push(a - b); break;
                        case '*': stack.push(a * b); break;
                        case '/': stack.push(a / b); break;
                        case '^': stack.push(Math.pow(a, b)); break;
                    }
                }
            }

            if (stack.length !== 1) throw new Error('Invalid expression');
            return stack[0];
        }
    }
}
