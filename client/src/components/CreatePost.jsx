    import { AddIcon } from '@chakra-ui/icons'
    import { Image,Input,Button, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Textarea, useColorMode, useColorModeValue, useDisclosure,ModalFooter, Flex, CloseButton } from '@chakra-ui/react'
    import React, { useRef, useState } from 'react'
    import usePreviewImg from '../hooks/usePreviewImg'
    import { BsFillImageFill } from 'react-icons/bs'
    import { useRecoilValue } from 'recoil'
    import userAtom from '../atoms/userAtom'
    import useShow from '../hooks/useShow'

    const MAX_CHAR = 500
    const CreatePost = () => {
        const { isOpen, onOpen, onClose } = useDisclosure()
        const [postText,setPostText] = useState("")
        const { handleImageChange, imgUrl,setImgUrl } = usePreviewImg();
        const [remainingChar,setRemaingChar] = useState(MAX_CHAR)
        const user = useRecoilValue(userAtom)
        const showToast = useShow()

        const [loading,setLoading] = useState(false) 

        const imageRef = useRef(null)
        const handleTextChange = (e) =>{
            const inputText = e.target.value

            if(inputText.length>MAX_CHAR)
            {
                const newText = inputText.slice(0,MAX_CHAR)

                setPostText(newText)
                setRemaingChar(0)
            }

            else
            {
                setPostText(inputText)
                setRemaingChar(MAX_CHAR-inputText.length)
            }
        }
        
        const handleCreatePost = async () =>{
            setLoading(true)
            try{
                const res = await fetch("/api/posts/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
                });
    
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                showToast("Success", "Post created successfully", "success");
                onClose()
    
            }
            catch (error){
                showToast("Error",error,"error")
            } finally{
                setLoading(false)
            }
        }
    return (
        <>
            <Button
            position={"fixed"}
            bottom={10}
            right={10}
            leftIcon={<AddIcon />}
            bg={useColorModeValue("gray.300","gray.dark")}
            onClick={onOpen}>
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />

            <ModalContent>
            <ModalHeader>Add a 🆕 Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <FormControl>
                    <Textarea placeholder='Add post content here'
                    onChange={handleTextChange}
                    value={postText}
                    />
                <Text fontSize ="xs" 
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}>{remainingChar}/{MAX_CHAR}</Text>
        
                <Input 
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
                />


                <BsFillImageFill 
                style={{marginLeft:"5px",cursor:"pointer"}} size={16} onClick={()=>imageRef.current.click()}/>
                </FormControl>

                {imgUrl && (
                    <Flex mt={5} w={"full"} position={"relative"}>
                        <Image src={imgUrl} alt="Selected Image"/>
                        <CloseButton 
                            onClick={() => {
                                setImgUrl("")
                            }}

                            bg={"gray.800"}
                            position={"absolute"}
                            top={2}
                            right={2}

                        />
                    </Flex>
                )}

            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleCreatePost}
                isLoading={loading}>
                Post
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
    }

    export default CreatePost
