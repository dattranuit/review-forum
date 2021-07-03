import React, { Fragment, useState } from 'react'
import { Confirm } from 'semantic-ui-react'


const ConfirmModal = ({header, content, handleConfirm, handleCancel}) => {

  return (<div>
    <Confirm
      style={{position: 'absolute',
        top: '50%',
        left: '50%',
        marginRight: '-50%',
        transform: "translate(-50%, -50%)",
        height: 200
      }}
      open={true}
      header={header}
      content={content}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      />
  </div>);
}


export default ConfirmModal;
