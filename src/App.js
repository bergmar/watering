// import logo from './logo.svg';
import './App.css'
import { useState, useEffect } from 'react'
import cloneDeep from 'clone-deep'

function App() {
  const [autoRun, setAutoRun] = useState(false)
  const [areaRounds, setAreaRounds] = useState(0)
  const [areaRepeats, setAreaRepeats] = useState(0)
  const [towardsAreaPosition, setTowardsAreaPosition] = useState(1)
  const [currentArea, setCurrentArea] = useState(1)
  const [robotPos, setRobotPos] = useState(0)
  const [areas, setAreas] = useState([])
  const manualChangeAmount = 30
  const autoChangeAmount = 1
  const minPos = -90
  const maxPos = 90

  useEffect(() => {
    addArea()
  }, [])

  const setAreaData = (area, key, pos) => {
    const areasClone = cloneDeep(areas)
    const item = areasClone.find(({ id }) => id === area)
    item[key] = pos
    setAreas(areasClone)
  }
  const getAreaData = (area, key) => {
    const foundArea = areas.find(({ id }) => id === area)
    return foundArea ? foundArea[key] : ''
  }

  const turnRobotLeft = () => {
    const target = robotPos - manualChangeAmount
    if (robotPos !== minPos)
      setRobotPos(target < minPos ? minPos : robotPos - manualChangeAmount)
  }

  const turnRobotRight = () => {
    const target = robotPos + manualChangeAmount
    if (robotPos !== maxPos)
      setRobotPos(target > maxPos ? maxPos : robotPos + manualChangeAmount)
  }

  const setCurrentAsStartPos = (area) => {
    setAreaData(area, 'start', robotPos)
  }

  const setCurrentAsEndPos = (area) => {
    setAreaData(area, 'end', robotPos)
  }

  const toggleProgram = () => {
    if (!autoRun) {
      setAreaRepeats(0)
      setTowardsAreaPosition(1)
      setCurrentArea(1)
      setAutoRun(true)
    } else setAutoRun(false)
  }

  const stopProgram = () => {
    // Stop program
    setAutoRun(false)
    // Reset state
    setTowardsAreaPosition(1)
    setCurrentArea(1)
    console.log('Program stopped!')
  }

  const addArea = () => {
    console.log('areas for now', areas)
    const newArea = {
      id: areas.length ? areas[areas.length - 1].id + 1 : 1,
      start: 0,
      end: 0,
      qty: 3
    }
    setAreas([...areas, newArea])
  }

  const removeArea = (area) => {
    setAreas(areas.filter(({ id }) => id !== area))
  }

  useEffect(() => {
    if (autoRun) {
      if (
        robotPos !==
        getAreaData(currentArea, towardsAreaPosition === 1 ? 'start' : 'end')
      ) {
        setTimeout(() => {
          const targetPos = getAreaData(
            currentArea,
            towardsAreaPosition === 1 ? 'start' : 'end'
          )
          const moveAmount =
            robotPos > targetPos
              ? (robotPos - targetPos) * -1
              : targetPos - robotPos
          console.log('move amount', moveAmount)
          setRobotPos(robotPos + moveAmount)
        }, 300)
      } else {
        // Position (start or end) reached, now go for next (start or end).
        setTowardsAreaPosition(towardsAreaPosition === 1 ? 2 : 1)
        if (towardsAreaPosition === 2) setAreaRounds(areaRounds + 1)
        if (areaRounds === getAreaData(currentArea, 'qty')) {
          setTowardsAreaPosition(1)
          setAreaRounds(0)
          const nextArea = currentArea + 1
          console.log(areas.length + '  <' + nextArea, areas.length < nextArea)
          if (areas.length >= nextArea) setCurrentArea(nextArea)
          else stopProgram()
        }
      }
    }
  }, [autoRun, robotPos, currentArea, towardsAreaPosition])
  return (
    <div className='App'>
      autoRun: {String(autoRun)}
      <br />
      areas: {JSON.stringify(areas)}
      <br />
      currentArea: {currentArea}
      <br />
      towards: {towardsAreaPosition}
      <br />
      areaRounds: {areaRounds}
      <header className='App-header'></header>
      <h1>Welcome</h1>
      {areas.map((area) => (
        <div
          style={{
            border: 'grey solid 1px',
            padding: '5px',
            margin: '10px 5px'
          }}
          key={area.id}
        >
          Områdesrepetition:{areaRepeats}
          <h2 style={{ margin: 0, fontSize: '13px' }}>Område {area.id}</h2>
          <button onClick={() => setCurrentAsStartPos(area.id)}>
            Ställ in Start
          </button>
          <button onClick={() => setCurrentAsEndPos(area.id)}>
            Ställ in Slut
          </button>
          Start: {getAreaData(area.id, 'start')}° End:
          {getAreaData(area.id, 'end')}°
          {area.id > 1 && (
            <button onClick={() => removeArea(area.id)}>Ta bort område</button>
          )}
        </div>
      ))}
      <button onClick={addArea}>+ Lägg till område</button>
      <div className='robot-simulator'>
        The robots current location: {robotPos}°
        <div
          style={{
            position: 'relative',
            background: 'grey',
            width: '100px',
            height: '100px',
            borderRadius: '100px'
          }}
        >
          <div
            style={{
              width: '5px',
              height: '100%',
              background: 'transparent',
              position: 'absolute',
              left: '50%',
              transform: `rotate(${robotPos}deg)`
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                border: 'white solid 2px',
                borderLeft: '0',
                borderBottom: '0',
                transform: ' translateY(4px) rotate(-45deg)'
              }}
            ></div>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            turnRobotLeft()
          }}
        >
          &laquo;
        </button>
        <button
          onClick={() => {
            turnRobotRight()
          }}
        >
          &raquo;
        </button>
      </div>
      <button onClick={() => toggleProgram()}>
        {autoRun ? 'Stop' : 'Start'} program
      </button>
    </div>
  )
}

export default App
