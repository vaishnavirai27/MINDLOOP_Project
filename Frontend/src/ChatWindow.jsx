import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext ,useState,useEffect} from "react";
import {HashLoader} from "react-spinners";

function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currThreadID,prevChats,setPrevChats,setNewChat}=useContext(MyContext);
    const [loading,setLoading]=useState(false);
    const[isOpen,setIsOpen]=useState(false);//set default as false

    const getReply=async()=>{
        setLoading(true);
        setNewChat(false);
        const options={
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadID:currThreadID

            })

         };
         try{
            const response=await fetch("http://localhost:8080/api/chat",options);
            const res=await response.json();
            console.log(res);
            setReply(res.reply);

         }catch(err){
            console.log(err);
         }
         setLoading(false);
    }


    //append new chats to prev chats
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats=>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },
            {
                role:"assistant",
                content:reply
            }]
            ))
        }
        setPrompt("");

    },[reply]);

    const handleProfileClick=()=>{
        setIsOpen(!isOpen);
    }



    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>MINDLOOP <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings </div>
                    <div className="dropDownItem"> <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
                    <div className="dropDownItem"> <i className="fa-solid fa-right-from-bracket"></i> Log out </div>
                </div>
            }

            <Chat></Chat>
            <HashLoader color="#fff" loading={loading}>

            </HashLoader>


            <div className="chatInput">
                  <div className="inputBox">
                    <input placeholder="Ask anything..." 
                    value={prompt}
                    onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e)=>e.key==="Enter" ?getReply():" "}
                    
                    >
                    
                    </input>
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                  </div>
                  <p className="info">
                    MINDLOOP can make mistakes. Please verify critical information.
                  </p>
            </div>
        </div>
    );
}

export default ChatWindow;