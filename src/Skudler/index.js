import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slot from './Slot'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  contentTable: {
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    width: 80 * 24
  },
  row: {}
})

class Skudler extends Component {
  slots = [...Array(24).keys()].map(slot => ({
    time: new Date(2018, 9, 10, slot).getTime()
  }))

  prevTime = null
  prevTimelineId = null
  t = 0

  state = {
    movingItem: null
  }

  itemsByTimelines() {
    const {
      timelines,
      items,
      timelineIdField: tlId,
      itemTimelineIdField: itTlId,
      itemFromTimeField: itFrom,
      itemToTimeField: itTo
    } = this.props

    const itemsCopy = [...items]
    if (this.state.movingItem) {
      itemsCopy.push(this.state.movingItem)
    }

    return timelines.reduce(
      (prev, curr) => ({
        [curr[tlId]]: itemsCopy
          .filter(it => it[itTlId] === curr[tlId])
          .map(it => ({
            ...it,
            _fromTime: it[itFrom].getTime(),
            _toTime: it[itTo].getTime()
          })),
        ...prev
      }),
      {}
    )
  }

  onItemDragStart = data => {
    // data.draggedAtTime
    // data.item
    this.movingItem = data
  }
  onItemDragEnd = () => {
    const { itemIdField } = this.props
    const item = {
      ...this.state.movingItem,
      [itemIdField]: this.movingItem.item[itemIdField]
    }
    delete item._fromTime
    delete item._toTime

    this.props.onChange(item)
    this.movingItem = null
    this.setState({ movingItem: null })
  }
  onSlotDragOver = (x, timelineId, slotTime) => {
    const {
      itemTimelineIdField,
      itemIdField,
      itemFromTimeField,
      itemToTimeField,
      slotDuration,
      stepDuration,
      slotWidth
    } = this.props

    const { _fromTime, _toTime } = this.movingItem.item

    let from =
      slotTime - this.movingItem.draggedAtTime + (x / slotWidth) * slotDuration
    from = from - (from % stepDuration)

    if (this.prevTime === from && this.prevTimelineId === timelineId) {
      return
    }
    this.prevTime = from
    this.prevTimelineId = timelineId

    const diff = _toTime - _fromTime

    const to = from + diff

    if (this.movingItem) {
      const movingItem = {
        ...this.movingItem.item,
        [itemIdField]: 'moving',
        [itemTimelineIdField]: timelineId,
        [itemFromTimeField]: new Date(from),
        [itemToTimeField]: new Date(to),
        _fromTime: from,
        _toTime: to
      }

      this.setState({ movingItem })
    }
  }

  render() {
    const {
      classes,
      timelines,
      slotDuration,
      slotWidth,
      itemIdField,
      timelineIdField: tlId
    } = this.props

    const items = this.itemsByTimelines()

    return (
      <div>
        <table className={classes.contentTable}>
          <tbody>
            {timelines.map(tl => (
              <tr key={tl[tlId]}>
                {this.slots.map(slot => {
                  const its = (items[tl[tlId]] || []).filter(
                    it =>
                      it._fromTime >= slot.time &&
                      it._fromTime < slot.time + slotDuration
                  )

                  return (
                    <Slot
                      key={slot.time}
                      slotTime={slot.time}
                      slotDuration={slotDuration}
                      slotWidth={slotWidth}
                      items={its}
                      itemIdField={itemIdField}
                      onItemDragStart={this.onItemDragStart}
                      onItemDragEnd={this.onItemDragEnd}
                      onDragOver={x =>
                        this.onSlotDragOver(x, tl[tlId], slot.time)
                      }
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

Skudler.propTypes = {
  onChange: PropTypes.func.isRequired,
  slotDuration: PropTypes.number,
  stepDuration: PropTypes.number,
  slotWidth: PropTypes.number,
  timelineIdField: PropTypes.string,
  itemFromTimeField: PropTypes.string,
  itemToTimeField: PropTypes.string,
  itemTimelineIdField: PropTypes.string,
  itemIdField: PropTypes.string,
  timelines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string
    }).isRequired
  ),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      timelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string
    }).isRequired
  )
}

Skudler.defaultProps = {
  slotDuration: 60 * 60 * 1000, // 1 hour
  stepDuration: 15 * 60 * 1000,
  slotWidth: 80,
  timelineIdField: 'id',
  itemIdField: 'id',
  itemTimelineIdField: 'timelineId',
  itemFromTimeField: 'from',
  itemToTimeField: 'to'
}

export default withStyles(styles)(Skudler)
