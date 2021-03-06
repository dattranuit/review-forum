import axios from "axios"
import { React, useEffect, useState, Fragment } from "react"
import { Segment, Grid, Icon, Image, Dropdown, Button, Container } from 'semantic-ui-react';
import './ListThread.css'
import { Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import moment from 'moment';
import Pagination from "react-js-pagination";
import Loading from "./Loading";
import {host} from "../constant"
import Search from "./Search"
const ListThread = () => {

    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userData, setUserData] = useState({ permission: 0 })
    const [isLogin, setIsLogin] = useState(false);
    const [numDoc, setNumDoc] = useState(0);
    const [curPage, setCurPage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [dataSearch, setDataSearch] = useState({});

    const fetchData = (idCategory, page=1) => {
        setIsLoading(true);
        Promise.all([axios.get(`${host}/api/threads/${idCategory}/categories?page=${page}&limit=10`)])
            .then(([results]) => {
                setData(results.data.threads);
                setNumDoc(results.data.numDoc);
                setCurPage(page);
                localStorage.setItem('current-page', page)
                setIsLoading(false);
            })
            .catch()
    }

    const fetchUser = async () => {
        let res = await axios.get(`${host}/api/users/me`, { headers: { "x-access-token": localStorage.getItem('x-access-token') } });
        if (res.data.code === -1)
            console.log('you not login')
        else {
            setUserData(res.data);
            setIsLogin(true);
        }
    }

    const axiosData = async (page=1) => {
        setIsLoading(true);
        //localStorage.setItem('current-page', page)
        Promise.all([axios.get(`${host}/api/categories/`),
        axios.get(`${host}/api/threads/?page=${page}&limit=10`), axios.get(`${host}/api/threads/all`)])
            .then(([categories, threads,allSearch]) => {
                setDataSearch(allSearch.data);
                setData(threads.data.threads);
                setCategories(categories.data);
                setNumDoc(threads.data.numDoc);
                setCurPage(page);
                localStorage.setItem('current-page', page)
                setIsLoading(false);
            })
            .catch()
        //const result = await axios.get("http://localhost:9999/api/threads");
    };

    const handlePageChange = (page) => {
        axiosData(page);
    }

    useEffect(() => {
        //setCurPage(localStorage.getItem('current-page'))
        axiosData(curPage);
        fetchUser();
        //console.log(curPage)
    }, []);

    const deleteThread = async (id1) => {
        let res = await axios.delete(`${host}/api/threads/${id1}`,
            { headers: { "x-access-token": localStorage.getItem('x-access-token') } });
        axiosData(curPage);
    }
    const updateThread = async (id1, status) => {
        console.log(status)
        let res = await axios.put(`${host}/api/threads/${id1}`, { isOpen: !status },
            { headers: { "x-access-token": localStorage.getItem('x-access-token') } });
        axiosData(curPage);
    }
    const handleFilterCategory = (e, data) => {
        fetchData(data.children.key)
        //console.log()
    }

    return (
        isLoading === true?<Loading isLoading={isLoading}/>
        :<Fragment>
            <Container>
            {isLogin && !userData.banned? 
            <Button style={{marginTop: 5, marginBottom: 5, marginLeft: 960}}><Link to='/forum/new-thread'>New thread</Link></Button> : null}
                <div className="forumContainer">
                    <div className="category-filter">
                        <Dropdown
                            text='Filter'
                            icon='filter'
                            floating
                            labeled
                            button
                            className='icon'
                        >
                            <Dropdown.Menu>
                                <Dropdown.Header icon='tags' content='Filter by category' />
                                <Dropdown.Divider />
                                {categories.map((item, index) => (
                                    <Dropdown.Item onClick={handleFilterCategory}>
                                        <span key={item._id}>{item.category}</span>
                                    </Dropdown.Item>
                                ))}

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Search data={dataSearch} />
                    <Segment.Group className="forum-list">
                        <Segment vertical>
                            <Grid textAlign="left" padded="horizontally">
                                <Grid.Column with={8}>
                                    <Grid.Row className= "list-topic">
                                        <h5>Topic</h5>
                                    </Grid.Row>
                                </Grid.Column>
                                <Grid.Column with={2}>
                                    <Grid.Row className= "list-category">
                                        <h5>Category</h5>
                                    </Grid.Row >
                                </Grid.Column>
                                <Grid.Column with={3}>
                                    <Grid.Row className= "list-reply">
                                        <h5>Replies</h5>
                                    </Grid.Row>
                                </Grid.Column>
                                <Grid.Column with={2}>
                                    <Grid.Row className= "list-activity">
                                        <h5>Last activity</h5>
                                    </Grid.Row>
                                </Grid.Column>
                                
                            </Grid>
                        </Segment>
                        {data.map((item, index) => (
                            item.isDeleted === false ?
                                <Segment vertical key={index}>
                                    <Grid textAlign="left" padded="horizontally">
                                        <Grid.Column width={8}>
                                            <Grid.Row>
                                                <div className="forum-row">
                                                    <Link to="">
                                                        <Image className="forum-avatar" src={item.byUser.avatar !== undefined ? item.byUser.avatar :
                                                            "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"} />
                                                    </Link>

                                                    <div className="forum-column">
                                                        <div>
                                                            {item.isOpen === true ? null : <Icon name='lock' />}
                                                            {/* <Icon name='pin' /> */}
                                                            <Link to={`/forum/thread/${item._id}`}>{item.title}</Link>
                                                        </div>
                                                        <div className="forum-meta">
                                                            <Link to={`/profile/${item.byUser._id}`}>
                                                            {item.byUser.username + "  "}
                                                                
                                                            </Link>
                                                            <Icon name="triangle right" />
                                                            <b> {moment(item.createdAt).fromNow()}</b>
                                                        </div>
                                                        <div className="tags">
                                                            {item.tags.map((it, idx) => (
                                                                <a href="#" className="tag-link">{it}</a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid.Row>
                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            <div className="forum-column forum-stats forum-vertical">
                                                <div style={{ paddingBottom: '5px' }}>
                                                    <span style={{ backgroundColor: item.category.color }} className="tt-badge">{item.category.category}</span>
                                                </div>
                                            </div>

                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            <div className="forum-column forum-stats forum-vertical">
                                                <div style={{ paddingBottom: '5px' }}>
                                                    <Icon name="comment outline" />
                                                    {item.posts.length} replies
                                                </div>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={3}>
                                            <div className="forum-row">
                                                <div className="forum-column">
                                                    <div className="forum-name"></div>
                                                    <div className="forum-meta">
                                                        <Link to="#">
                                                            {/* <Icon name="user" /> */}
                                                            by {item.lastedPostBy}
                                                        </Link>
                                                        <br></br>
                                                        <b>{moment(item.lastedPostAt).fromNow()}</b>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={1}>
                                            {userData.permission === 1 ? <div className="post-dropdown">
                                                <Dropdown simple icon="caret down" direction="left">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() => { deleteThread(item._id) }}
                                                            icon="delete"
                                                            text="Delete"
                                                        />
                                                        <Dropdown.Item
                                                            onClick={() => { updateThread(item._id, item.isOpen) }}
                                                            icon={item.isOpen === true ? "lock" : "unlock"}
                                                            text={item.isOpen === true ? "Close" : "Open"}
                                                        />
                                                        {/* <Dropdown.Item
                                                            onClick={() => { }}
                                                            icon="pin"
                                                            text="Sticky"
                                                        /> */}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div> : null}
                                        </Grid.Column>
                                    </Grid>
                                </Segment>
                                : null
                        ))}
                    </Segment.Group>
                </div>
                
                <div style={{ float: 'right', paddingTop: 15, paddingBottom: 15 }}>
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
        </Fragment>
    )

}

export default ListThread;