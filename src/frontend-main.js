import React from 'react'
import framework from './FrameworkClient'
import registerActions from 'ACTIONS_MODULE'
import MainComponent from 'MAIN_COMPONENT_MODULE'

// Register actions
registerActions(framework)

framework.render(<MainComponent />)
