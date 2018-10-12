import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Item from './Item'
import debounce from 'lodash/debounce'

const styles = theme => ({
  slotTd: {
    position: 'relative',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    padding: 0,
    height: 45,
    overflow: 'visible',
    whiteSpace: 'nowrap'
  }
})

const getItemPosition = (
  slotWidth,
  slotDuration,
  slotTime,
  fromTime,
  toTime
) => ({
  from: ((fromTime - slotTime) / slotDuration) * slotWidth,
  to: ((toTime - slotTime) / slotDuration) * slotWidth
})

class Slot extends Component {
  onDragOver = e => {
    // debugger
    e.preventDefault()
    // const data = e.dataTransfer.getData('text')

    // const draggedAtTime = e.dataTransfer.getData('draggedAtTime')
    // debugger
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    // console.log(rect.top, rect.right, rect.bottom, rect.left)
    // console.log('onDragOver', e.target)
    this.props.onDragOver(x)
  }

  onDrop = e => {
    const data = e.dataTransfer.getData('text')
    console.log('onDrop', data)
  }
  render() {
    const {
      classes,
      items,
      itemIdField,
      slotWidth,
      slotTime,
      slotDuration
    } = this.props
    return (
      <td
        className={classes.slotTd}
        style={{ width: slotWidth }}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        {items.map(it => (
          <Item
            onDragStart={this.props.onItemDragStart}
            onDragEnd={this.props.onItemDragEnd}
            key={it[itemIdField]}
            data={it}
            position={getItemPosition(
              slotWidth,
              slotDuration,
              slotTime,
              it._fromTime,
              it._toTime
            )}
          />
        ))}
      </td>
    )
  }
}

Slot.propTypes = {
  slotTime: PropTypes.number.isRequired,
  slotWidth: PropTypes.number,
  slotDuration: PropTypes.number.isRequired
}

Slot.defaultProps = {
  width: 80
}

export default withStyles(styles)(Slot)
