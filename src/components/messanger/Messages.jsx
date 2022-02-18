import { format } from "timeago.js";
import DownloadLink from "react-download-link";
// import { Link } from "react-router-dom";
import FileDownload from "js-file-download";
// import path from "path";

import axios from "axios";
const Messages = ({ data, kind, message, clsName }) => {

    const downloadNow = async (urlPath) => {
        await axios({
            url: "https://ventas-v1.herokuapp.com/download?path=" + urlPath,
            method: "GET",
            responseType: "blob"
        }).then((res) => {
            // console.log(res.data);
            FileDownload(res.data, urlPath.split("/")[urlPath.split("/").length - 1]);
        })
    }

    const getMediaMsg = () => {
        const supportedMedia = ["jpg", "jpeg", "png", "tif", "gif", "JPG", "JPEG", "PNG", "TIF", "GIF"];
        if (message.text.src) {
            if (supportedMedia.includes(message.text.type)) {
                return (
                    <>

                        <div className="coverImage">
                            <span className="downloadIcon">
                                <abbr title={message.text.src.split("/")[message.text.src.split("/").length - 1]}>
                                    <span className="fileName">{message.text.src.split("/")[message.text.src.split("/").length - 1].split(".")[message.text.src.split("/")[message.text.src.split("/").length - 1].split(".").length - 1]} File</span>
                                    <i onClick={() => downloadNow(message.text.src)} className="fas fa-download"></i>
                                </abbr>
                            </span>
                            <img alt="img" className='msgImage' src={message.text.src} />
                        </div>

                        <span>{message.text.message}</span>
                    </>
                )
            }
            else {
                return (
                    <>

                        <div className="coverImage">
                            <span className="downloadIcon">
                                <abbr title={message.text.src.split("/")[message.text.src.split("/").length - 1]}><i onClick={() => downloadNow(message.text.src)} className="fas fa-download"></i></abbr>
                                <span className="fileName">{message.text.src.split("/")[message.text.src.split("/").length - 1].split(".")[message.text.src.split("/")[message.text.src.split("/").length - 1].split(".").length - 1]} File</span>
                            </span>
                            <img alt="img" className='msgImage' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKn0Wlac09KdThD3hIB9vHVlX3hZsym5_JuFwknrw6rGULNT7TWH2MqaCSpRG4lPboB6o&usqp=CAU" />
                        </div>
                        <span>{message.text.message}</span>
                    </>
                )
            }

        }
        else {
            return message.text.message
        }
    };

    return (
        <>
            <div className={'messageFrame ' + clsName}>
                <div className='messageBox'>
                    <span className='messageImage'>
                        <img src={data} alt="img" />
                    </span>
                    <span>
                        {
                            getMediaMsg()
                        }
                    </span>
                    <br />
                    <span className='timeago'>
                        {format(kind === "group" ? message.text.createdAt : message.createdAt)}
                    </span>
                </div>
            </div>
        </>
    )
};

export default Messages