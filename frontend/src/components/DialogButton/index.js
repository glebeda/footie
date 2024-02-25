import React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme, variant }) => ({
  margin: theme.spacing(1),
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.primary.main}`
  }),
  ...(variant === 'contained' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  })
}))

const DialogButton = ({ children, variant, onClick, ...props }) => {
  return (
    <StyledButton variant={variant} onClick={onClick} {...props}>
      {children}
    </StyledButton>
  )
}

export default DialogButton
