
import { useReducer } from "react";
import DigitButton  from "./DigitButton";
import OperationButton from "./OperationButton";
import './style.css';

export const actions = {
  addDigit: "add-digit",
  removeDigit: "remove-digit",
  clear: "clear",
  chooseOperation: "choose-operation",
  evaluate: "evaluate",
}

function reducer(state, {type, payload}) {
  switch(type) {
    case actions.addDigit:
      if (state.overwrite) {
        return {
          ...state,
          currentOperation: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperation === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperation.includes('.') ) {
        return state
      }
        return {
        ...state,
        currentOperation: `${state.currentOperation || ""}${payload.digit}`
      }
    case actions.chooseOperation: 
      if (state.currentOperation == null && state.previousOperation == null) {
        return state
      }
      if (state.currentOperation == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperation == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperation: state.currentOperation,
          currentOperation: null,
        }
      }
      return {
        ...state,
        previousOperation: evaluate(state),
        operation: payload.operation,
        currentOperation: null,
      }
    case actions.clear:
      return {}
    case actions.removeDigit:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperation: null,
        }
      if ( state.currentOperation == null) return this.state
      if ( state.currentOperation.length === 1) {
        return {
          ...state,
          currentOperation: null
        }
        return {
          ...state,
          currentOperation: state.currentOperation.slice(0, -1)
        }
      }
      } 
    case actions.evaluate:
      if(state.operation == null || state.currentOperation == null || state.previousOperation == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperation: null,
        operation: null,
        currentOperation: evaluate(state),
      }
  }
}


function evaluate({currentOperation, previousOperation, operation}){
  const prev = parseFloat(previousOperation)
  const current = parseFloat(currentOperation)

  if ( isNaN(prev) || isNaN(current)) return ""
  let math = ""
  switch (operation) {
    case "+":
      math = prev + current 
      break
    case "-":
      math = prev - current 
      break
    case "/":
      math = prev / current 
      break
    case "*":
      math = prev * current 
      break
  }
  return math.toString();
}

const INTEGER_FORMAT = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatNumber(number) {
  if (number == null) return
  const [integer, decimal] = number.split('.')
  if (decimal == null) return INTEGER_FORMAT.format(integer)
  return `${INTEGER_FORMAT.format(integer)}.${decimal}`
}

function App() {

  const [{currentOperation, previousOperation, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">

      <div className="output">
        <div className="previous-output"> {formatNumber(previousOperation)} {operation}</div>
        <div className="current-operation"> {formatNumber(currentOperation)} </div>
      </div>

      <button className="span-two" onClick={() => dispatch({type: actions.clear})}> AC </button>
      <button onClick={() => dispatch({type: actions.removeDigit})}> DEL </button>
      <OperationButton operation="/" dispatch={dispatch} />

      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type: actions.evaluate})}> = </button>

    </div>
  );
}

export default App;
