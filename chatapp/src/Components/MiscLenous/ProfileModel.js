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

            <Modal onClose={onClose} isOpen={isOpen} isCentered  >
                <ModalContent >
                    <div className="container p-0" >
                        <div className="d-flex flex-wrap">
                            <div className="">
                                <ModalBody>
                                    <Image
                                        borderRadius="full"
                                        boxSize="15vmin"
                                        src={user.pic}
                                    />
                                </ModalBody>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                                <b>
                                    <div>{user.name}</div>
                                </b>
                                <div>
                                    Email: {user.email}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <ModalCloseButton /> */}
                    <ModalFooter>
                        <div className="btn border" onClick={onClose}>Close</div>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    )
}
