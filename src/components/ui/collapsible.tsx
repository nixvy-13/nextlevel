import * as React from "react"

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  defaultOpen?: boolean
}

interface CollapsibleContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined)

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("useCollapsible must be used within a Collapsible component")
  }
  return context
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ open, onOpenChange, children, defaultOpen = false, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open !== undefined ? open : defaultOpen)

    React.useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open)
      }
    }, [open])

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen)
      onOpenChange?.(newOpen)
    }

    return (
      <CollapsibleContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
        <div ref={ref} data-state={isOpen ? "open" : "closed"} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useCollapsible()

  return (
    <button
      ref={ref}
      onClick={(e) => {
        setIsOpen(!isOpen)
        onClick?.(e)
      }}
      data-state={isOpen ? "open" : "closed"}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

// No necesitamos agregar propiedades, React.HTMLAttributes ya provee todas las necesarias
type CollapsibleContentProps = React.HTMLAttributes<HTMLDivElement>

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ ...props }, ref) => {
    const { isOpen } = useCollapsible()
    return isOpen ? <div ref={ref} data-state="open" {...props} /> : null
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
export type { CollapsibleProps }
