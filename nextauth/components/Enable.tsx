import { ReactNode } from 'react'
import { useEnable } from '../hooks/useEnable'

interface EnableProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

export function Enable({ children, permissions, roles }: EnableProps) {
  const userEnableSeeComponent = useEnable({ permissions, roles });

  if (!userEnableSeeComponent) {
    return null;
  }

  return (
    <>
      {children}
    </>
  )
}