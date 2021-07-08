import React, { useRef } from 'react'
import { Modal, Form, TextArea, Button } from 'semantic-ui-react'
import axios from 'axios'
import { host } from "../constant"
const ConfirmModal = ({ id, header, trigger, name }) => {

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState("");


  const handleReport = async () => {
    const res = await axios.post(`${host}/api/posts/${id}/report`, {
      reportedBy: name,
      reason: data
    },
      {
        headers: { "x-access-token": localStorage.getItem('x-access-token') }
      }
    );
    setOpen(false);
  }

  return (
    <Modal
      centered={true}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
      size={"small"}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginRight: '-50%',
        transform: "translate(-50%, -50%)",
        height: 250
      }}
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <TextArea onInput={(e)=>{setData(e.target.value)}} placeholder='Type reason here...' />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button
          content="Report"
          labelPosition='right'
          icon='checkmark'
          onClick={handleReport}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}


export default ConfirmModal;
