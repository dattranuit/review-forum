import React from 'react'
import { Loader, Image, Segment } from 'semantic-ui-react'

const LoaderExampleActive = (isLoading=false) => (
  <Segment>
    <Loader active={isLoading} />
    <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
  </Segment>
)

export default LoaderExampleActive
