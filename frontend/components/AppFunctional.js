import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initX = 2;
const initY = 2;
const URL = 'http://localhost:9000/api/result';

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [x, setX] = useState(initX)
  const [y, setY] = useState(initY)
  const [xy, setXY] = useState(initialIndex)
  const [moves, setMoves] = useState(0)
  const [messages, setMessages] = useState(initialMessage)
  const [formValue, setFormValue] = useState('')

  const getXY = () => (`(${x}, ${y})`);

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMoves(0);
    setXY(initialIndex);
    setX(initX);
    setY(initY);
    setMessages(initialMessage);
    setFormValue('');
  }

  function getNextIndex(direction) {
    // console.log(`X is ${x} y is ${y} XY is ${xy}`)
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction == 'up') {
      if (y - 1 === 0) {
        setMessages("You can't go up")
        return xy;
      }
      setY(y - 1);
      setXY(xy - 3);
    }
    
    if (direction == 'right') {
      if (x + 1 === 4) {
        setMessages("You can't go right")
        
        return xy;
      }
      setX(x + 1);
      setXY(xy + 1);
    }
    if (direction == 'down') {
      if (y + 1 === 4) {
        setMessages("You can't go down")
        return xy;
      }
      setY(y + 1);
      setXY(xy + 3);
    }
    if (direction == 'left') {
      if (x - 1 === 0) {
        setMessages("You can't go left")
        return xy;
      }
      setX(x - 1);
      setXY(xy - 1);
    }
    setMoves(moves + 1);
    setMessages(initialMessage);
    return xy;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    getNextIndex(evt);
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setFormValue(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    // setFormValue('');
    const moveToMake = { "x": x, "y": y, "steps": moves, "email": formValue };
    // console.log(`MOVETOMAKE LOG: ${JSON.stringify(moveToMake)}`);
    axios.post(URL, moveToMake)
      .then(({ data }) => {
        
        if (formValue === 'foo@bar.baz') {
          // console.log(`FormValue: ${formValue}`);
          setMessages('Forbidden');
        } else setMessages(data.message)
      })
      .catch((err) => {
        // console.log(`ERROR HERE 2: ${JSON.stringify(err)}`);
        setMessages(err.response.data.message)
      })
      .finally(setFormValue(''));
    // reset();
  }

  function moveBox() {
    const moveToMake = { "x": x, "y": y, "steps": moves, "email": formValue };
    axios.post(URL, moveToMake)
      .then(({ data }) => {
        if (formValue === 'foo@bar.baz') {
          console.log(`FormValue: ${formValue}`);
          setMessages('Forbidden!');
        } else setMessages(data.message)
      })
      .finally(setFormValue(''));
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXY()}</h3>
        { moves === 1 ? <h3 id="steps">You moved {moves} time</h3> : <h3 id="steps">You moved {moves} times</h3> }
        {/* <h3 id="steps">You moved {moves} times</h3> */}
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === xy ? ' active' : ''}`}>
              {idx === xy ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
      { {formValue} === 'foo@bar.baz' ? <h3 id="message" data-testid='message'>Forbidden!</h3> : 
          <h3 id="message" data-testid='message'>{messages}</h3> }
        {/* <h3 id="message" data-testid='message'>{messages}</h3> */}
      </div>
      <div id="keypad">
        <button id="left" data-testid="left" onClick={(evt) => move(evt.target.id)}>LEFT</button>
        <button id="up" data-testid="up" onClick={(evt) => move(evt.target.id)}>UP</button>
        <button id="right" data-testid="right" onClick={(evt) => move(evt.target.id)}>RIGHT</button>
        <button id="down" data-testid="down" onClick={(evt) => move(evt.target.id)}>DOWN</button>
        <button id="reset" data-testid="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={(evt) => onSubmit(evt)}>
        <input id="email" type="text" placeholder="type email" value={formValue} onChange={(evt) => onChange(evt)}></input>
        <input id="submit" data-testid="submit" type="submit"></input>
      </form>
    </div>
  )
}
