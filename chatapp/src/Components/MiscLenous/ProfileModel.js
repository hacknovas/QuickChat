import { ViewIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, IconButton, Text, Image, } from "@chakra-ui/react";
import React from 'react'

export default function ProfileModel({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // console.log(user)


    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent >
                    <div className="container px-0 " >
                        <div className="row">
                            <div className="col-5">

                                <ModalBody
                                    d="flex"
                                    flexDir="column"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Image
                                        borderRadius="full"
                                        boxSize="150px"
                                        src={user.pic}
                                    />
                                </ModalBody>
                            </div>
                            <div className="col-7">

                                <ModalHeader
                                    fontSize="40px"
                                    fontFamily="Work sans"
                                    d="flex"
                                    justifyContent="center"
                                >
                                    {user.name}
                                </ModalHeader>
                                <Text
                                    fontSize={{ base: "20px" }}
                                    fontFamily="Work sans"
                                >
                                    Email: {user.email}
                                </Text>

                            </div>
                        </div>
                    </div>
                    {/* <ModalCloseButton /> */}
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    )
}
