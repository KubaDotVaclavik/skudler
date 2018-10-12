import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Skudler from './Skudler/index'

class App extends Component {
  state = {
    timelines: [
      { id: 'tl1', name: 'Dock1' },
      { id: 'tl2', name: 'Dock2' },
      { id: 'tl3', name: 'Dock3' }
    ],
    items: [
      {
        id: 'it1',
        timelineId: 'tl1',
        name: 'item1',
        from: new Date(2018, 9, 10, 5, 0),
        to: new Date(2018, 9, 10, 8, 30)
      },
      {
        id: 'it2',
        timelineId: 'tl1',
        name: 'item2',
        from: new Date(2018, 9, 10, 12, 45),
        to: new Date(2018, 9, 10, 14, 0)
      },
      {
        id: 'it3',
        timelineId: 'tl2',
        name: 'item3',
        from: new Date(2018, 9, 10, 5, 45),
        to: new Date(2018, 9, 10, 7, 30)
      }
    ]
  }
  onSkudlerChange = d => {
    const items = this.state.items.map(it => (it.id === d.id ? d : it))
    this.setState({
      items
    })
  }
  render() {
    const { timelines, items } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Skudler
          timelines={timelines}
          items={items}
          onChange={this.onSkudlerChange}
        />
      </div>
    )
  }
}

export default App
