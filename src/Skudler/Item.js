import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'

const styles = theme => ({
  root: {
    zIndex: 10,
    position: 'absolute',
    boxSizing: 'border-box',
    top: 4,
    height: 35,
    backgroundColor: '#69D4FF',
    border: '1px solid #5AB6DB',
    borderRadius: 2
  },
  moving: { opacity: 0.7 },
  draggable: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  }
})

class Item extends Component {
  state = {
    moving: false
  }

  onDragStart = e => {
    const crt = e.currentTarget.cloneNode(true)
    crt.style.display = 'none'
    e.dataTransfer.setDragImage(crt, 0, 0)

    const { _fromTime, _toTime } = this.props.data
    const { from, to } = this.props.position

    const data = {
      draggedAtTime:
        (e.nativeEvent.layerX / (to - from)) * (_toTime - _fromTime),
      item: { ...this.props.data }
    }

    this.setState({ moving: true })
    this.props.onDragStart(data)
  }
  onDragEnd = e => {
    this.setState({ moving: false })
    this.props.onDragEnd()
  }
  render() {
    const { classes, data, position } = this.props

    return (
      <div
        style={{ left: position.from, width: position.to - position.from }}
        className={classnames(classes.root, {
          [classes.moving]: this.state.moving
        })}
        draggable
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        {data.name}
      </div>
    )
  }
}

Item.propTypes = {
  duration: PropTypes.number
}

export default withStyles(styles)(Item)
