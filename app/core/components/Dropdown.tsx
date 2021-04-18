import { Box, Flex, Link, ResponsiveValue, Text, useColorModeValue } from "@chakra-ui/react"
import * as CSS from "csstype"
import React, { useRef } from "react"
import useOutsideAlerter from "../hooks/useOutsideAlerter"

const Summary: React.FunctionComponent<{
  href?: string
}> = ({ children, href }) => {
  if (href) {
    return <Link href={href}>{children}</Link>
  }
  return <summary>{children}</summary>
}

const ItemSeparator = () => {
  return <Box w="full" bg="gray.200" />
}

const Item: React.FunctionComponent<{
  title?: string
  icon?: JSX.Element
  href?: string
  onClick?: (itemTitle?: string) => void
  render?: () => JSX.Element
}> = ({ children, title, icon, onClick, href, render }) => {
  const bg = useColorModeValue("white", "gray.500")
  const renderChildren = () => (
    <Flex
      direction="row"
      alignItems="center"
      p="12px 20px"
      cursor="pointer"
      _hover={{
        bg,
      }}
      onClick={() => {
        onClick?.(title)
      }}
    >
      {children || (
        <>
          <Text mr="8px">{title}</Text>
          {icon || null}
        </>
      )}
    </Flex>
  )

  return href ? (
    <Link href={href}>{renderChildren()}</Link>
  ) : (
    <React.Fragment>{renderChildren()}</React.Fragment>
  )
}

type AbsoluteValue = ResponsiveValue<CSS.Property.Right<string | 0 | number>>
const Dropdown: React.FunctionComponent<{
  top?: AbsoluteValue
  right?: AbsoluteValue
  left?: AbsoluteValue
  bottom?: AbsoluteValue
  onClickItemWithKey?: (key: string) => void
}> & {
  Item: typeof Item
  Summary: typeof Summary
  ItemSeperator?: typeof ItemSeparator
} = ({ children, onClickItemWithKey, ...props }) => {
  let summaryChild: any
  const otherChildren: any[] = []

  React.Children.forEach(
    (children as any[]).filter((c) => !!c),
    (child: any) => {
      if (child.type.name === "Summary") {
        summaryChild = child
      } else if (child.type.name === "Item") {
        otherChildren.push(
          React.cloneElement(child, {
            ...child.props,
            onClick: () => {
              child.props?.onClick?.()
              onClickItemWithKey?.(child.key)
              onClickOutside()
            },
          })
        )
      } else {
        otherChildren.push(child)
      }
    }
  )

  const onClickOutside = React.useCallback(() => {
    wrapperRef.current.open = false
  }, [])

  const wrapperRef = useRef<any>(null)
  useOutsideAlerter(wrapperRef, onClickOutside)

  const bg = useColorModeValue("gray.50", "gray.600")

  if (otherChildren.length === 0) {
    return summaryChild
  }

  return (
    <details ref={wrapperRef}>
      {summaryChild}
      <Flex
        direction="column"
        position="absolute"
        zIndex={999}
        borderRadius="md"
        boxShadow="md"
        bg={bg}
        {...props}
      >
        {otherChildren}
      </Flex>
    </details>
  )
}

Dropdown.Item = Item
Dropdown.Summary = Summary
Dropdown.ItemSeperator = ItemSeparator

export default Dropdown
