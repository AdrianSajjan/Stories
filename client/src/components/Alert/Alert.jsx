import React from 'react'
import { useHistory } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { removeAlert } from '../../actions/alert'

const Alert = ({ alert, removeAlert }) => {
  const { type, header, msg, active, redirect, callback } = alert
  const history = useHistory()
  const CloseModal = () => {
    removeAlert()
    if (redirect !== '') history.push(redirect)
    if (callback) callback()
  }

  return (
    <Modal isOpen={active} toggle={CloseModal}>
      <ModalHeader className={`text-${type}`} toggle={CloseModal}>
        {header}
      </ModalHeader>
      <ModalBody className={`text-${type}`}>{msg}</ModalBody>
      <ModalFooter>
        <Button onClick={CloseModal} color={type}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

Alert.propTypes = {
  alert: PropTypes.object.isRequired,
  removeAlert: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  alert: state.alert
})

const mapDispatchToProps = (dispatch) => ({
  removeAlert: () => dispatch(removeAlert())
})

export default connect(mapStateToProps, mapDispatchToProps)(Alert)
