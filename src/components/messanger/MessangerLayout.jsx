import React, { useEffect, useRef, useState } from 'react';
import "./MessangerLayout.css";
import Messages from './Messages';
import Contacts from './Contacts';
import { io } from "socket.io-client";
// import noAvatar from "../../images/dp1.jpg";
import axios from "axios";

// import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import Channels from './Channels';


const MessangerLayout = ({ user }) => {

    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [currentChat, setCurrentChat] = useState([]);
    const [currentGroupChat, setCurrentGroupChat] = useState([])
    const [fetchMessage, setFetchMessage] = useState([]);
    const [fetchGroupConversation, setFetchGroupConversation] = useState([]);
    const [conversationId, setConversationId] = useState("");
    const [friends, setFriends] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const [updateContactList, setUpdateContactList] = useState(true);
    const [channels, setChannels] = useState([]);
    const [addFriendName, setaddFriendName] = useState("");
    const [call, setCall] = useState([false, false, false]);
    const scrollRef = useRef();
    const socket = useRef();

    const desc = useRef();
    const [file, setFile] = useState(null);

    const [viewGroupOptions, setViewGroupOptions] = useState(false);
    const [addingMember, setAddingMember] = useState(false);




    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState(user.displayName)
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()




    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data => {
            // console.log(data.senderEmail);
            setArrivalMessage({
                senderEmail: data.senderEmail,
                senderText: data.text,
                createdAt: Date.now()
            });
        });
        socket.current.on("informCallEnd", (data) => {
            // if (data.email !== user.emails[0].value) {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(function (track) {
                    track.stop();
                    // console.log(track);
                });
            }

            setCall([false, false, false])
            setStream("")
            setReceivingCall(false)
            setCaller("")
            setCallerSignal("")
            setCallAccepted(false)
            setCallEnded(false)
            myVideo.current = null
            userVideo.current = null
            connectionRef.current = null

            // socket.current.emit("callEnded", {
            //     mySocket: user.emails[0].value,
            //     userSocket: currentChat.email
            // });
            // }
        })

        socket.current.on("incomingCall", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setCallerSignal(data.signal)
            if (!call[0] && !call[1] && !call[2]) {
                // navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
                //     setStream(stream)
                //     myVideo.current.srcObject = stream
                // })
                setCall([false, true, false]);
                console.log("cc")
            }
        })
    }, []);

    useEffect(() => {
        if (file) {
            // console.log("file set")
        }
        else {
            // console.log("file unset");
        }
    }, [file])


    useEffect(() => {
        socket.current.emit("addUser", user.emails[0].value);
        socket.current.on("getUsers", users => {
            // console.log(users);
            setOnlineFriends(users);
        });
    }, [user.emails[0].value]);

    const addFriend = async (e) => {
        e.preventDefault();

        try {
            const infoFriend = {
                email: user.emails[0].value,
                newemail: addFriendName
            };

            const addingFriend = await axios.post("https://ventas-v1.herokuapp.com//users/follow", infoFriend);

            socket.current.emit("sendMessage", {
                senderEmail: user.emails[0].value,
                recieverEmail: addFriendName,
                text: ""
            });

            alert(addingFriend.data);
            setaddFriendName("");
            setUpdateContactList(!updateContactList);
        }
        catch (err) {
            console.log(err);
        }
    };
    const removeFriend = async (friendToremove) => {

        try {
            const infoFriend = {
                email: user.emails[0].value,
                newemail: friendToremove
            };

            const removingFriend = await axios.post("https://ventas-v1.herokuapp.com//users/unfollow", infoFriend);
            socket.current.emit("sendMessage", {
                senderEmail: user.emails[0].value,
                recieverEmail: friendToremove,
                text: ""
            });

            alert(removingFriend.data);
            setUpdateContactList(!updateContactList);
        }
        catch (err) {
            console.log(err);
        }
    };

    const addChannel = async (e) => {
        e.preventDefault();

        const infoFriend = {
            email: user.emails[0].value,
            channelName: addFriendName
        };

        const addingChannel = await axios.post("https://ventas-v1.herokuapp.com//Channels/create", infoFriend);
        alert(addingChannel.data);
        setaddFriendName("");
        setUpdateContactList(!updateContactList);
    }

    const deleteChannel = async (chanelToDelete, channelName) => {
        const infoFriend = {
            deletedBy: user.emails[0].value,
            channelId: chanelToDelete,
            nameOfChannel: channelName
        };

        const deletingChannel = await axios.post("https://ventas-v1.herokuapp.com//Channels/delete", infoFriend);
        alert(deletingChannel.data);
        setUpdateContactList(!updateContactList);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setNewMessage(newMessage);

        const newPost = {
            userEmail: user.emails[0].value,
            desc: desc.current.value,
        };

        if (file) {
            // console.log("file");
            const data = new FormData();
            const fileName = Date.now() + file.name.replaceAll(" ", "");
            const fileExt = file.name.split(".")[file.name.split(".").length - 1];
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;

            try {
                const upld = await axios.post("https://ventas-v1.herokuapp.com//upload", data);
                if (upld.status === 200) {
                    // console.log("upload ok");
                    // console.log(conversationId)

                    const message = {
                        conversationId: conversationId,
                        senderId: user.emails[0].value,
                        recieverId: currentChat.email,
                        text: { type: fileExt, src: "https://ventas-v1.herokuapp.com//images/" + fileName, message: newMessage }
                    };
                    // console.log(message.text);

                    socket.current.emit("sendMessage", {
                        senderEmail: user.emails[0].value,
                        recieverEmail: currentChat.email,
                        text: message.text.message
                    });

                    const sendMessage = await axios.post("https://ventas-v1.herokuapp.com//message/", message);
                    // console.log(sendMessage);
                    setFetchMessage([...fetchMessage, sendMessage.data]);
                    setNewMessage("");
                    setFile(null);
                }
                else {
                    console.log("upload failure");
                }
            } catch (err) {
                console.log(err)
            }
        }
        else {
            // console.log(conversationId)
            const message = {
                conversationId: conversationId,
                senderId: user.emails[0].value,
                recieverId: currentChat.email,
                text: { type: false, src: false, message: newMessage }
            };

            socket.current.emit("sendMessage", {
                senderEmail: user.emails[0].value,
                recieverEmail: currentChat.email,
                text: message.text.message
            });

            // console.log(message);
            const sendMessage = await axios.post("https://ventas-v1.herokuapp.com//message/", message);
            // console.log(sendMessage);
            setFetchMessage([...fetchMessage, sendMessage.data]);
            setNewMessage("");
        }
    };

    // ######################################################################################
    // ##################################### SUBMIT FOR GROUPS ##############################
    // ######################################################################################

    const handleGroupSubmit = async (e) => {
        e.preventDefault();

        setNewMessage(newMessage);

        const newPost = {
            userEmail: user.emails[0].value,
            desc: desc.current.value,
        };

        if (file) {
            // console.log("file");
            const data = new FormData();
            const fileName = Date.now() + file.name.replaceAll(" ", "");
            const fileExt = file.name.split(".")[file.name.split(".").length - 1];
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;

            try {
                const upld = await axios.post("https://ventas-v1.herokuapp.com//upload", data);
                if (upld.status === 200) {
                    // console.log("upload ok");
                    // console.log(conversationId)
                    let myDate = new Date("Y-m-dTh-m-s");
                    const message = {
                        conId: currentGroupChat._id,
                        senderEmail: user.emails[0].value,
                        recieverEmail: user.emails[0].value,
                        text: { type: fileExt, src: "https://ventas-v1.herokuapp.com//images/" + fileName, message: newMessage, createdAt: myDate }
                    };
                    // console.log(message.text);

                    socket.current.emit("sendMessage", {
                        conId: currentGroupChat._id,
                        senderEmail: user.emails[0].value,
                        recieverEmail: user.emails[0].value,
                        text: message.text.message
                    });

                    const sendGroupconversation = await axios.post("https://ventas-v1.herokuapp.com//channels/sendMessage", message);
                    console.log(sendGroupconversation.data[0].channelMessages.length - 1);
                    setFetchGroupConversation([...fetchGroupConversation, sendGroupconversation.data[0].channelMessages[sendGroupconversation.data[0].channelMessages.length - 1]]);
                    setNewMessage("");
                    setFile(null);
                }
                else {
                    console.log("upload failure");
                }
            } catch (err) {
                console.log(err)
            }
        }
        else {
            // console.log(conversationId)
            const message = {
                conId: currentGroupChat._id,
                senderEmail: user.emails[0].value,
                recieverEmail: user.emails[0].value,
                text: { type: false, src: false, message: newMessage, createdAt: new Date() }
            };

            socket.current.emit("sendMessage", {
                conId: currentGroupChat._id,
                senderEmail: user.emails[0].value,
                recieverEmail: user.emails[0].value,
                text: message.text.message
            });

            // console.log(message);
            const sendGroupconversation = await axios.post("https://ventas-v1.herokuapp.com//channels/sendMessage/", message);
            // console.log(sendGroupconversation.data[0].channelMessages.length - 1);
            setFetchGroupConversation([...fetchGroupConversation, sendGroupconversation.data[0].channelMessages[sendGroupconversation.data[0].channelMessages.length - 1]]);
            setNewMessage("");
        }
    };

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const giveMyEmail = {
                    email: user.emails[0].value
                }
                const res = await axios.post("https://ventas-v1.herokuapp.com//users/all", giveMyEmail);
                setAllUsers(res.data);

                // console.log("users rendered");
            } catch (err) {
                console.log(err);
            }
        };
        const getFriends = async () => {
            try {
                const giveMyEmail = {
                    email: user.emails[0].value
                }
                const res = await axios.post("https://ventas-v1.herokuapp.com//users/friends", giveMyEmail);
                setFriends(res.data);

                // console.log("friends rendered");
            } catch (err) {
                console.log(err);
            }
        };
        const getChannels = async () => {
            try {
                const giveMyEmail = {
                    email: user.emails[0].value
                }
                const res = await axios.post("https://ventas-v1.herokuapp.com//channels/all", giveMyEmail);
                setChannels(res.data);
                // console.log(channels);
            } catch (err) {
                console.log(err);
            }
        };
        getAllUsers();
        getFriends();
        getChannels();
    }, [arrivalMessage, updateContactList, user.emails[0].value]);


    useEffect(() => {
        const fetchConversation = async () => {
            if (currentChat.email) {
                try {
                    const conversation = {
                        senderId: user.emails[0].value,
                        recieverId: currentChat.email,
                        senderName: user.displayName,
                        recieverName: currentChat.username
                    }
                    const checkconv = await axios.post("https://ventas-v1.herokuapp.com//conversation/find", conversation)

                    const result = checkconv.data ? checkconv.data : false;

                    if (result) {
                        setConversationId(result._id);
                        // console.log("exist");
                    }
                    else {
                        const savedConv = await axios.post("https://ventas-v1.herokuapp.com//conversation/create", conversation)
                        // console.log("just Created");
                        setConversationId(savedConv._id);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchConversation();
    }, [currentChat.email, user.displayName, user.emails[0].value]);

    useEffect(() => {
        if (currentChat.email) {
            setName(currentChat.username);
            const fetchThisConv = {
                conId: conversationId
            }
            const getAllmessages = async () => {
                const res = await axios.post("https://ventas-v1.herokuapp.com//message/fetchMessage", fetchThisConv);
                setFetchMessage(res.data);
                console.log("fetch:- " + conversationId);
            };
            getAllmessages();

            onlineFriends.map((find, keys) => {
                if (find.userEmail === currentChat.email) {
                    setIdToCall(find.socketId)
                }
            })
            // console.log(call[0], call[1]);
            onlineFriends.map((friend, keys) => {
                if (friend.userEmail == user.emails[0].value) {
                    setMe(friend.socketId)
                }
            });
        }
    }, [conversationId, arrivalMessage, currentChat.email]);


    useEffect(() => {
        if (currentGroupChat._id) {
            setName(currentGroupChat.channelName);
            const fetchGroupConv = {
                conId: currentGroupChat._id
            }

            const getAllGroupMessages = async () => {
                const res = await axios.post("https://ventas-v1.herokuapp.com//channels/fetchMessages", fetchGroupConv);
                setFetchGroupConversation(res.data[0].channelMessages);
            };

            getAllGroupMessages();
            // onlineFriends.map((find, keys) => {
            //     if (find.userEmail === currentChat.email) {
            //         setIdToCall(find.socketId)
            //     }
            // });

            // console.log(call[0], call[1]);
            onlineFriends.map((friend, keys) => {
                if (friend.userEmail === user.emails[0].value) {
                    setMe(friend.socketId)
                }
            });
        }
    }, [currentGroupChat._id, arrivalMessage]);


    useEffect(() => {
        if (currentChat.email || currentGroupChat.channelName) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            // console.log("scrolling");
        }
    }, [fetchMessage, currentChat.email, currentGroupChat, fetchGroupConversation]);


    useEffect(() => {
        // console.log("peered");
        // Reference call[video,audio,scree]

        if (call[0] && call[1] && (call[2] === false)) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                setStream(stream)
                myVideo.current.srcObject = stream
            })
        }
        else if ((call[0] === false) && call[1] && (call[2] === false)) {
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
                setStream(stream)
                myVideo.current.srcObject = stream
            })
        }
        else if ((call[0] === false) && (call[1] === false) && call[2]) {
            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then((stream) => {
                setStream(stream)
                myVideo.current.srcObject = stream
            });
        }
        else {
        }
    }, [call])

    const addMemberToChannel = async (emailToAdd, channelToAdd) => {
        const sendInfo = {
            email: emailToAdd,
            channelId: channelToAdd
        }
        const addMemberNow = await axios.post("https://ventas-v1.herokuapp.com//channels/addMemberNow", sendInfo);
        console.log(addMemberNow.data);
        if (addMemberNow.status === 200) {
            setCurrentGroupChat(addMemberNow.data);
            setUpdateContactList(!updateContactList);
        }
    }

    const removeMemberFromChannel = async (emailToRemove, channelFromRmove) => {
        const sendInfo = {
            email: emailToRemove,
            channelId: channelFromRmove
        }
        const removeMemberNow = await axios.post("https://ventas-v1.herokuapp.com//channels/removeMemberNow", sendInfo);
        console.log(removeMemberNow.data);
        if (removeMemberNow.status === 200) {
            setCurrentGroupChat(removeMemberNow.data);
            setUpdateContactList(!updateContactList);
        }
    }

    const callUser = () => {

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.current.emit("callUser", {
                userToCall: idToCall,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })
        socket.current.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })
        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.current.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
            // console.log(track);
        });

        setCall([false, false, false])
        setStream("")
        setReceivingCall(false)
        setCaller("")
        setCallerSignal("")
        setCallAccepted(false)
        setCallEnded(false)
        myVideo.current = null
        userVideo.current = null
        connectionRef.current = null

        socket.current.emit("callEnded", {
            mySocket: user.emails[0].value,
            userSocket: currentChat.email
        });
    }

    return (
        <>
            <div className='MessangerMainframe'>
                <div className='innerFrame'>
                    <div className='contacts'>
                        <div className='myUser'>
                            <img src={user.photos[0].value} className='userDp' alt='profile_picture' />
                            <span className='userName'>
                                {user.displayName}
                            </span>
                        </div>
                        <div className='chatOptions'>
                            <form className='searchContact' method='post' onSubmit={addFriend}>
                                <input required type="search" onChange={(e) => setaddFriendName(e.target.value)} value={addFriendName} className='searchbar' placeholder='Search Contact' />
                                <button className='searchButton' type='submit'>
                                    <i className='fas fa-search'></i>
                                </button>
                            </form>
                            <form className='addNewChat' method='post' onSubmit={addChannel}>
                                <button className='addButton'>
                                    <i className='fas fa-plus'></i>
                                </button>
                            </form>
                        </div>
                        <div className='allContacts'>
                            {
                                friends.length > 0 ? friends.map((e, key) => {

                                    const oMessageCount = arrivalMessage ? (arrivalMessage.senderEmail === e[0].email) ? true : false : false

                                    let oStatus = false;
                                    onlineFriends.map((onl, keys) => {
                                        if (onl.userEmail === e[0].email) {
                                            oStatus = true
                                        }
                                        return false
                                    });
                                    if (e[0].email !== user.emails[0].value) {
                                        return <>
                                            <div className='frameH' keys={key}>
                                                <span onClick={() => { setCurrentGroupChat([]); setCurrentChat(e[0]); }}>
                                                    <Contacts online={oStatus} user={e[0]} messageCount={oMessageCount} />
                                                </span>
                                                <span className='removeFriend'>
                                                    <i className='fa fa-times' onClick={() => {
                                                        if (window.confirm("do you wanna delete " + e[0].username + "?")) { removeFriend(e[0].email) }
                                                    }}></i>
                                                </span>
                                            </div>
                                        </>
                                    }
                                    return false
                                })
                                    :
                                    ""
                            }

                            <span>
                                {
                                    channels.length > 0 ? channels.map((e, key) => {
                                        return (
                                            <>
                                                <div className='frameH' keys={key}>
                                                    <span onClick={() => { setCurrentGroupChat(e); setCurrentChat([]); }}>
                                                        <Channels content={e} />
                                                    </span>
                                                    <span className='removeFriend'>
                                                        <i className='fa fa-times' onClick={() => { if (window.confirm("do you wanna delete chaanel '" + e.channelName + "' ?")) { deleteChannel(e._id, e.channelName); } }}></i>
                                                    </span>
                                                </div>
                                            </>
                                        )
                                    })
                                        :
                                        ""
                                }
                            </span>
                        </div>
                    </div>
                    <div className='messages'>
                        <div className='chatcategories'>
                            <button className='categoryItem'>Chats</button>
                            <button className='categoryItem'>Groups</button>
                            <button className='categoryItem'>Docs</button>
                        </div>
                        <div className='conversationSection'>
                            {
                                currentChat.profilePicture ?
                                    <>
                                        <div className='currentContact'>
                                            <div className='profileSection'>
                                                <div className='profileHere'>
                                                    <img src={currentChat.profilePicture} alt='dp' />
                                                </div>
                                                <div className='usernameHere'>
                                                    {currentChat.username}
                                                </div>
                                            </div>
                                            <div className='interactionHere'>
                                                <span onClick={() => { setCall([false, true, false]); }}><i className='fas fa-phone-alt'></i></span>
                                                <span onClick={() => { setCall([true, true, false]); }}><i className="fas fa-video"></i></span>
                                                <span onClick={() => { setCall([false, false, true]); }}><i className="fas fa-desktop"></i></span>
                                            </div>
                                        </div>

                                        {
                                            call[0] || call[1] || call[2] || receivingCall ?
                                                <>

                                                    <div className="vidcontainer">
                                                        <div className="video-container">
                                                            <div className="video Myvideo" style={{ backgroundImage: "url(" + user.photos[0].value + ")" }}>
                                                                {stream && <video playsInline muted ref={myVideo} autoPlay />}
                                                                <span className='videoName'>Me</span>
                                                            </div>
                                                            <div>
                                                                <div className="myId">
                                                                    {
                                                                        !receivingCall && callAccepted && !callEnded ?
                                                                            (
                                                                                <>
                                                                                    <button className="callButton hangUpCall" onClick={leaveCall}>
                                                                                        <i className='fa fa-phone' />
                                                                                    </button>
                                                                                </>
                                                                            )
                                                                            :
                                                                            !receivingCall ?
                                                                                (
                                                                                    <button className="callButton dialUpCall" onClick={() => callUser(idToCall)}>
                                                                                        <i className='fa fa-phone' />
                                                                                    </button>
                                                                                ) : ""
                                                                    }
                                                                </div>
                                                                <div>
                                                                    {receivingCall && !callAccepted ? (
                                                                        <div className="caller">
                                                                            <h1>{name}</h1>
                                                                            <button onClick={answerCall}>
                                                                                Answer
                                                                            </button>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="video" style={{ backgroundImage: "url(" + currentChat.profilePicture + ")" }}>
                                                                {callAccepted && !callEnded ?
                                                                    <video playsInline ref={userVideo} autoPlay /> :
                                                                    null}
                                                                <span className='videoName'>{currentChat.username}</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </>
                                                :
                                                // call[0] || call[1] ?
                                                //     <div> Audio Call {currentChat.username} ... </div>
                                                //     :
                                                ""


                                        }
                                        <div className='allMessages'>
                                            {
                                                fetchMessage.map((mes, keys) => {
                                                    if (mes.senderId !== user.emails[0].value) {
                                                        return <span key={keys} ref={scrollRef}><Messages data={currentChat.profilePicture} kind="individual" message={mes} clsName="contactMessage" /></span>
                                                    }
                                                    else {
                                                        return <span key={keys} ref={scrollRef}><Messages data={user.photos[0].value} kind="individual" message={mes} clsName="userMessage" /></span>
                                                    }
                                                })
                                            }
                                        </div>
                                        {file && (
                                            <div className="shareImgContainer">
                                                <div className="shareImg">
                                                    <img src={URL.createObjectURL(file)} alt="" />
                                                </div>
                                                <div className="shareCancelImg" onClick={() => setFile(null)} >
                                                    <i className='fas fa-times'></i>
                                                </div>
                                            </div>
                                        )}
                                        <form className='typing' method='post' onSubmit={handleSubmit}>
                                            <div className='chatFeaturesHolder'>
                                                <input
                                                    type="text"
                                                    className='typeBar'
                                                    required
                                                    placeholder='say hiii'
                                                    ref={desc}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    value={newMessage} />
                                                <input
                                                    style={{ display: "none" }}
                                                    type="file"
                                                    id="file"
                                                    // accept=".png,.jpeg,.jpg"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                />
                                                <label htmlFor="file" className='attachment'>
                                                    <i className="fas fa-paperclip"></i>
                                                </label>
                                            </div>
                                            <button type='submit'>send</button>
                                        </form>
                                    </>
                                    :
                                    currentGroupChat.channelDp ?
                                        <>
                                            {/* ###################################################################################### */}
                                            {/* ################################## GROUP MESSAGING HERE #################################### */}
                                            {/* ###################################################################################### */}
                                            <div className='currentContact' onClick={() => { setViewGroupOptions(!viewGroupOptions) }}>
                                                <div className='profileSection'>
                                                    <div className='profileHere'>
                                                        <img src={currentGroupChat.channelDp} alt='dp' />
                                                    </div>
                                                    <div className='usernameHere'>
                                                        {currentGroupChat.channelName}
                                                    </div>
                                                </div>
                                                <div className='interactionHere'>
                                                    {/* <span onClick={() => setCall([false, true])}><i className='fas fa-phone-alt'></i></span>
                                                    <span onClick={() => setCall([true, true])}><i className="fas fa-video"></i></span>
                                                    <span onClick={() => setChangeScreen(true)}><i className="fas fa-desktop"></i></span> */}
                                                </div>
                                            </div>
                                            {
                                                viewGroupOptions ?
                                                    <div className='groupInfo'>
                                                        <span className='closeButton' onClick={() => { setViewGroupOptions(!viewGroupOptions); setAddingMember(false) }}>
                                                            <i className='fa fa-times'></i>
                                                        </span>
                                                        <div className='upperInfo'>
                                                            <div className='groupDpholder'><img src={currentGroupChat.channelDp} alt='dp' /></div>
                                                            <div className='groupNameHolder'>{currentGroupChat.channelName}</div>
                                                            <div className='groupDescHolder'>
                                                                <span>{currentGroupChat.channelDescription}</span>
                                                            </div>
                                                            <div className='totalMembers'>
                                                                {currentGroupChat.member.length} Members
                                                                <div className='addMember' onClick={() => setAddingMember(!addingMember)}>
                                                                    <i className="fa fa-user-plus"></i>
                                                                    {/* <i className="fa fa-user-edit"></i> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='listToAddMember'>
                                                            {
                                                                addingMember ?
                                                                    friends.length > 0 ? friends.map((e, key) => {

                                                                        const oMessageCount = arrivalMessage ? (arrivalMessage.senderEmail === e[0].email) ? true : false : false

                                                                        let oStatus = false;
                                                                        onlineFriends.map((onl, keys) => {
                                                                            if (onl.userEmail === e[0].email) {
                                                                                oStatus = true
                                                                            }
                                                                            return false
                                                                        });
                                                                        if (e[0].email !== user.emails[0].value) {
                                                                            return <>
                                                                                <div className='frameH' keys={key}>
                                                                                    <span onClick={() => { setCurrentGroupChat([]); setCurrentChat(e[0]); }}>
                                                                                        <Contacts online={oStatus} user={e[0]} messageCount={oMessageCount} />
                                                                                    </span>
                                                                                    <span className='removeFriend'>
                                                                                        <i className='fa fa-user-check' onClick={() => {
                                                                                            if (window.confirm("Add " + e[0].username + " to " + currentGroupChat.channelName + " ?")) { addMemberToChannel(e[0].email, currentGroupChat._id) }
                                                                                        }}></i>
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                        return false
                                                                    })
                                                                        :
                                                                        "No friends to add"
                                                                    :
                                                                    ""
                                                            }
                                                        </div>

                                                        {addingMember ? <hr className='groupInfodevider' /> : ""}
                                                        <div className='MembersTitle'>
                                                            <div>Channel Members</div>
                                                        </div>
                                                        <div className='channelMemberListing'>
                                                            {
                                                                currentGroupChat.member.length > 0 ? currentGroupChat.member.map((e, key) => {
                                                                    // console.log(e)
                                                                    return (
                                                                        allUsers.map((friend, key) => {
                                                                            // return console.log( friend)

                                                                            const oMessageCount = arrivalMessage ? (arrivalMessage.senderEmail === friend.email) ? true : false : false

                                                                            let oStatus = false;
                                                                            onlineFriends.map((onl, keys) => {
                                                                                if (onl.userEmail === friend.email) {
                                                                                    oStatus = true
                                                                                }
                                                                                return false
                                                                            });
                                                                            // console.log(friend[0].email);

                                                                            if (friend.email === e) {
                                                                                if (currentGroupChat.admins.includes(user.emails[0].value)) {//user is also the admin
                                                                                    if (friend.email === user.emails[0].value) {//logged in as this user
                                                                                        return (
                                                                                            <>
                                                                                                <div className='frameH' keys={key}>
                                                                                                    <span>
                                                                                                        <Contacts admin={true} online={oStatus} user={friend} messageCount={oMessageCount} />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    else {
                                                                                        if (currentGroupChat.admins.includes(e)) {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className='frameH' keys={key}>
                                                                                                        <span onClick={() => { setCurrentGroupChat([]); setCurrentChat(friend); }}>
                                                                                                            <Contacts admin={true} online={oStatus} user={friend} messageCount={oMessageCount} />
                                                                                                        </span>
                                                                                                        <span className='removeFriend'>
                                                                                                            <i className='fa fa-user-minus' onClick={() => {
                                                                                                                if (window.confirm("Remove " + friend.username + " as " + currentGroupChat.channelName + "  admin ?")) { }
                                                                                                            }}></i>
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                        else {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className='frameH' keys={key}>
                                                                                                        <span onClick={() => { setCurrentGroupChat([]); setCurrentChat(friend); }}>
                                                                                                            <Contacts admin={false} online={oStatus} user={friend} messageCount={oMessageCount} />
                                                                                                        </span>
                                                                                                        <span className='removeFriend'>
                                                                                                            <i className='fa fa-user-minus' onClick={() => {
                                                                                                                if (window.confirm("remove " + friend.username + " from " + currentGroupChat.channelName + " ?")) {
                                                                                                                    removeMemberFromChannel(e, currentGroupChat._id)
                                                                                                                }
                                                                                                            }}></i>
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </>
                                                                                            )
                                                                                        }

                                                                                    }
                                                                                }
                                                                                else {//logged in none admin
                                                                                    if (friend.email === user.emails[0].value) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className='frameH' keys={key}>
                                                                                                    <span>
                                                                                                        <Contacts admin={false} online={oStatus} user={friend} messageCount={oMessageCount} />
                                                                                                    </span>
                                                                                                    <span className='removeFriend'>
                                                                                                        <i title='leave' className='fa fa-power-off' onClick={() => {
                                                                                                            if (window.confirm("Do you want to leave " + currentGroupChat.channelName + " ?")) {
                                                                                                                removeMemberFromChannel(e, currentGroupChat._id)
                                                                                                            }
                                                                                                        }}></i>
                                                                                                    </span>
                                                                                                </div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    else {
                                                                                        if (currentGroupChat.admins.includes(e)) {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className='frameH' keys={key}>
                                                                                                        <span onClick={() => { setCurrentGroupChat([]); setCurrentChat(friend); }}>
                                                                                                            <Contacts admin={true} online={oStatus} user={friend} messageCount={oMessageCount} />
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                        else {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className='frameH' keys={key}>
                                                                                                        <span onClick={() => { setCurrentGroupChat([]); setCurrentChat(friend); }}>
                                                                                                            <Contacts admin={false} online={oStatus} user={friend} messageCount={oMessageCount} />
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            else {
                                                                                return false
                                                                            }
                                                                        })
                                                                    )
                                                                }) :
                                                                    <div className='noMember'>No members yet</div>
                                                            }
                                                        </div>
                                                    </div> : ""
                                            }
                                            <div className='allMessages'>
                                                {
                                                    fetchGroupConversation.map((mes, keys) => {
                                                        if (mes.senderEmail !== user.emails[0].value) {
                                                            return <span key={keys} ref={scrollRef}>
                                                                <Messages data={currentGroupChat.channelDp} kind="group" message={mes} clsName="contactMessage" />
                                                            </span>
                                                        }
                                                        else {
                                                            return <span key={keys} ref={scrollRef}>
                                                                <Messages data={user.photos[0].value} kind="group" message={mes} clsName="userMessage" />
                                                            </span>
                                                        }
                                                    })
                                                }
                                            </div>
                                            {file && (
                                                <div className="shareImgContainer">
                                                    <div className="shareImg">
                                                        <img src={URL.createObjectURL(file)} alt="" />
                                                    </div>
                                                    <div className="shareCancelImg" onClick={() => setFile(null)} >
                                                        <i className='fas fa-times'></i>
                                                    </div>
                                                </div>
                                            )}
                                            <form className='typing' method='post' onSubmit={handleGroupSubmit}>
                                                <div className='chatFeaturesHolder'>
                                                    <input
                                                        type="text"
                                                        className='typeBar'
                                                        required
                                                        placeholder='say hiii'
                                                        ref={desc}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        value={newMessage} />
                                                    <input
                                                        style={{ display: "none" }}
                                                        type="file"
                                                        id="file"
                                                        // accept=".png,.jpeg,.jpg"
                                                        onChange={(e) => setFile(e.target.files[0])}
                                                    />
                                                    <label htmlFor="file" className='attachment'>
                                                        <i className="fas fa-paperclip"></i>
                                                    </label>
                                                </div>
                                                <button type='submit'>send</button>
                                            </form>
                                        </>
                                        :
                                        <span className='conversationStart'>
                                            Please Start A conversation
                                        </span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default MessangerLayout