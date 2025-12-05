import { Bot } from "./Bot.js";
import { v4 as uuidv4 } from "uuid";
import {CustomElement} from "./CustomElement.js";

export class ActionManager {
  id = uuidv4();
  trigger = {};
  actions = [];
  edges = [];
  onReturn = () => {};
  onContinue = () => {};
  onBreak = () => {};
  variables = new Map();

  constructor(trigger, onReturn = () => {}, onContinue = () => {}, onBreak = () => {}) {
    this.trigger = trigger;
    this.actions = trigger.actions;
    this.edges = trigger.edges;
    this.trigger.lastManager = this
    this.onReturn = onReturn;
    this.onContinue = onContinue;
    this.onBreak = onBreak;
  }

  runNext(id, output) {
    const edges = this.edges.filter(
      (edge) => edge.source === id && edge.sourceHandle === output
    );
    edges.forEach(edge => {
      const action = this.actions.find((act) => act.id === edge.target);
      if(!action) return;
      if (Bot.debugger?.breakPoints.includes(action.id)) return;
      action.run({
        actionManager: this,
        setVariable: this.setVariable.bind(this.trigger),
        getVariable: this.getVariable.bind(this.trigger),
      });
    })
  }

  parseFields(data) {
    const parsed = new Map();
    const variables = {};
    this.variables.keys().forEach((key) => {
      variables[key] = this.variables.get(key);
    });
    data.keys().forEach((item) => {
      let result = data.get(item);
      if (typeof result !== "string") {
        if (
            Array.isArray(result) && result.every((el) => el instanceof CustomElement)
        ) {
          const elements = [];
          result.forEach((item) => {
            const obj = { ...item, data: this.parseFields(item.data) };
            elements.push(obj);
          });
          return parsed.set(item, elements);
        } else return parsed.set(item, result);
      }
      parsed.set(item, this.eval(result, variables));
    });
    return parsed;
  }

  setVariable(name, value) {
    if(!name) return;
    this.variables.set(name, value);
    Bot.sendVariablesData(this.trigger, this.variables);
  }

  getVariable(name) {
    if(!name) return;
    return this.variables.get(name);
  }

  eval(text, variables) {
    let result = "";
    let i = 0;

    while (i < text.length) {
      if (text[i] === "$" && text[i + 1] === "{") {
        let depth = 1;
        let j = i + 2;

        while (j < text.length && depth > 0) {
          if (text[j] === "{" && text[j - 1] !== "\\") depth++;
          else if (text[j] === "}" && text[j - 1] !== "\\") depth--;
          j++;
        }

        const expr = text.slice(i, j);
        try {
          result += eval("`" + expr + "`");
        } catch (e) {
          result += expr;
        }
        i = j;
      } else if (text[i] === "`" && text[i - 1] !== "\\") {
        result += "\\`";
        i++;
      } else {
        result += text[i++];
      }
    }
    return result;
  }
}
