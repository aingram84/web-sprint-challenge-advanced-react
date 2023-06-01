import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initX = 2;
const initY = 2;
const URL = 'http://localhost:9000/api/result';

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  initX: initX,
  initY: initY
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super();
    this.state = { x: initX, y: initY, xy: initialIndex, steps: initialSteps, message: initialMessage, formValues: '' }
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`(${this.state.x},${this.state.y})`);
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    // console.log(`pre state RESET: X: ${this.state.x} Y: ${this.state.y} XY: ${this.state.xy} Steps: ${this.state.steps}`)
    this.setState({ x: initX, y: initY, xy: initialIndex, steps: initialSteps, message: initialMessage, formValues: '' });
    return ({ x: initX, y: initY, xy: initialIndex, steps: initialSteps, message: initialMessage, formValues: '' })
    // console.log(`post state RESET: X: ${this.state.x} Y: ${this.state.y} XY: ${this.state.xy} Steps: ${this.state.steps}`)
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction == 'up') {
      if (this.state.y - 1 === 0) {
        return ({ x: this.state.x, y: this.state.y, xy: this.state.xy, steps: this.state.steps, message: "test" })
      }
      return ({ x: this.state.x, y: this.state.y - 1, xy: this.state.xy - 3, steps: this.state.steps + 1 })
    }
    if (direction == 'right') {
      if (this.state.x + 1 === 4) {
        return ({ x: this.state.x, y: this.state.y, xy: this.state.xy, steps: this.state.steps, message: "You can't go right" })
      }
      return ({ x: this.state.x + 1, y: this.state.y, xy: this.state.xy + 1, steps: this.state.steps + 1 })
    }
    if (direction == 'down') {
      if (this.state.y + 1 === 4) {
        return ({ x: this.state.x, y: this.state.y, xy: this.state.xy, steps: this.state.steps, message: "You can't go down" })
      }
      return ({ x: this.state.x, y: this.state.y + 1, xy: this.state.xy + 3, steps: this.state.steps + 1 })
    }
    if (direction == 'left') {
      if (this.state.x - 1 === 0) {
        return ({ x: this.state.x, y: this.state.y, xy: this.state.xy, steps: this.state.steps, message: "You can't go left" })
      }
      return ({ x: this.state.x - 1, y: this.state.y, xy: this.state.xy - 1, steps: this.state.steps + 1 })
    }
  }


  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    console.log(`EVENT TARGET in move func ${evt.target.id}`);
    let nextMove = this.getNextIndex(evt.target.id);
    console.log(`nextMove -- ${JSON.stringify(nextMove)}`);
    console.log(`nextMoveX and nextMoveY: (${nextMove.x},${nextMove.y}) this.getXY: ${this.getXY()}`)
    if (`(${nextMove.x},${nextMove.y})` === this.getXY()) {
      console.log("In Move Conditional");
      return this.setState({
        message: `You can't go ${evt.target.id}`
      })
    }
    this.setState({ ...this.state, message: initialMessage, x: nextMove.x, y: nextMove.y, steps: nextMove.steps, xy: nextMove.xy })
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({ formValues: evt.target.value });
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const moveToMake = { x: this.state.x, y: this.state.y, steps: this.state.steps, email: this.state.formValues };
    axios.post(URL, moveToMake)
      .then(({ data }) => {
        // console.log(`DATA: ${JSON.stringify(data)}`)
        this.setState({ message: data.message })
      })
      .finally(this.setState({ formValues: '' }));
    // this.reset();
    
  }

  moveBox = () => {
    const moveToMake = { x: this.state.x, y: this.state.y, steps: this.state.steps, email: this.state.formValues };
    axios.post(URL, moveToMake)
      .then(({ data }) => {
        this.setState({ message: data.message })
      })
      .finally(this.setState({ formValues: '' }));
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXY()}</h3>
          { this.state.steps === 1 ? <h3 id="steps">You moved {this.state.steps} time</h3> : <h3 id="steps">You moved {this.state.steps} times</h3> }
       </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.xy ? ' active' : ''}`}>
                {idx === this.state.xy ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          { this.state.formValues === 'foo@bar.baz' ? <h3 id="message" data-testid='message'>Forbidden!</h3> : 
          <h3 id="message" data-testid='message'>{this.state.message}</h3>
        }
        </div>
        <div id="keypad">
          <button id="left" data-testid="left" onClick={(evt) => this.move(evt)}>LEFT</button>
          <button id="up" data-testid="up" onClick={(evt) => this.move(evt)}>UP</button>
          <button id="right" data-testid="right" onClick={(evt) => this.move(evt)}>RIGHT</button>
          <button id="down" data-testid="down" onClick={(evt) => this.move(evt)}>DOWN</button>
          <button id="reset" data-testid="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={(evt) => this.onSubmit(evt)}>
          <input id="email" type="text" placeholder="type email" value={this.state.formValues} onChange={(evt) => this.onChange(evt)}></input>
          <input id="submit" data-testid="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
