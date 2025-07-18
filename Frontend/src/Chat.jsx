import "./Chat.css";
import  React, {useContext, useState,useEffect} from "react";
import { MyContext } from "./MyContext";
import ReactMarkDown from "react-markdown";
import rhypeHiglight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


//react-markdown
//rehype-highlight

function Chat() {
    const {newChat,prevChats,reply}=useContext(MyContext);
    const [latestReply,setLatestReply]=useState(null);

    useEffect(()=>{
        if(reply===null){
            setLatestReply(null);//prev chat load
            return;
        }
        if(!prevChats?.length) return ;
        //latest reply
        const content=reply.split(" ");//individual words
        let idx=0;
        const interval=setInterval(()=>{
            setLatestReply(content.slice(0,idx+1).join(" "));
            idx++;
            if(idx>=content.length) clearInterval();
        
        },40);
        return()=>{
            clearInterval(interval);
        }


    },[prevChats,reply])

    return ( 
    <>
    {newChat && <h1>Start a new Chat!</h1>}
    <div className="chats">
        {
            prevChats?.slice(0,-1).map((chat,idx)=>
                <div className={chat.role==="user"?"userDiv":"gptDiv"} key={idx}>
                    {
                        chat.role==="user"?
                        <p className="userMessage">{chat.content}</p>:
                        <ReactMarkDown rehypePlugins={[rhypeHiglight]}>{chat.content}</ReactMarkDown>
                    }
                </div>
            )
        }
        {
            prevChats.length>0 && latestReply !=null &&
            <div className="gptDiv" key={"typing"}>
                <ReactMarkDown rehypePlugins={[rhypeHiglight]}>{latestReply}</ReactMarkDown>

            </div>
        }
        {
             prevChats.length>0 && latestReply ===null &&
            <div className="gptDiv" key={"non-typing"}>
                <ReactMarkDown rehypePlugins={[rhypeHiglight]}>{prevChats[prevChats.length-1].content}</ReactMarkDown>

            </div>
        }
    </div>
    </>
     );
}

export default Chat;