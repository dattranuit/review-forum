import axios from "axios"
import { React, useEffect, useState, Fragment } from "react"
import { Row, Col, Card, Button, Form } from "react-bootstrap"
import { useParams, Link } from "react-router-dom"
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Redirect } from "react-router";
import { Segment, Grid, Icon, Image, Dropdown, Container } from 'semantic-ui-react';
import './ListPost.css'
import 'semantic-ui-css/semantic.min.css'
import moment from 'moment';
import quillEmoji from 'quill-emoji';
import "quill-emoji/dist/quill-emoji.css";
import Pagination from "react-js-pagination";
import Loading from "./Loading";
import { host } from "../constant"
import ConfirmModal from "./Confirm";
const DetailsThread = () => {
    const [data, setData] = useState([]);
    const [dataThread, setDataThread] = useState({});
    const params = useParams();
    const [isEdit, setEdit] = useState(false);
    const [idPost, setIdPost] = useState("");
    const [isNewPost, setNewPost] = useState(true);
    const [numDoc, setNumDoc] = useState(0);
    const [curPage, setCurPage] = useState(1);
    const [userData, setUserData] = useState({ permission: 0 })
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rpShow, setRpShow] = useState(false);

    const axiosData = (page) => {
        setIsLoading(true);
        Promise.all([
            axios.get(`${host}/api/threads/${params.id}`),
            axios.get(`${host}/api/threads/${params.id}/posts?page=${page}&limit=10`),
        ])
            .then(([thread, posts]) => {
                setDataThread(thread.data);
                setData(posts.data.posts);
                setNumDoc(posts.data.numDoc);
                setCurPage(page);
                setIsLoading(false);
            })
            .catch();
    };
    const fetchUser = async () => {
        let res = await axios.get(`${host}/api/users/me`, { headers: { "x-access-token": localStorage.getItem('x-access-token') } });
        if (res.data.code === -1)
            console.log('you not login');
        else {
            setUserData(res.data);
            setIsLogin(true);
        }
    }

    useEffect(() => {
        axiosData(1);
        fetchUser();
    }, [params.id]);

    const handlePageChange = (page) => {
        axiosData(page);
    }


    const [editorHtml, setEditorHtml] = useState("");

    const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji;

    Quill.register({
        'formats/emoji': EmojiBlot,
        'modules/emoji-shortname': ShortNameEmoji,
        'modules/emoji-toolbar': ToolbarEmoji,
        'modules/emoji-textarea': TextAreaEmoji
    }, true);

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean'], ['emoji']
        ],
        'emoji-toolbar': true,
        "emoji-textarea": true,
        "emoji-shortname": true,

        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    }

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', "link",
        'image', 'video', 'emoji'
    ]

    const handleContent = (e) => {
        setEditorHtml(e);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            let resEdit = await axios.put(`${host}/api/posts/${idPost}`, { content: editorHtml },
                { headers: { "x-access-token": localStorage.getItem('x-access-token') } })
        }
        if (isNewPost) {
            let res = await axios.post(`${host}/api/posts/`, {
                content: editorHtml,
                inThread: dataThread._id
            }, {
                headers: {
                    'x-access-token': localStorage.getItem('x-access-token')
                }
            });
        }
        axiosData();
        setEditorHtml("");
        setEdit(false);
        setNewPost(true);
    }

    const deletePost = async (id) => {
        let res = await axios.delete(`${host}/api/posts/${id}`, 
        { headers: { "x-access-token": localStorage.getItem('x-access-token') } });
        axiosData();
    }
    // const reportPost  = async(id, reportedBy, reason) =>{
    //     let res = await axios.post(`${host}/api/posts/${id}/report`,
    //     data={
    //         reportedBy:reportedBy,
    //         reason:reason
    //     },
    //     {headers: { "x-access-token": localStorage.getItem('x-access-token') }} );

    // }

    const editContent = (id) => {
        setEdit(true);
        setNewPost(false);
        const data = document.querySelector(".data-content-".concat(id))
        setIdPost(id);
        setEditorHtml(data.innerHTML);
    }

    const reply = (id, name) => {

        const data = document.querySelector(".data-content-".concat(id))
        // let ele = document.createElement("data-content-60cb6db2125a953988f5db40")
        let editedData = data.innerHTML.toString().replaceAll("<blockquote>", "").replaceAll("</blockquote>", "");
        // const newData = ele.appendChild(data)
        let newData = "<blockquote>" + name + " said:" + editedData
            + "</blockquote>"
        console.log(newData);
        setEditorHtml(newData);
    }


    const report = (id) => {
        setRpShow(!rpShow);
    }


    const handleCloseReport = () =>{
        setRpShow(false);
    }
    const actions = (id1, name, userLogin, userPost, idThread) => (
        userLogin.banned === true? null:(
        <div className="post-dropdown">
            <Dropdown simple icon="caret down" direction="left">
                <Dropdown.Menu>
                    
                    {userLogin.permission === 1 || userLogin._id === userPost._id ?
                        <Dropdown.Item
                            onClick={() => { deletePost(id1) }}
                            icon="delete"
                            text="Delete Post"
                        />
                        : null}
                    {userLogin._id === userPost._id ?
                        <Dropdown.Item
                            onClick={() => { editContent(id1) }}
                            icon="edit"
                            text="Edit Post"
                        /> : null
                    }
                    <Dropdown.Item
                        onClick={() => { reply(id1, name) }}
                        icon="reply"
                        text="Reply"
                    />
                    <ConfirmModal id= {id1} name = {userData.username} header={"Report"} trigger={<Dropdown.Item
                        // onClick={() => { report(id) }}
                        icon="flag"
                        text="Report"
                    />}/>

                </Dropdown.Menu>
            </Dropdown>
        </div>
    ));

    return (
        isLoading === true ? <Loading isLoading={isLoading} />
            : <Fragment>
                <div className="threadContainer">
                    <div className="thread-title">
                        {dataThread.title}
                    </div>
                </div>
                <Container>
                
                    {data.map((item, index) =>
                        item.isDeleted === false ?
                            (
                                <Segment key={index} color={index === 0 ? "black" : null}>
                                    <Grid textAlign="left" padded="horizontally">
                                        <Grid.Column width={4}>
                                            <Grid.Row>
                                                {/* <div className="post-row"> */}
                                                <Link to="#">
                                                    <Image className="post-avatar" src={item.byUser.avatar ||
                                                        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"} />
                                                </Link>
                                                <div className="post-column">
                                                    <div className="post-name">{item.byUser.name}</div>
                                                    {/* <div className="user-banned">Banned</div> */}
                                                    <div className="post-username">
                                                        <Link to={`/profile/${item.byUser._id}`}>
                                                            <Icon name="jenkins" />
                                                            {item.byUser.username}
                                                        </Link>
                                                    </div>
                                                    <div className="post-status">
                                                        {item.byUser.permission === 1 ?
                                                            <b className="staff">{'(Admin) '}</b>
                                                            : item.byUser.banned === true?<s className="banned">Banned</s>:"Member"}
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                            </Grid.Row>
                                        </Grid.Column>
                                        <Grid.Column width={12}>
                                            <div className="post-time">
                                                {moment(item.createdAt).fromNow()}
                                                {isLogin == true ? actions(item._id, item.byUser.username, userData, item.byUser) : null}
                                            </div>
                                            <div className="data">
                                                <div className={"data-content-".concat(item._id)} dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                            </div>
                                        </Grid.Column>
                                    </Grid>
                                </Segment>

                            ) : <div>
                                <Segment key={index} color={index === 0 ? "black" : null}>
                                    <Grid textAlign="left" padded="horizontally">
                                        <Grid.Column width={12}>
                                            <div className="data-content">This message has been deleted</div>
                                        </Grid.Column>
                                    </Grid>
                                </Segment>
                            </div>)}
                    <div style={{ paddingLeft:900,  paddingTop: 15, paddingBottom: 15 }}>
                        <Pagination
                            activePage={curPage}
                            itemsCountPerPage={10}
                            totalItemsCount={numDoc}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>
                </Container>

                <Container>
                    {userData.banned===true? <h3>You don't have permission to reply</h3>: dataThread.isOpen === false ? <h3>Thread closed</h3> :
                        isLogin === false ? <h3>You must login to reply this thread</h3> :
                            <Card>
                                <span>Reply thread</span>
                                <ReactQuill
                                    id="htmlContent"
                                    theme="snow"
                                    onChange={handleContent}
                                    value={editorHtml}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Content thread here..."
                                />
                                <Form onSubmit={handleSubmit}>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Card>}
                </Container>
            </Fragment>
    );
}

export default DetailsThread;